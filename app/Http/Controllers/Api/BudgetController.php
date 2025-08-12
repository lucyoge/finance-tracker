<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
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
                ->whereBetween('transaction_date', [$budget->start_date, $budget->end_date])
                ->sum('amount');

            $percentage = ($spent / $budget->amount) * 100;
            $budget->spent = $spent;
            $budget->remaining = $budget->amount - $spent;
            $budget->progress_color = ($percentage < 70) ? "#4caf50" : (($percentage < 90) ? "#ff9800" : "#f44336");
            $budget->percentage = $percentage;
        }

        $budgetsOnPurpose['emergency'] = $this->fetchBudgetsOnPurpose($request->user(), 'Emergency');
        $budgetsOnPurpose['savings'] = $this->fetchBudgetsOnPurpose($request->user(), 'Savings');
        $budgetsOnPurpose['expenses'] = $this->fetchBudgetsOnPurpose($request->user(), 'Expenses');

        return $this->successResponse('Budgets fetched successfully', [
            'budgets' => $budgets,
            'budgets_on_purpose' => $budgetsOnPurpose
        ]);
    }

    private function fetchBudgetsOnPurpose(User $user, string $purpose)
    {
        $budget = $user->budgets()
            ->where('purpose', $purpose)
            ->selectRaw('coalesce(sum(amount), 0) as total_amount, min(start_date) as start_date, max(end_date) as end_date')
            ->first();

        $categoryIds = $user->budgets()
            ->where('purpose', $purpose)
            ->distinct()
            ->pluck('category_id')
            ->toArray();

        $spent = Transaction::whereIn('category_id', $categoryIds)
            ->whereBetween('transaction_date', [$budget->start_date, $budget->end_date])
            ->sum('amount');

        return [
            "$purpose" => [
                'total_amount' => $budget->total_amount,
                'total_spent' => $spent,
                'remaining' => $budget->total_amount - $spent
            ]
        ];
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

        if ($request->period === 'weekly') {
            $start_date = now()->startOfWeek();
            $end_date = now()->endOfWeek();
        } else if ($request->period === 'monthly') {
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

    // Budget Chart Data
    public function budgetChartData(Request $request)
    {
        $budgets = $request->user()->budgets()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        $chartData = [];
        $chartConfig = [];
        $colors = ['#eab308', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6'];
        $colorIndex = 0;

        foreach ($budgets as $budget) {
            $categoryName = strtolower($budget->category->name);
            $color = $colors[$colorIndex % count($colors)];

            $chartData[] = [
                'label' => $categoryName,
                'values' => $budget->amount,
                'fill' => $color
            ];

            $chartConfig[$categoryName] = [
                'label' => ucfirst($categoryName),
                'color' => $color
            ];

            $colorIndex++;
        }
        $id = 'budget-chart';
        return $this->successResponse('Budgets fetched successfully', [
            'budgets' => $budgets,
            'chartData' => $chartData,
            'chartConfig' => $chartConfig,
            'id' => $id
        ]);
    }
}
