<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('advisor')->nullable();
            $table->foreign('advisor')->references('id')->on('users');
            $table->uuid('qr_slug')->nullable()->unique();
            $table->boolean('isPreferred')->default(false);
            $table->dateTime('app_datetime');
            $table->enum('app_type', ['WALK-IN', 'APPOINTMENT']);
            $table->dateTime('app_end_datetime')->nullable();
            $table->unsignedBigInteger('vehicle_id');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
            $table->unsignedBigInteger('appointment_by');
            $table->foreign('appointment_by')->references('id')->on('users');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
