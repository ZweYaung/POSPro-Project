<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->input('period', '30d');
        $startDate = $this->resolveStartDate($period);
        $endDate = now()->endOfDay();

        $sales = Sale::query()
            ->whereBetween('sale_date', [$startDate, $endDate])
            ->orderByDesc('sale_date')
            ->get();

        $revenue = (float) $sales->sum('total_amount');
        $orders = $sales->count();
        $averageOrderValue = $orders > 0 ? $revenue / $orders : 0;

        $paymentBreakdown = $sales
            ->groupBy('payment_method')
            ->map(function ($group, $method) {
                return [
                    'method' => $method,
                    'orders' => $group->count(),
                    'revenue' => (float) $group->sum('total_amount'),
                ];
            })
            ->values();

        $topProducts = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->whereBetween('sales.sale_date', [$startDate, $endDate])
            ->select(
                'products.id',
                'products.product_name',
                DB::raw('SUM(sale_items.quantity) as units_sold'),
                DB::raw('SUM(sale_items.subtotal) as revenue')
            )
            ->groupBy('products.id', 'products.product_name')
            ->orderByDesc('units_sold')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'units_sold' => (int) $product->units_sold,
                    'revenue' => (float) $product->revenue,
                ];
            });

        $trend = collect();
        $cursor = now()->subDays(6)->startOfDay();

        while ($cursor <= now()->endOfDay()) {
            $daySales = $sales->filter(function ($sale) use ($cursor) {
                $saleDate = Carbon::parse($sale->sale_date);

                return $saleDate->isSameDay($cursor);
            });

            $trend->push([
                'label' => $cursor->format('M d'),
                'revenue' => (float) $daySales->sum('total_amount'),
                'orders' => $daySales->count(),
            ]);

            $cursor->addDay();
        }

        $recentTransactions = $sales->take(8)->map(function ($sale) {
            return [
                'id' => $sale->id,
                'customer' => 'Walk-in Customer',
                'date' => Carbon::parse($sale->sale_date)->format('M d, Y'),
                'time' => Carbon::parse($sale->sale_date)->format('H:i'),
                'amount' => (float) $sale->total_amount,
                'payment_method' => $sale->payment_method,
            ];
        });

        return Inertia::render('Reports', [
            'reports' => [
                'period' => $period,
                'periodLabel' => $this->periodLabel($period),
                'revenue' => $revenue,
                'orders' => $orders,
                'averageOrderValue' => $averageOrderValue,
                'paymentBreakdown' => $paymentBreakdown,
                'topProducts' => $topProducts,
                'trend' => $trend,
                'recentTransactions' => $recentTransactions,
            ],
        ]);
    }

    private function resolveStartDate(string $period): Carbon
    {
        return match ($period) {
            'today' => now()->startOfDay(),
            '7d' => now()->subDays(6)->startOfDay(),
            '30d' => now()->subDays(29)->startOfDay(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->subDays(29)->startOfDay(),
        };
    }

    private function periodLabel(string $period): string
    {
        return match ($period) {
            'today' => 'Today',
            '7d' => 'Last 7 days',
            '30d' => 'Last 30 days',
            'month' => 'This month',
            'year' => 'This year',
            default => 'Last 30 days',
        };
    }
}
