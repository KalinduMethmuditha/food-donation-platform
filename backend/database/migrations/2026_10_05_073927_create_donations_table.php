<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('food_type');
            $table->decimal('quantity', 10, 2);
            $table->string('unit', 50)->default('portions');

            $table->text('description')->nullable();

            $table->string('pickup_location', 500);

            $table->decimal('pickup_latitude', 10, 7)->nullable();
            $table->decimal('pickup_longitude', 10, 7)->nullable();

            $table->dateTime('pickup_deadline');

            $table->string('status', 30)->default('published');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};