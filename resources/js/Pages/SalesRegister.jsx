import React, { useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MasterLayout from "./layout/MasterLayout";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

export default function SalesRegister() {
    const { products = [], flash = {}, errors = {} } = usePage().props;
    const [search, setSearch] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [notification, setNotification] = useState("");

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return products;
        }

        return products.filter((product) => {
            const nameMatch = product.product_name
                .toLowerCase()
                .includes(query);
            const categoryMatch = product.category?.category_name
                .toLowerCase()
                .includes(query);
            return nameMatch || categoryMatch;
        });
    }, [products, search]);

    const addToCart = (product) => {
        if (product.quantity <= 0) {
            setNotification("This item is out of stock.");
            return;
        }

        setCartItems((items) => {
            const existing = items.find((item) => item.id === product.id);
            if (existing) {
                const nextQty = existing.quantity + 1;
                if (nextQty > product.quantity) {
                    setNotification("Cannot add more than available stock.");
                    return items;
                }

                return items.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: nextQty }
                        : item,
                );
            }

            return [
                ...items,
                {
                    id: product.id,
                    name: product.product_name,
                    price: product.selling_price,
                    quantity: 1,
                    stock: product.quantity,
                },
            ];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((items) =>
            items
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: Math.max(1, newQuantity) }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const incrementQuantity = (item) => {
        if (item.quantity >= item.stock) {
            setNotification("Reached maximum stock for this item.");
            return;
        }
        updateQuantity(item.id, item.quantity + 1);
    };

    const decrementQuantity = (item) => {
        updateQuantity(item.id, item.quantity - 1);
    };

    const removeItem = (productId) => {
        setCartItems((items) => items.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const taxRate = 0.09;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    const handleSubmit = () => {
        if (cartItems.length === 0) {
            setNotification(
                "Add at least one product to complete the transaction.",
            );
            return;
        }

        router.post(
            route("sales.store"),
            {
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
                payment_method: paymentMethod,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    clearCart();
                },
            },
        );
    };

    return (
        <>
            <Head title="POSPro | Sales Register" />

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.75fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Quick Order Entry
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Search products, add items to the cart, and
                                complete the sale quickly.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
                        >
                            Open Till
                        </button>
                    </div>

                    <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_220px]">
                        <label className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-500">
                            <svg
                                className="mr-3 h-4 w-4 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
                            </svg>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search product or category"
                                className="w-full bg-transparent p-0 border-none outline-none focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400"
                            />
                        </label>
                    </div>

                    {notification || flash.success || errors.items ? (
                        <div className="mb-5 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {notification || flash.success || errors.items}
                        </div>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredProducts.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                No products match your search.
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {product.product_name}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {product.category
                                                    ?.category_name ??
                                                    "Retail Item"}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${product.quantity > 5 ? "bg-emerald-100 text-emerald-700" : product.quantity > 0 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                                        >
                                            {product.quantity > 5
                                                ? `${product.quantity} in stock`
                                                : product.quantity > 0
                                                  ? `${product.quantity} in stock`
                                                  : "Out of stock"}
                                        </span>
                                    </div>

                                    <p className="mb-5 text-sm text-slate-500">
                                        $
                                        {Number(product.selling_price).toFixed(
                                            2,
                                        )}{" "}
                                        each
                                    </p>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => addToCart(product)}
                                            disabled={product.quantity <= 0}
                                            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {formatCurrency(
                                                product.selling_price,
                                            )}
                                        </span>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>

                <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Current Cart
                            </p>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Checkout
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={clearCart}
                            disabled={cartItems.length === 0}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                                Add products to your cart to begin.
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-3xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                ${Number(item.price).toFixed(2)}{" "}
                                                each
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm font-medium text-rose-600 hover:text-rose-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decrementQuantity(item)
                                                }
                                                className="rounded-full px-2 text-slate-700 hover:bg-slate-100"
                                            >
                                                —
                                            </button>
                                            <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    incrementQuantity(item)
                                                }
                                                className="rounded-full px-2 text-slate-700 hover:bg-slate-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatCurrency(
                                                item.price * item.quantity,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                        <div className="mb-4 flex justify-between text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="mb-4 flex justify-between text-sm text-slate-600">
                            <span>Tax</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
                            <span>Grand Total</span>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-700">
                                Payment Method
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {["Cash", "Card"].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${paymentMethod === method ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={cartItems.length === 0}
                            className="w-full rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Complete Transaction
                        </button>
                    </div>
                </aside>
            </section>
        </>
    );
}

SalesRegister.layout = (page) => <MasterLayout children={page} />;
