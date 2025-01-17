<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\QueueDasboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [QueueDasboardController::class , 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('appointment', AppointmentController::class);
        Route::post('/add-queue', [AppointmentController::class, 'addQueue'])->name('add.queue');
});

require __DIR__.'/auth.php';
