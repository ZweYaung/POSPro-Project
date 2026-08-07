import React, { useEffect, useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import MasterLayout from "./layout/MasterLayout";
import Modal from "../Components/Modal";

const initialValues = {
    product_name: "",
    category_name: "",
    selling_price: "",
    quantity: "",
};

const retailCategories = [
    "Beverages",
    "Snacks",
    "Bakery",
    "Frozen Foods",
    "Household",
    "Personal Care",
    "Tobacco",
    "Candy",
    "Instant Foods",
    "Stationery",
];

export default function Product() {
    const { products = [] } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialValues);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesName = product.product_name
                .toLowerCase()
                .includes(query);
            const matchesCategory =
                selectedCategory === "All" ||
                product.category?.category_name === selectedCategory;

            return matchesName && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage),
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        reset();
        setData({
            product_name: product.product_name ?? "",
            category_name: product.category?.category_name ?? "",
            selling_price: product.selling_price ?? "",
            quantity: product.quantity ?? "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset();
    };

    const submit = (event) => {
        event.preventDefault();

        const onSuccess = () => {
            closeModal();
            router.reload({ only: ["products"] });
        };

        if (editingProduct) {
            router.put(route("products.update", editingProduct.id), data, {
                onSuccess,
                preserveScroll: true,
                preserveState: false,
            });
            return;
        }

        router.post(route("products.store"), data, {
            onSuccess,
            preserveScroll: true,
            preserveState: false,
        });
    };

    const handleDelete = (product) => {
        if (window.confirm(`Delete ${product.product_name}?`)) {
            router.delete(route("products.destroy", product.id));
        }
    };

    const getStockBadge = (quantity) => {
        if (quantity <= 0) {
            return "bg-red-100 text-red-700";
        }

        if (quantity <= 5) {
            return "bg-amber-100 text-amber-700";
        }

        return "bg-emerald-100 text-emerald-700";
    };

    const getStockLabel = (quantity) => {
        if (quantity <= 0) {
            return "Out of Stock";
        }

        if (quantity <= 5) {
            return "Low Stock";
        }

        return "In Stock";
    };

    return (
        <>
            <Head title="POSPro | Products" />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Product Inventory
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Monitor stock levels and update product details.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:w-auto sm:flex-row sm:items-center min-w-0">
                        <label className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 sm:w-64 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                            <svg
                                className="mr-2 h-4 w-4 shrink-0 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by product name"
                                className="w-full bg-transparent p-0 border-none outline-none focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400"
                            />
                        </label>

                        <select
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white shrink-0 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            {retailCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors shrink-0 whitespace-nowrap shadow-sm"
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-slate-500">
                                <th className="pb-3 font-medium">ID</th>
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Category</th>
                                <th className="pb-3 font-medium">Price</th>
                                <th className="pb-3 font-medium flex justify-center">
                                    Stock Count
                                </th>
                                <th className="pb-3 font-medium">
                                    Stock Status
                                </th>
                                <th className="pb-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-6 text-center text-slate-500"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="py-3 font-medium text-slate-900">
                                            #{product.id}
                                        </td>
                                        <td className="py-3">
                                            {product.product_name}
                                        </td>
                                        <td className="py-3">
                                            {product.category?.category_name ??
                                                "Uncategorized"}
                                        </td>
                                        <td className="py-3">
                                            $
                                            {Number(
                                                product.selling_price,
                                            ).toFixed(2)}
                                        </td>
                                        <td className="py-3 flex justify-center font-medium text-slate-900">
                                            {product.quantity}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStockBadge(product.quantity)}`}
                                            >
                                                {getStockLabel(
                                                    product.quantity,
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(product)
                                                    }
                                                    className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        {filteredProducts.length === 0 ? 0 : startIndex + 1}-
                        {Math.min(
                            startIndex + itemsPerPage,
                            filteredProducts.length,
                        )}{" "}
                        of {filteredProducts.length} products
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-slate-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(totalPages, page + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {/* Create/Edit form modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingProduct
                                    ? "Edit Product"
                                    : "Add Product"}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {editingProduct
                                    ? "Update the product details below."
                                    : "Create a new product entry for your inventory."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                        >
                            Close
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={data.product_name}
                                onChange={(event) =>
                                    setData("product_name", event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            {errors.product_name && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.product_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Category
                            </label>
                            <select
                                value={data.category_name}
                                onChange={(event) =>
                                    setData("category_name", event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select a category</option>
                                {retailCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category_name && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.category_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.selling_price}
                                    onChange={(event) =>
                                        setData(
                                            "selling_price",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.selling_price && (
                                    <p className="mt-1 text-sm text-rose-600">
                                        {errors.selling_price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.quantity}
                                    onChange={(event) =>
                                        setData("quantity", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-rose-600">
                                        {errors.quantity}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing
                                ? "Saving..."
                                : editingProduct
                                  ? "Save Changes"
                                  : "Create Product"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Product.layout = (page) => <MasterLayout children={page} />;
