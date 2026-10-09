<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ngo_donation_rejections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ngo_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['donation_id', 'ngo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ngo_donation_rejections');
    }
};
