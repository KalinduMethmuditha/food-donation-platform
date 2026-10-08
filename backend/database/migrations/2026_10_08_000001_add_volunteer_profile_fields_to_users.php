<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable();
            $table->string('location', 255)->nullable();
            $table->json('pickup_preferences')->nullable();
            $table->json('notification_preferences')->nullable();
            $table->json('read_notification_ids')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'location', 'pickup_preferences', 'notification_preferences', 'read_notification_ids']);
        });
    }
};
