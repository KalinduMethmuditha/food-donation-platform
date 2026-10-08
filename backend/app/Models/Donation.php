<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'food_type',
    'quantity',
    'unit',
    'description',
    'pickup_location',
    'pickup_latitude',
    'pickup_longitude',
    'pickup_deadline',
    'status',
])]
class Donation extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(DonationStatusLog::class);
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'pickup_latitude' => 'decimal:7',
            'pickup_longitude' => 'decimal:7',
            'pickup_deadline' => 'datetime',
        ];
    }
}