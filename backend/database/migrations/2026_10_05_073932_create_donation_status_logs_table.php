<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donation_status_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('donation_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('status', 30);

            $table->foreignId('changed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_status_logs');
    }
};