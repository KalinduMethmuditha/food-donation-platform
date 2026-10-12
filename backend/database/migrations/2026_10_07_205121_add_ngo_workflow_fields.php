<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_available')->default(false)->index();
        });

        Schema::table('donations', function (Blueprint $table) {
            $table->foreignId('accepted_by_ngo_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_volunteer_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('assigned_volunteer_id');
            $table->dropConstrainedForeignId('accepted_by_ngo_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_available');
        });
    }
};
