import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MasterLayout from "../Layout/MasterLayout";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);

export default function Dashboard() {
    const {
        dashboard = {},
        lowStockProducts = [],
        recentSales = [],
    } = usePage().props;
    const {
        todaySales = 0,
        todayTransactions = 0,
        lowStockCount = 0,
        topProductName = "No sales yet",
        topProductUnits = 0,
    } = dashboard;

    return (
        <>
            <Head title="Dashboard" />

            {/* Metrics Section */}
            <section className="mb-6 grid gap-4 lg:grid-cols-4">
                {/* Today's Sales */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Today's Sales
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                        {formatCurrency(todaySales)}
                    </p>
                    <p className="mt-2 text-sm text-emerald-600">
                        {todayTransactions} completed orders
                    </p>
                </div>

                {/* Transactions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Transactions
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                        {todayTransactions}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                        Live today from the sales register
                    </p>
                </div>

                {/* Low Stock Alert */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Low Stock Alert
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                        {lowStockCount}
                    </p>
                    <p className="mt-2 text-sm text-amber-600">
                        Needs reorder soon
                    </p>
                </div>

                {/* Top Product */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Top Product
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">
                        {topProductName}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                        {topProductUnits} units sold today
                    </p>
                </div>
            </section>

            {/* Main Content Split Grid */}
            <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
                {/* Recent Orders Table Container */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Recent Orders
                        </h3>
                        <Link
                            href={route("sales.index")}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500">
                                    <th className="pb-3 font-medium">
                                        Order ID
                                    </th>
                                    <th className="pb-3 font-medium">
                                        Customer
                                    </th>
                                    <th className="pb-3 font-medium">Time</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-6 text-center text-sm text-slate-500"
                                        >
                                            No sales recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentSales.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="border-b border-slate-100"
                                        >
                                            <td className="py-3 font-medium text-slate-900">
                                                #{sale.id}
                                            </td>
                                            <td className="py-3 text-slate-600">
                                                {sale.customer}
                                            </td>
                                            <td className="py-3 text-slate-500">
                                                {sale.time}
                                            </td>
                                            <td className="py-3 text-slate-900">
                                                {formatCurrency(sale.amount)}
                                            </td>
                                            <td className="py-3">
                                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Warning */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Low Stock Warning
                        </h3>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            {lowStockProducts.length}{" "}
                            {lowStockProducts.length === 1 ? "item" : "items"}
                        </span>
                    </div>
                    <ul className="space-y-3">
                        {lowStockProducts.length === 0 ? (
                            <li className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
                                Inventory looks healthy right now.
                            </li>
                        ) : (
                            lowStockProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {product.category}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-amber-600">
                                        {product.quantity} left
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </section>
        </>
    );
}

// Persistent Layout setting ensures the Sidebar & Header don't re-render/flash on page swaps
Dashboard.layout = (page) => <MasterLayout children={page} />;
