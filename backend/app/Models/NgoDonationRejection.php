<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['donation_id', 'ngo_id'])]
class NgoDonationRejection extends Model
{
    public function donation(): BelongsTo
    {
        return $this->belongsTo(Donation::class);
    }
}
