<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VolunteerWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The test database requires the pdo_sqlite extension.');
        }

        parent::setUp();
    }

    public function test_only_assigned_volunteer_can_advance_pickup_in_order_and_add_updates(): void
    {
        $donor = User::factory()->create(['role' => 'household']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);
        $otherVolunteer = User::factory()->create(['role' => 'volunteer']);
        $donation = $donor->donations()->create([
            'food_type' => 'Cooked rice', 'quantity' => 4, 'unit' => 'portions',
            'pickup_location' => 'Main Street', 'pickup_deadline' => now()->addDay(),
            'status' => 'assigned',
        ]);
        $donation->forceFill(['assigned_volunteer_id' => $volunteer->id])->save();

        $this->withToken($otherVolunteer->createToken('test')->plainTextToken)
            ->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'pickup'])
            ->assertForbidden();

        $this->withToken($volunteer->createToken('test')->plainTextToken);
        $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => 'collected'])
            ->assertStatus(409);

        foreach (['pickup', 'arrived', 'collected', 'delivered'] as $status) {
            $this->patchJson("/api/volunteer/assignments/{$donation->id}/status", ['status' => $status])
                ->assertOk()
                ->assertJsonPath('donation.status', $status);
        }

        $this->assertDatabaseCount('donation_status_logs', 4);
        $this->assertDatabaseHas('donations', ['id' => $donation->id, 'status' => 'delivered']);
    }

    public function test_volunteer_can_save_notes_profile_and_preferences(): void
    {
        $donor = User::factory()->create(['role' => 'restaurant']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);
        $donation = $donor->donations()->create([
            'food_type' => 'Bread', 'quantity' => 2, 'unit' => 'bags',
            'pickup_location' => 'Market Road', 'pickup_deadline' => now()->addDay(),
            'status' => 'assigned',
        ]);
        $donation->forceFill(['assigned_volunteer_id' => $volunteer->id])->save();
        $this->withToken($volunteer->createToken('test')->plainTextToken);

        $this->postJson("/api/volunteer/assignments/{$donation->id}/updates", ['note' => 'Donor called'])
            ->assertCreated();
        $this->assertDatabaseHas('donation_status_logs', ['donation_id' => $donation->id, 'note' => 'Donor called']);
        $logId = $donation->statusLogs()->firstOrFail()->id;
        $this->patchJson('/api/volunteer/notification-reads', ['ids' => [$logId]])
            ->assertOk()->assertJsonPath('read_notification_ids.0', $logId);

        $this->patchJson('/api/volunteer/profile', [
            'name' => 'New Volunteer', 'email' => 'new-volunteer@example.test',
            'phone' => '+94712345678', 'location' => 'Colombo',
        ])->assertOk()->assertJsonPath('user.name', 'New Volunteer');

        $this->patchJson('/api/volunteer/preferences', [
            'pickup_preferences' => ['preferredArea' => 'Colombo', 'foodTypes' => ['Bread']],
            'notification_preferences' => ['newPickupAssigned' => true],
        ])->assertOk()->assertJsonPath('user.pickup_preferences.preferredArea', 'Colombo');

        $this->postJson('/api/volunteer/support-requests', [
            'type' => 'Pickup Problem', 'description' => 'The address was difficult to find.',
        ])->assertCreated();
        $this->getJson('/api/volunteer/support-requests')->assertOk()->assertJsonCount(1, 'requests');
    }
}
