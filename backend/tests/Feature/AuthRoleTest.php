<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRoleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The test database requires the pdo_sqlite extension.');
        }

        parent::setUp();
    }

    public function test_household_and_volunteer_can_register_and_sign_in(): void
    {
        foreach (['household', 'volunteer'] as $role) {
            $email = $role.'@example.test';
            $password = 'password123';

            $this->postJson('/api/register', [
                'name' => ucfirst($role).' Donor',
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
                'role' => $role,
            ])
                ->assertCreated()
                ->assertJsonPath('user.role', $role);

            $login = $this->postJson('/api/login', [
                'email' => $email,
                'password' => $password,
            ])
                ->assertOk()
                ->assertJsonPath('user.role', $role)
                ->assertJsonStructure(['token']);

            $this->withToken($login->json('token'))
                ->getJson('/api/me')
                ->assertOk()
                ->assertJsonPath('user.role', $role);
        }
    }
}
