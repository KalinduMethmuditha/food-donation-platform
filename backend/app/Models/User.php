<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'role', 'password'])]
#[Hidden(['password', 'remember_token', 'avatar_path'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $appends = ['avatar_url'];

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(get: fn (): ?string => $this->avatar_path
            ? route('account.photo', ['user' => $this->id], false).'?v='.hash('sha256', $this->avatar_path)
            : null);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function acceptedDonations(): HasMany
    {
        return $this->hasMany(Donation::class, 'accepted_by_ngo_id');
    }

    public function assignedDonations(): HasMany
    {
        return $this->hasMany(Donation::class, 'assigned_volunteer_id');
    }

    public function statusChanges(): HasMany
    {
        return $this->hasMany(
            DonationStatusLog::class,
            'changed_by_user_id'
        );
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_available' => 'boolean',
            'pickup_preferences' => 'array',
            'notification_preferences' => 'array',
            'read_notification_ids' => 'array',
            'password' => 'hashed',
        ];
    }
}
