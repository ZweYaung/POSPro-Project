<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard accessible to Admin and Manager
    Route::get('/dashboard', function () {
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();

        $todaySales = Sale::whereBetween('sale_date', [$todayStart, $todayEnd])->sum('total_amount');
        $todayTransactions = Sale::whereBetween('sale_date', [$todayStart, $todayEnd])->count();
        $lowStockThreshold = 5;
        $lowStockProducts = Product::with('category')
            ->where('quantity', '<=', $lowStockThreshold)
            ->orderBy('quantity', 'asc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'category' => $product->category?->category_name ?? 'Retail Item',
                    'quantity' => $product->quantity,
                ];
            });

        $topProduct = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.sale_date', [$todayStart, $todayEnd])
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select('products.product_name', DB::raw('SUM(sale_items.quantity) as units_sold'))
            ->groupBy('products.id', 'products.product_name')
            ->orderByDesc('units_sold')
            ->first();

        $recentSales = Sale::latest('sale_date')
            ->take(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'customer' => 'Walk-in Customer',
                    'time' => \Carbon\Carbon::parse($sale->sale_date)->format('H:i'),
                    'amount' => (float) $sale->total_amount,
                    'status' => 'Paid',
                ];
            });

        return Inertia::render('Dashboard/Dashboard', [
            'dashboard' => [
                'todaySales' => (float) $todaySales,
                'todayTransactions' => (int) $todayTransactions,
                'lowStockCount' => $lowStockProducts->count(),
                'topProductName' => $topProduct?->product_name ?? 'No sales yet',
                'topProductUnits' => (int) ($topProduct?->units_sold ?? 0),
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
        ]);
    })->middleware('role:admin,manager')->name('dashboard');

    // Sales Register accessible by All Roles
    Route::resource('sales', SaleController::class)
        ->only(['index', 'store']);

    // Products & Reports accessible by Admin & Manager
    Route::middleware('role:admin,manager')->group(function () {
        Route::resource('products', ProductController::class);
        Route::get('/reports', [ReportsController::class, 'index'])->name('reports');
    });

    // User Management restricted strictly to Admin
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class);
    });
});

Route::middleware(['auth', 'role:admin,manager'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
