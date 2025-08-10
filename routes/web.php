<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\PageController;
use App\Http\Middleware\RegComplete;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PageController::class, 'index'])->name('home');
Route::get('about', [PageController::class, 'about'])->name('about');
Route::get('contact', [PageController::class, 'contact'])->name('contact');
Route::get('faq', [PageController::class, 'faq'])->name('faq');
Route::get('blog', [PageController::class, 'blog'])->name('blog');
Route::get('blog/{slug}', [PageController::class, 'blogPost'])->name('blog.post');
Route::get('team', [PageController::class, 'team'])->name('team');
Route::get('amenities', [PageController::class, 'amenities'])->name('amenities');
Route::get('industries', [PageController::class, 'industries'])->name('industries');
Route::get('corporate-housing', [PageController::class, 'corporateHousing'])->name('corporate_housing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('transactions', [PageController::class, 'manageTransactions'])->name('manage_transactions');
    Route::get('budgeting', [PageController::class, 'budgeting'])->name('budgeting');
    Route::get('goals', [PageController::class, 'goals'])->name('goals');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
