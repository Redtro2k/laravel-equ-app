<?php
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use App\Http\Controllers\QueueDasboardController;
use App\Http\Controllers\QrGeneratorController;
use App\Http\Controllers\QueueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Http\Controllers\ReceiptController;
use Carbon\Carbon;

Route::get('/', [QueueDasboardController::class , 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group(['middleware' => ['role:receptionist']], function () {
        Route::resource('appointment', AppointmentController::class);
        Route::post('/add-queue', [AppointmentController::class, 'addQueue'])->name('add.queue');
    });
    Route::group(['middleware' => ['role:sa'], 'controller' => QueueController::class, 'prefix' => 'queue', 'as' => 'queue.'], function () {
        Route::get('', 'index')->name('index');
        Route::get('next-customer/{id}', 'nextCustomer')->name('next-customer');
        Route::get('sa-active/{id?}', 'setActive')->name('set-active');
        Route::get('sa-inactive', 'setInactive')->name('set-inactive');
        Route::get('call-again/{id}', 'callAgain')->name('call-again');
    });
});
Route::group(['prefix' => 'customer', 'as' => 'customer.'], function(){
    Route::resource('qr', QrGeneratorController::class, ['only' => ['show']]);
    Route::get('printed/{id}', [ReceiptController::class, 'show'])->name('printed');
});


require __DIR__.'/auth.php';
