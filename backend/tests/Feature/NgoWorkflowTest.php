<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NgoWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The test database requires the pdo_sqlite extension.');
        }

        parent::setUp();
    }

    private function authenticate(User $user): void
    {
        $this->app['auth']->forgetGuards();
        $this->withToken($user->createToken('test')->plainTextToken);
    }

    private function createDonation(User $donor, array $attributes = []): Donation
    {
        $donation = $donor->donations()->make([
            'food_type' => 'Cooked meals',
            'quantity' => 5,
            'unit' => 'portions',
            'pickup_location' => '123 Main Street',
            'pickup_deadline' => now()->addDay(),
            'status' => 'published',
        ]);

        $donation->forceFill($attributes)->save();

        return $donation;
    }

    public function test_ngo_feed_shows_current_restaurant_and_household_donations(): void
    {
        $restaurant = User::factory()->create(['role' => 'restaurant']);
        $household = User::factory()->create(['role' => 'household']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $restaurantDonation = $this->createDonation($restaurant);
        $householdDonation = $this->createDonation($household);
        $this->createDonation($household, ['pickup_deadline' => now()->subHour()]);
        $this->createDonation($restaurant, ['status' => 'accepted', 'accepted_by_ngo_id' => $ngo->id]);

        $this->authenticate($ngo);
        $response = $this->getJson('/api/ngo/donations')->assertOk();

        $this->assertEqualsCanonicalizing(
            [$restaurantDonation->id, $householdDonation->id],
            array_column($response->json('available_donations'), 'id'),
        );
        $response->assertJsonCount(1, 'my_donations');

        $this->authenticate($restaurant);
        $this->getJson('/api/ngo/donations')->assertForbidden();
    }

    public function test_only_one_ngo_can_accept_and_donor_sees_the_result(): void
    {
        $donor = User::factory()->create(['role' => 'household']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $otherNgo = User::factory()->create(['role' => 'ngo']);
        $donation = $this->createDonation($donor);

        $this->authenticate($ngo);
        $this->postJson("/api/ngo/donations/{$donation->id}/accept")
            ->assertOk()
            ->assertJsonPath('donation.status', 'accepted')
            ->assertJsonPath('donation.accepted_by_ngo.id', $ngo->id);

        $this->authenticate($otherNgo);
        $this->postJson("/api/ngo/donations/{$donation->id}/accept")->assertStatus(409);
        $this->getJson("/api/ngo/donations/{$donation->id}")->assertForbidden();

        $this->authenticate($donor);
        $this->getJson("/api/donations/{$donation->id}")
            ->assertOk()
            ->assertJsonPath('donation.accepted_by_ngo.name', $ngo->name);
        $this->deleteJson("/api/donations/{$donation->id}")->assertStatus(409);

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'status' => 'accepted',
            'accepted_by_ngo_id' => $ngo->id,
        ]);
        $this->assertDatabaseHas('donation_status_logs', [
            'donation_id' => $donation->id,
            'status' => 'accepted',
            'changed_by_user_id' => $ngo->id,
        ]);
    }

    public function test_ngo_can_assign_an_available_volunteer_to_its_accepted_donation(): void
    {
        $donor = User::factory()->create(['role' => 'restaurant']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);
        $unavailableVolunteer = User::factory()->create(['role' => 'volunteer']);
        $donation = $this->createDonation($donor);

        $this->authenticate($volunteer);
        $this->patchJson('/api/volunteer/availability', ['is_available' => true])
            ->assertOk()
            ->assertJsonPath('is_available', true);

        $this->authenticate($ngo);
        $this->postJson("/api/ngo/donations/{$donation->id}/accept")->assertOk();
        $this->getJson('/api/ngo/volunteers')
            ->assertOk()
            ->assertJsonCount(1, 'volunteers')
            ->assertJsonPath('volunteers.0.id', $volunteer->id);
        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $unavailableVolunteer->id,
        ])->assertUnprocessable()->assertJsonValidationErrors('volunteer_id');

        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $volunteer->id,
        ])
            ->assertOk()
            ->assertJsonPath('donation.status', 'assigned')
            ->assertJsonPath('donation.assigned_volunteer.id', $volunteer->id);

        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $volunteer->id,
        ])->assertStatus(409);

        $this->authenticate($volunteer);
        $this->getJson('/api/volunteer/assignments')
            ->assertOk()
            ->assertJsonCount(1, 'donations')
            ->assertJsonPath('donations.0.id', $donation->id);

        $this->assertDatabaseHas('donation_status_logs', [
            'donation_id' => $donation->id,
            'status' => 'assigned',
            'changed_by_user_id' => $ngo->id,
        ]);
    }

    public function test_other_ngo_and_non_ngo_users_cannot_assign_a_donation(): void
    {
        $donor = User::factory()->create(['role' => 'household']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $otherNgo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $donation = $this->createDonation($donor, [
            'status' => 'accepted',
            'accepted_by_ngo_id' => $ngo->id,
        ]);

        $this->authenticate($otherNgo);
        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $volunteer->id,
        ])->assertForbidden();

        $this->authenticate($donor);
        $this->postJson("/api/ngo/donations/{$donation->id}/assign", [
            'volunteer_id' => $volunteer->id,
        ])->assertForbidden();
        $this->patchJson('/api/volunteer/availability', ['is_available' => true])->assertForbidden();

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'status' => 'accepted',
            'assigned_volunteer_id' => null,
        ]);
    }

    public function test_expired_donations_cannot_be_accepted_or_assigned(): void
    {
        $donor = User::factory()->create(['role' => 'restaurant']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer', 'is_available' => true]);
        $published = $this->createDonation($donor, ['pickup_deadline' => now()->subMinute()]);
        $accepted = $this->createDonation($donor, [
            'status' => 'accepted',
            'accepted_by_ngo_id' => $ngo->id,
            'pickup_deadline' => now()->subMinute(),
        ]);

        $this->authenticate($ngo);
        $this->postJson("/api/ngo/donations/{$published->id}/accept")->assertStatus(409);
        $this->postJson("/api/ngo/donations/{$accepted->id}/assign", [
            'volunteer_id' => $volunteer->id,
        ])->assertStatus(409);
    }

    public function test_ngo_routes_require_authentication(): void
    {
        $this->getJson('/api/ngo/donations')->assertUnauthorized();
        $this->getJson('/api/ngo/volunteers')->assertUnauthorized();
        $this->getJson('/api/volunteer/assignments')->assertUnauthorized();
    }
}
