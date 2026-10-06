<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'donation_id',
    'status',
    'changed_by_user_id',
    'note',
])]
class DonationStatusLog extends Model
{
    use HasFactory;

    public function donation(): BelongsTo
    {
        return $this->belongsTo(Donation::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'changed_by_user_id'
        );
    }
}