<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BudgetController extends Controller
{
    use ResponseTrait;

    /**
     * Fetch all budgets for the authenticated user.
     */
    public function fetchBudgets(Request $request)
    {
        $budgets = $request->user()->budgets()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($budgets as $budget) {
            $spent = Transaction::where('category_id', $budget->category_id)
                ->whereBetween('date', [$budget->start_date, $budget->end_date])
                ->sum('amount');

            $percentage = ($spent / $budget->amount) * 100;
            $budget->percentage = $percentage;
        }

        return $this->successResponse('Budgets fetched successfully', [
            'budgets' => $budgets
        ]);
    }

    public function addBudget(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'period' => 'nullable|in:daily,weekly,monthly,yearly',
            'purpose' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validate->fails()) {
            return $this->errorResponse('Validation failed', [
                'errors' => $validate->errors()
            ], 422);
        }

        if ($request->period === 'weekly'){
            $start_date = now()->startOfWeek();
            $end_date = now()->endOfWeek();
        }else if ($request->period === 'monthly') {
            $start_date = now()->startOfMonth();
            $end_date = now()->endOfMonth();
        } else if ($request->period === 'yearly') {
            $start_date = now()->startOfYear();
            $end_date = now()->endOfYear();
        } else {
            $start_date = $request->start_date ?? now();
            $end_date = $request->end_date ?? now()->addMonth();
        }

        $budget = $request->user()->budgets()->create([
            'category_id' => $request->category_id,
            'amount' => $request->amount,
            'period' => $request->period,
            'purpose' => $request->purpose,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'auto_reset' => filter_var($request->auto_reset, FILTER_VALIDATE_BOOLEAN) ?? true
        ]);

        return $this->successResponse('Budget added successfully', [
            'budget' => $budget
        ]);
    }

    public function updateBudget($id, Request $request)
    {
        // Logic to update a budget
        return response()->json(['message' => 'Budget updated successfully']);
    }

    public function deleteBudget($id)
    {
        // Logic to delete a budget
        return response()->json(['message' => 'Budget deleted successfully']);
    }
}
