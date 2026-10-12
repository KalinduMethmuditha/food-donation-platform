<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VolunteerAcceptanceTest extends TestCase
{
    use RefreshDatabase;

    private function authenticate(User $user): void
    {
        $this->app['auth']->forgetGuards();
        $this->withToken($user->createToken('test')->plainTextToken);
    }

    private function donation(User $ngo): Donation
    {
        $donor = User::factory()->create(['role' => 'household']);
        $donation = $donor->donations()->make([
            'food_type' => 'Rice', 'quantity' => 5, 'unit' => 'portions',
            'pickup_location' => 'Malabe', 'pickup_deadline' => now()->addHours(4), 'status' => 'accepted',
        ]);
        $donation->forceFill(['accepted_by_ngo_id' => $ngo->id])->save();

        return $donation;
    }

    private function assign(Donation $donation, User $volunteer): void
    {
        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $volunteer->id,
            'volunteer_acceptance_deadline' => now()->addHour()->toIso8601String(),
        ])->assertOk();
    }

    public function test_deadline_editing_stops_after_acceptance_and_pickup_requires_acceptance(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $donation = $this->donation($ngo);
        $this->authenticate($ngo);
        $this->assign($donation, $volunteer);
        $extended = now()->addHours(2)->toIso8601String();
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", ['volunteer_acceptance_deadline' => $extended])->assertOk();
        $this->assertTrue($donation->fresh()->volunteer_acceptance_deadline->equalTo($extended));
        $this->authenticate($volunteer);
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'pickup'])->assertConflict();
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertOk();
        $this->assertNotNull($donation->fresh()->volunteer_accepted_at);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertConflict();
        $this->authenticate($ngo);
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", ['volunteer_acceptance_deadline' => $extended])->assertConflict();
        $this->deleteJson("/api/ngo/donations/{$donation->id}/assignment")->assertConflict();
        $this->authenticate($volunteer);
        foreach (['pickup', 'arrived', 'collected', 'delivered'] as $status) {
            $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => $status])->assertOk();
        }
        $this->authenticate($ngo);
        $this->getJson('/api/ngo/donations')->assertJsonPath('my_donations.0.status', 'delivered');
        $this->authenticate(User::findOrFail($donation->user_id));
        $this->getJson("/api/donations/{$donation->id}")->assertJsonPath('donation.status', 'delivered');
    }

    public function test_expiry_extension_cancellation_and_reassignment_preserve_donation(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $donation = $this->donation($ngo);
        $this->authenticate($ngo);
        $this->assign($donation, $volunteer);
        $this->travel(61)->minutes();
        $this->authenticate($volunteer);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertConflict();
        $this->authenticate($ngo);
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", ['volunteer_acceptance_deadline' => now()->addHour()->toIso8601String()])->assertOk();
        $this->deleteJson("/api/ngo/donations/{$donation->id}/assignment")->assertOk();
        $this->assertDatabaseHas('donations', ['id' => $donation->id, 'status' => 'accepted', 'assigned_volunteer_id' => null, 'volunteer_acceptance_deadline' => null]);
        $this->authenticate($volunteer);
        $this->getJson('/api/volunteer/assignments')->assertJsonCount(0, 'donations');
        $this->getJson('/api/notifications')->assertJsonCount(0, 'notifications');
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertForbidden();
        $this->authenticate($ngo);
        $other = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $this->assign($donation, $other);
        $this->authenticate($other);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertOk();
    }

    public function test_volunteer_cancellation_preserves_donation_and_allows_ngo_reassignment(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $other = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $donation = $this->donation($ngo);
        $this->authenticate($ngo);
        $this->assign($donation, $volunteer);
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertForbidden();
        $this->authenticate($other);
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertForbidden();
        $this->authenticate($volunteer);
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertConflict();
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertOk();
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertOk();
        $this->assertDatabaseHas('donations', [
            'id' => $donation->id, 'status' => 'accepted', 'accepted_by_ngo_id' => $ngo->id,
            'assigned_volunteer_id' => null, 'volunteer_accepted_at' => null, 'volunteer_acceptance_deadline' => null,
        ]);
        $this->getJson('/api/volunteer/assignments')->assertJsonCount(0, 'donations');
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'pickup'])->assertForbidden();
        $this->authenticate($ngo);
        $this->getJson('/api/ngo/donations')->assertJsonPath('my_donations.0.status', 'accepted');
        $this->assign($donation, $other);
        $this->authenticate($other);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertOk();
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'pickup'])->assertOk();
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertOk();
    }

    public function test_manual_corrections_only_move_backward_and_update_shared_views(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $other = User::factory()->create(['role' => 'volunteer']);
        $donation = $this->donation($ngo);
        $this->authenticate($ngo);
        $this->assign($donation, $volunteer);
        $url = "/api/volunteer/assignments/{$donation->id}/correction";
        $this->patchJson($url, ['status' => 'pickup', 'current_status' => 'assigned'])->assertForbidden();
        $this->authenticate($other);
        $this->patchJson($url, ['status' => 'pickup', 'current_status' => 'assigned'])->assertForbidden();
        $this->authenticate($volunteer);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertOk();
        $this->patchJson($url, ['status' => 'pickup', 'current_status' => 'assigned'])->assertConflict();
        foreach (['pickup', 'arrived', 'collected', 'delivered'] as $status) {
            $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => $status])->assertOk();
        }
        $this->deleteJson("/api/volunteer/assignments/{$donation->id}")->assertConflict();
        $this->patchJson($url, ['status' => 'delivered', 'current_status' => 'delivered'])->assertUnprocessable();
        $this->patchJson($url, ['status' => 'collected', 'current_status' => 'arrived'])->assertConflict();
        $this->patchJson($url, ['status' => 'collected', 'current_status' => 'delivered'])->assertOk()->assertJsonPath('donation.status', 'collected');
        $this->authenticate(User::findOrFail($donation->user_id));
        $this->getJson("/api/donations/{$donation->id}")->assertJsonPath('donation.status', 'collected');
        $this->getJson('/api/notifications')->assertJsonCount(0, 'notifications');
        $this->authenticate($ngo);
        $this->getJson('/api/ngo/donations')->assertJsonPath('my_donations.0.status', 'collected');
        $this->authenticate($volunteer);
        $this->patchJson($url, ['status' => 'collected', 'current_status' => 'collected'])->assertConflict();
        $this->patchJson($url, ['status' => 'assigned', 'current_status' => 'collected'])->assertOk();
        $this->assertNotNull($donation->fresh()->volunteer_accepted_at);
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'arrived'])->assertConflict();
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'pickup'])->assertOk();
        $this->assertDatabaseHas('donation_status_logs', ['donation_id' => $donation->id, 'note' => 'Volunteer corrected pickup progress from delivered to collected.']);
    }

    public function test_assignment_actions_enforce_ownership_roles_and_valid_deadlines(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $otherNgo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $otherVolunteer = User::factory()->create(['role' => 'volunteer']);
        $donation = $this->donation($ngo);
        $this->authenticate($ngo);
        foreach ([null, now()->subMinute()->toIso8601String(), now()->addHours(5)->toIso8601String()] as $deadline) {
            $this->postJson("/api/ngo/donations/{$donation->id}/assign", ['volunteer_id' => $volunteer->id, 'volunteer_acceptance_deadline' => $deadline])->assertUnprocessable();
        }
        $this->assign($donation, $volunteer);
        $data = ['volunteer_acceptance_deadline' => now()->addHours(2)->toIso8601String()];
        $this->authenticate($otherNgo);
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", $data)->assertForbidden();
        $this->deleteJson("/api/ngo/donations/{$donation->id}/assignment")->assertForbidden();
        $this->authenticate($otherVolunteer);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertForbidden();
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", $data)->assertForbidden();
        $this->deleteJson("/api/ngo/donations/{$donation->id}/assignment")->assertForbidden();
        $this->authenticate($ngo);
        $this->postJson("/api/volunteer/assignments/{$donation->id}/accept")->assertForbidden();
        $this->patchJson("/api/ngo/donations/{$donation->id}/assignment", ['volunteer_acceptance_deadline' => now()->addHours(5)->toIso8601String()])->assertUnprocessable();
    }
}
