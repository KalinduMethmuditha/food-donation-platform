<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AccountProfileTest extends TestCase
{
    use RefreshDatabase;

    private function authenticate(User $user): void
    {
        $this->app['auth']->forgetGuards();
        $this->withToken($user->createToken('test')->plainTextToken);
    }

    private function donation(User $donor, string $status = 'delivered'): Donation
    {
        return $donor->donations()->create([
            'food_type' => 'Rice', 'quantity' => 5, 'unit' => 'portions',
            'pickup_location' => 'Main Street', 'pickup_deadline' => now()->addDay(), 'status' => $status,
        ]);
    }

    public function test_all_roles_can_edit_their_own_profile_and_save_preferences(): void
    {
        $otherUser = User::factory()->create(['email' => 'other@example.com', 'role' => 'household']);
        foreach (['restaurant', 'household', 'ngo', 'volunteer'] as $role) {
            $user = User::factory()->create(['role' => $role]);
            $user->forceFill(['notification_preferences' => ['newPickupAssigned' => false]])->save();
            $this->authenticate($user);
            $this->patchJson('/api/account/profile', [
                'name' => 'Updated Member', 'email' => "$role@example.com", 'phone' => '0771234567', 'location' => 'Colombo',
                'role' => 'ngo', 'id' => $otherUser->id,
            ])->assertOk()->assertJsonPath('user.role', $role)->assertJsonPath('user.id', $user->id);
            $this->getJson('/api/account/profile')->assertOk()->assertJsonPath('user.name', 'Updated Member');
            $this->patchJson('/api/account/preferences', ['generalNotifications' => false])->assertOk()
                ->assertJsonPath('user.notification_preferences.generalNotifications', false)
                ->assertJsonPath('user.notification_preferences.newPickupAssigned', false);
            $this->patchJson('/api/account/profile', ['name' => 'Member', 'email' => 'other@example.com'])->assertUnprocessable();
            $this->postJson('/api/account/support-requests', ['type' => 'Profile', 'description' => 'Please help with my profile photo.'])->assertCreated();
            $this->assertDatabaseHas('volunteer_support_requests', ['user_id' => $user->id]);
        }
        $this->assertSame('other@example.com', $otherUser->fresh()->email);
    }

    public function test_statistics_are_scoped_to_the_account_role(): void
    {
        $donor = User::factory()->create(['role' => 'restaurant']);
        $ngo = User::factory()->create(['role' => 'ngo']);
        $volunteer = User::factory()->create(['role' => 'volunteer']);
        $delivered = $this->donation($donor);
        $delivered->forceFill(['accepted_by_ngo_id' => $ngo->id, 'assigned_volunteer_id' => $volunteer->id])->save();
        $this->donation($donor, 'published');
        $this->donation(User::factory()->create(['role' => 'household']));
        $this->authenticate($donor);
        $this->getJson('/api/account/profile')->assertOk()->assertJsonPath('statistics.total', 2)
            ->assertJsonPath('statistics.active', 1)->assertJsonPath('statistics.delivered', 1);
        foreach ([$ngo, $volunteer] as $user) {
            $this->authenticate($user);
            $this->getJson('/api/account/profile')->assertOk()->assertJsonPath('statistics.total', 1)
                ->assertJsonPath('statistics.active', 0)->assertJsonPath('statistics.delivered', 1);
        }
    }

    public function test_all_roles_can_upload_replace_view_and_remove_photos(): void
    {
        Storage::fake('local');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jY1sAAAAASUVORK5CYII=');
        foreach (['restaurant', 'household', 'ngo', 'volunteer'] as $role) {
            $user = User::factory()->create(['role' => $role]);
            $this->authenticate($user);
            $uploaded = $this->postJson('/api/account/photo', ['photo' => UploadedFile::fake()->createWithContent('photo.png', $png)])
                ->assertOk()->assertJsonMissingPath('user.avatar_path');
            $firstPath = $user->fresh()->avatar_path;
            Storage::disk('local')->assertExists($firstPath);
            $this->get($uploaded->json('user.avatar_url'))->assertOk()->assertHeader('content-type', 'image/png');
            $this->app['auth']->forgetGuards();
            $replacement = $this->postJson('/api/account/photo', ['photo' => UploadedFile::fake()->createWithContent('new.png', $png)])->assertOk();
            $this->assertNotSame($uploaded->json('user.avatar_url'), $replacement->json('user.avatar_url'));
            Storage::disk('local')->assertMissing($firstPath);
            $secondPath = $user->fresh()->avatar_path;
            $this->deleteJson('/api/account/photo')->assertOk()->assertJsonPath('user.avatar_url', null);
            Storage::disk('local')->assertMissing($secondPath);
        }
    }

    public function test_invalid_photos_are_rejected_without_changing_the_account(): void
    {
        Storage::fake('local');
        $user = User::factory()->create(['role' => 'ngo']);
        $this->authenticate($user);
        $this->postJson('/api/account/photo', ['photo' => UploadedFile::fake()->create('bad.txt', 1, 'text/plain')])->assertUnprocessable();
        $this->postJson('/api/account/photo', ['photo' => UploadedFile::fake()->create('large.jpg', 3000, 'image/jpeg')])->assertUnprocessable();
        $this->assertNull($user->fresh()->avatar_path);
    }

    public function test_all_roles_can_delete_an_account_and_tokens_but_keep_anonymized_history(): void
    {
        foreach (['restaurant', 'household', 'ngo', 'volunteer'] as $role) {
            $user = User::factory()->create(['role' => $role, 'password' => 'Password123!']);
            $email = $user->email;
            $donor = in_array($role, ['restaurant', 'household']) ? $user : User::factory()->create(['role' => 'household']);
            $donation = $this->donation($donor);
            if ($role === 'ngo') {
                $donation->forceFill(['accepted_by_ngo_id' => $user->id])->save();
            } elseif ($role === 'volunteer') {
                $donation->forceFill(['assigned_volunteer_id' => $user->id])->save();
            }
            $this->authenticate($user);
            $this->deleteJson('/api/account', ['password' => 'wrong'])->assertUnprocessable();
            $this->deleteJson('/api/account', ['password' => 'Password123!'])->assertOk();
            $this->assertSoftDeleted('users', ['id' => $user->id]);
            $this->assertSame(0, $user->tokens()->count());
            $this->assertDatabaseHas('donations', ['id' => $donation->id]);
            $this->assertSame('Deleted account', User::withTrashed()->findOrFail($user->id)->name);
            $this->assertSame('Deleted account', match ($role) {
                'ngo' => $donation->fresh()->acceptedByNgo->name,
                'volunteer' => $donation->fresh()->assignedVolunteer->name,
                default => $donation->fresh()->user->name,
            });
            $this->app['auth']->forgetGuards();
            $this->getJson('/api/me')->assertUnauthorized();
            $this->postJson('/api/login', ['email' => $email, 'password' => 'Password123!'])->assertUnprocessable();
        }
    }

    public function test_deletion_is_blocked_while_any_role_has_an_active_donation(): void
    {
        foreach (['restaurant', 'household', 'ngo', 'volunteer'] as $role) {
            $user = User::factory()->create(['role' => $role, 'password' => 'Password123!']);
            $donor = in_array($role, ['restaurant', 'household']) ? $user : User::factory()->create(['role' => 'restaurant']);
            $donation = $this->donation($donor, $role === 'volunteer' ? 'assigned' : ($role === 'ngo' ? 'accepted' : 'published'));
            $donation->forceFill(['accepted_by_ngo_id' => $role === 'ngo' ? $user->id : null, 'assigned_volunteer_id' => $role === 'volunteer' ? $user->id : null])->save();
            $this->authenticate($user);
            $this->deleteJson('/api/account', ['password' => 'Password123!'])->assertStatus(409);
            $this->assertNotSoftDeleted('users', ['id' => $user->id]);
        }
    }

    public function test_account_endpoints_require_authentication(): void
    {
        $this->getJson('/api/account/profile')->assertUnauthorized();
        $this->patchJson('/api/account/profile', [])->assertUnauthorized();
        $this->postJson('/api/account/photo', [])->assertUnauthorized();
        $this->deleteJson('/api/account', ['password' => 'Password123!'])->assertUnauthorized();
    }
}
