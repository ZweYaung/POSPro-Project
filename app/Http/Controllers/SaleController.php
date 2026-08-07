<?php

namespace App\Http\Controllers;

use App\Models\InventoryLog;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('product_name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'category_name' => $product->category->category_name,
                    ] : null,
                    'selling_price' => (float) $product->selling_price,
                    'quantity' => $product->quantity,
                ];
            });

        return Inertia::render('SalesRegister', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'string', 'in:Cash,Card'],
        ]);

        $cartItems = collect($validated['items']);

        try {
            DB::transaction(function () use ($validated, $cartItems) {
                $products = Product::whereIn('id', $cartItems->pluck('product_id'))
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                $total = 0;

                $sale = Sale::create([
                    'user_id' => auth()->id(),
                    'sale_date' => now(),
                    'payment_method' => $validated['payment_method'],
                    'total_amount' => 0,
                ]);

                foreach ($cartItems as $item) {
                    $product = $products->get($item['product_id']);

                    if (!$product || $item['quantity'] > $product->quantity) {
                        throw new \Exception('Requested quantity exceeds available stock.');
                    }

                    $subtotal = $product->selling_price * $item['quantity'];
                    $total += $subtotal;

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->selling_price,
                        'subtotal' => $subtotal,
                    ]);

                    $product->decrement('quantity', $item['quantity']);

                    InventoryLog::create([
                        'product_id' => $product->id,
                        'user_id' => auth()->id(),
                        'quantity_change' => -$item['quantity'],
                        'change_type' => 'sale',
                        'log_date' => now(),
                    ]);
                }

                $sale->update(['total_amount' => $total]);
            });
        } catch (\Throwable $exception) {
            return redirect()
                ->route('sales.index')
                ->withErrors(['items' => 'Unable to complete sale. Please refresh and try again.']);
        }

        return redirect()
            ->route('sales.index')
            ->with('success', 'Sale completed successfully.');
    }
}
