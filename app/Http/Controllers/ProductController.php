<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->latest()
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

        return Inertia::render('Product', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => ['required', 'string', 'max:255'],
            'category_name' => ['required', 'string', 'max:255'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $category = Category::firstOrCreate([
            'category_name' => $validated['category_name'],
        ]);

        Product::create([
            'product_name' => $validated['product_name'],
            'category_id' => $category->id,
            'selling_price' => $validated['selling_price'],
            'quantity' => $validated['quantity'],
        ]);

        return redirect()->route('products.index')->with('success', 'Product added successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_name' => ['required', 'string', 'max:255'],
            'category_name' => ['required', 'string', 'max:255'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $category = Category::firstOrCreate([
            'category_name' => $validated['category_name'],
        ]);

        $product->update([
            'product_name' => $validated['product_name'],
            'category_id' => $category->id,
            'selling_price' => $validated['selling_price'],
            'quantity' => $validated['quantity'],
        ]);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
