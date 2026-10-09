<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function authenticate(User $user): void
    {
        $this->app['auth']->forgetGuards();
        $this->withToken($user->createToken('test')->plainTextToken);
    }

    private function publish(User $donor): Donation
    {
        $this->authenticate($donor);
        $response = $this->postJson('/api/donations', [
            'food_type' => 'Rice', 'quantity' => 5, 'unit' => 'portions',
            'pickup_location' => 'Main Street', 'pickup_deadline' => now()->addDay()->toIso8601String(),
        ])->assertCreated();

        return Donation::findOrFail($response->json('donation.id'));
    }

    public function test_publication_assignment_and_delivery_reach_the_correct_accounts(): void
    {
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);
        $volunteer->forceFill(['is_available' => true])->save();
        $otherVolunteer = User::factory()->create(['role' => 'volunteer']);

        foreach (['restaurant', 'household'] as $role) {
            $donor = User::factory()->create(['role' => $role]);
            $donation = $this->publish($donor);
            $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');

            $this->authenticate($ngo);
            $this->getJson('/api/notifications')->assertOk()
                ->assertJsonPath('notifications.0.kind', 'published')
                ->assertJsonPath('notifications.0.donation_id', $donation->id);
            $this->postJson("/api/ngo/donations/{$donation->id}/accept")->assertOk();
            $this->postJson("/api/ngo/donations/{$donation->id}/assign", ['volunteer_id' => $volunteer->id])->assertOk();
            $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');

            $this->authenticate($otherVolunteer);
            $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');
            $this->authenticate($volunteer);
            $assigned = $this->getJson('/api/notifications')->assertOk()
                ->assertJsonCount(1, 'notifications')->assertJsonPath('notifications.0.kind', 'assigned');
            $this->patchJson('/api/notifications/read', ['ids' => [$assigned->json('notifications.0.id')]])->assertOk();
            $this->authenticate($volunteer->fresh());
            $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');

            foreach (['pickup', 'arrived', 'collected', 'delivered'] as $status) {
                $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => $status])->assertOk();
            }
            $this->authenticate($donor);
            $delivered = $this->getJson('/api/notifications')->assertOk()
                ->assertJsonCount(1, 'notifications')->assertJsonPath('notifications.0.kind', 'delivered');
            $this->patchJson('/api/notifications/read', ['ids' => [$delivered->json('notifications.0.id')]])->assertOk();
            $this->authenticate($donor->fresh());
            $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');
        }
    }

    public function test_ngo_reads_are_independent_and_expired_or_rejected_donations_are_excluded(): void
    {
        $donor = User::factory()->create(['role' => 'restaurant']);
        $firstNgo = User::factory()->create(['role' => 'ngo']);
        $secondNgo = User::factory()->create(['role' => 'ngo']);
        $available = $this->publish($donor);
        $expired = $this->publish($donor);
        $expired->update(['pickup_deadline' => now()->subHour()]);
        $rejected = $this->publish($donor);
        $this->authenticate($firstNgo);
        $this->postJson("/api/ngo/donations/{$rejected->id}/reject")->assertOk();
        $events = $this->getJson('/api/notifications')->assertOk()->assertJsonCount(1, 'notifications')
            ->assertJsonPath('notifications.0.donation_id', $available->id);
        $this->patchJson('/api/notifications/read', ['ids' => [$events->json('notifications.0.id')]])->assertOk();
        $this->authenticate($firstNgo->fresh());
        $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');
        $this->authenticate($secondNgo);
        $this->getJson('/api/notifications')->assertOk()->assertJsonCount(2, 'notifications');
    }

    public function test_donors_cannot_read_or_acknowledge_other_donors_events(): void
    {
        $donor = User::factory()->create(['role' => 'household']);
        $otherDonor = User::factory()->create(['role' => 'restaurant']);
        $donation = $this->publish($otherDonor);
        $donation->update(['status' => 'delivered']);
        $event = $donation->statusLogs()->create(['status' => 'delivered', 'changed_by_user_id' => $otherDonor->id]);
        $this->authenticate($donor);
        $this->getJson('/api/notifications')->assertOk()->assertJsonCount(0, 'notifications');
        $this->patchJson('/api/notifications/read', ['ids' => [$event->id]])->assertOk()
            ->assertJsonPath('read_notification_ids', []);
        $this->authenticate($otherDonor);
        $this->getJson('/api/notifications')->assertOk()->assertJsonPath('notifications.0.id', $event->id);
    }

    public function test_notification_endpoints_require_authentication_and_valid_ids(): void
    {
        $this->getJson('/api/notifications')->assertUnauthorized();
        $this->patchJson('/api/notifications/read', ['ids' => [1]])->assertUnauthorized();
        $this->authenticate(User::factory()->create(['role' => 'ngo']));
        $this->patchJson('/api/notifications/read', ['ids' => []])->assertUnprocessable();
        $this->patchJson('/api/notifications/read', ['ids' => ['invalid']])->assertUnprocessable();
    }
}
