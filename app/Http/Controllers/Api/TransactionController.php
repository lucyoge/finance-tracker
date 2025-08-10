<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    use ResponseTrait;

    public function fetchCategories(Request $request)
    {
        $categories = Category::orderBy('name')->get();
        return $this->successResponse('Categories fetched successfully', [
            'categories' => $categories
        ]);
    }

    public function addCategory(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'category' => 'required|string|max:255',
        ]);

        if ($validate->fails()) {
            return $this->errorResponse("Validation error", [
                'errors' => $validate->errors()
            ], 422);
        }

        $category = new Category();
        $category->name = strtolower($request->category);
        $category->save();

        return $this->successResponse('Category added successfully', [
            'category' => $category
        ]);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return $this->successResponse('Category deleted successfully');
    }

    public function fetchTransactions(Request $request)
    {
        if ($request->has('type') && in_array(strtolower($request->type), ['income', 'expense', 'savings'])) {
            $transactions = $request->user()->transactions()
                ->where('type', strtolower($request->type))
                ->with('category')
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        } else {
            $transactions = $request->user()->transactions()
                ->with('category')
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        }
        return $this->successResponse('Transactions fetched successfully', [
            'transactions' => $transactions
        ]);
    }

    public function addTransaction(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'transaction_date' => 'required',
            'amount' => 'required|numeric',
            'type' => 'required|string',
            'description' => 'required|string',
        ]);

        if ($validate->fails()) {
            return $this->errorResponse("Validation error", [
                'errors' => $validate->errors()
            ], 422);
        }

        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $attachment) {
                $path = $attachment->store('attachments', 'public');
                $attachments[] = $path;
            }
        }

        // Find category with name
        $category = Category::where('name', $request->category)->first();
        if (!$category) {
            return $this->errorResponse("Category not found", [
                'errors' => "Category not found"
            ], 422);
        }

        $transaction = $request->user()->transactions()->create([
            'category_id' => $category->id,
            'amount' => $request->amount,
            'type' => strtolower($request->type),
            'transaction_date' => $request->transaction_date,
            'payment_method' => strtolower($request->payment_method),
            'attachments' => $attachments,
            'description' => $request->description
        ]);

        return $this->successResponse('Transaction added successfully', [
            'transaction' => $transaction
        ]);
    }

    public function deleteTransaction(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();

        return $this->successResponse('Transaction deleted successfully');
    }
}
