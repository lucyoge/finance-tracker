<?php
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('transactions')->group(function () {
        Route::get('fetch-categories', [TransactionController::class, 'fetchCategories'])->name('api.fetch-transaction-categories');
        Route::post('add-category', [TransactionController::class, 'addCategory'])->name('api.add-transaction-category');
        Route::delete('delete-category/{id}', [TransactionController::class, 'deleteCategory'])->name('api.delete-transaction-category');
        Route::get('fetch-transactions', [TransactionController::class, 'fetchTransactions'])->name('api.fetch-transactions');
        Route::post('add-transaction', [TransactionController::class, 'addTransaction'])->name('api.add-transaction');
        Route::delete('delete-transaction/{id}', [TransactionController::class, 'deleteTransaction'])->name('api.delete-transaction');
    });

    Route::prefix('budgets')->group(function () {
        Route::get('fetch-budgets', [BudgetController::class, 'fetchBudgets'])->name('api.fetch-budgets');
        Route::post('add-budget', [BudgetController::class, 'addBudget'])->name('api.add-budget');
        Route::put('update-budget/{id}', [BudgetController::class, 'updateBudget'])->name('api.update-budget');
        Route::delete('delete-budget/{id}', [BudgetController::class, 'deleteBudget'])->name('api.delete-budget');
    });
});

