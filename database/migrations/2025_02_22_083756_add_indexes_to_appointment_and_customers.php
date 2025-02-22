<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->index('is_senior_or_pwd');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->index('app_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            Schema::table('customers', function (Blueprint $table) {
                $table->dropIndex(['is_senior_or_pwd']);
            });

            Schema::table('appointments', function (Blueprint $table) {
                $table->dropIndex(['app_type']);
            });
        });
    }
};
