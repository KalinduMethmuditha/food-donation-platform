<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonationMutationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The test database requires the pdo_sqlite extension.');
        }

        parent::setUp();
    }

    private function donationPayload(): array
    {
        return [
            'food_type' => 'Cooked rice',
            'quantity' => 3,
            'unit' => 'portions',
            'description' => 'Freshly prepared',
            'pickup_location' => '123 Main Street',
            'pickup_deadline' => now()->addDay()->toISOString(),
        ];
    }

    public function test_household_can_update_and_delete_its_published_donation(): void
    {
        $household = User::factory()->create(['role' => 'household']);
        $this->withToken($household->createToken('test')->plainTextToken);

        $donationId = $this->postJson('/api/donations', $this->donationPayload())
            ->assertCreated()
            ->json('donation.id');

        $this->putJson("/api/donations/{$donationId}", [
            ...$this->donationPayload(),
            'food_type' => 'Vegetable meals',
        ])
            ->assertOk()
            ->assertJsonPath('donation.food_type', 'Vegetable meals');

        $this->assertDatabaseHas('donations', ['id' => $donationId, 'food_type' => 'Vegetable meals']);

        $this->deleteJson("/api/donations/{$donationId}")->assertOk();
        $this->assertDatabaseMissing('donations', ['id' => $donationId]);
        $this->assertDatabaseCount('donation_status_logs', 0);
    }

    public function test_other_users_cannot_update_or_delete_a_household_donation(): void
    {
        $household = User::factory()->create(['role' => 'household']);
        $donation = $household->donations()->create([
            ...$this->donationPayload(),
            'status' => 'published',
        ]);
        $otherHousehold = User::factory()->create(['role' => 'household']);
        $this->withToken($otherHousehold->createToken('test')->plainTextToken);

        $this->putJson("/api/donations/{$donation->id}", $this->donationPayload())->assertForbidden();
        $this->deleteJson("/api/donations/{$donation->id}")->assertForbidden();
        $this->assertDatabaseHas('donations', ['id' => $donation->id]);
    }

    public function test_assigned_donations_cannot_be_updated_or_deleted(): void
    {
        $household = User::factory()->create(['role' => 'household']);
        $donation = $household->donations()->create([
            ...$this->donationPayload(),
            'status' => 'assigned',
        ]);
        $this->withToken($household->createToken('test')->plainTextToken);

        $this->putJson("/api/donations/{$donation->id}", $this->donationPayload())->assertStatus(409);
        $this->deleteJson("/api/donations/{$donation->id}")->assertStatus(409);
        $this->assertDatabaseHas('donations', ['id' => $donation->id, 'status' => 'assigned']);
    }

    public function test_household_update_rejects_a_past_pickup_deadline(): void
    {
        $household = User::factory()->create(['role' => 'household']);
        $donation = $household->donations()->create([
            ...$this->donationPayload(),
            'status' => 'published',
        ]);
        $this->withToken($household->createToken('test')->plainTextToken);

        $this->putJson("/api/donations/{$donation->id}", [
            ...$this->donationPayload(),
            'pickup_deadline' => now()->subDay()->toISOString(),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('pickup_deadline');
    }
}
