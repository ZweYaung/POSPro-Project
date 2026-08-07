import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MasterLayout from "./layout/MasterLayout";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);

const periods = [
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "month", label: "This month" },
    { value: "year", label: "This year" },
];

export default function Reports() {
    const { reports = {} } = usePage().props;
    const {
        period = "30d",
        periodLabel = "Last 30 days",
        revenue = 0,
        orders = 0,
        averageOrderValue = 0,
        paymentBreakdown = [],
        topProducts = [],
        trend = [],
        recentTransactions = [],
    } = reports;

    const handlePeriodChange = (nextPeriod) => {
        router.get(
            route("reports"),
            { period: nextPeriod },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="POSPro | Reports" />

            <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Performance overview
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                            Sales and inventory reports
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Review revenue, order activity, and top-selling
                            items for {periodLabel.toLowerCase()}.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {periods.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => handlePeriodChange(item.value)}
                                className={`rounded-full px-3 py-2 text-sm font-medium transition ${period === item.value ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Revenue
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {formatCurrency(revenue)}
                        </p>
                        <p className="mt-2 text-sm text-emerald-600">
                            Across {orders} completed orders
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Orders
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {orders}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Average order value{" "}
                            {formatCurrency(averageOrderValue)}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Payment mix
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {paymentBreakdown.length}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Methods in use across the selected period
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Revenue trend
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Daily performance across the last week
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {trend.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                    No sales data available for this period.
                                </div>
                            ) : (
                                trend.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-700">
                                                {item.label}
                                            </span>
                                            <span className="text-slate-900">
                                                {formatCurrency(item.revenue)}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-slate-200">
                                            <div
                                                className="h-2 rounded-full bg-indigo-600"
                                                style={{
                                                    width: `${Math.max(8, (item.revenue / Math.max(revenue, 1)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">
                                            {item.orders} orders
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Top products
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Best sellers by units sold
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {topProducts.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                        No sales activity yet for this period.
                                    </div>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {index + 1}. {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {product.units_sold} units
                                                    sold
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600">
                                                {formatCurrency(
                                                    product.revenue,
                                                )}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Recent transactions
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Latest completed sales
                                    </p>
                                </div>
                                <Link
                                    href={route("sales.index")}
                                    className="text-sm font-medium text-indigo-600"
                                >
                                    View register
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentTransactions.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                        No recent transactions recorded.
                                    </div>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="rounded-2xl border border-slate-200 px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        #{transaction.id}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {transaction.customer} •{" "}
                                                        {transaction.time}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            transaction.payment_method
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Reports.layout = (page) => <MasterLayout children={page} />;
