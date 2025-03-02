<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizationController;
use Honed\Table\TableServiceProvider;

Route::middleware(['auth', 'nav:app'])->group(function () {
    Route::table();
    
    Route::get('/', [DashboardController::class, 'show'])->name('dashboard.show');
    Route::resource('users', UserController::class);
    Route::resource('organizations', OrganizationController::class);
    Route::resource('contacts', ContactController::class);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
