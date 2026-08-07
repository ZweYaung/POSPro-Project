import React, { useEffect, useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import MasterLayout from "./layout/MasterLayout";
import Modal from "../Components/Modal";

const initialValues = {
    name: "",
    email: "",
    role: "Cashier",
    password: "",
    password_confirmation: "",
};

export default function UserManagement() {
    const { users = [], auth } = usePage().props;
    const currentUserId = auth?.user?.id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialValues);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedRole]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesName = (user.name ?? "").toLowerCase().includes(query);
            const matchesEmail = (user.email ?? "")
                .toLowerCase()
                .includes(query);
            const matchesRole =
                selectedRole === "All" ||
                (user.role ?? "Cashier") === selectedRole;

            return (matchesName || matchesEmail) && matchesRole;
        });
    }, [users, search, selectedRole]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / itemsPerPage),
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        reset();
        setData({
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role ?? "Cashier",
            password: "",
            password_confirmation: "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    const submit = (event) => {
        event.preventDefault();

        const onSuccess = () => {
            closeModal();
            router.reload({ only: ["users"] });
        };

        if (editingUser) {
            router.put(route("users.update", editingUser.id), data, {
                onSuccess,
                preserveScroll: true,
                preserveState: false,
            });
            return;
        }

        router.post(route("users.store"), data, {
            onSuccess,
            preserveScroll: true,
            preserveState: false,
        });
    };

    const handleDelete = (user) => {
        if (window.confirm(`Delete ${user.name}?`)) {
            router.delete(route("users.destroy", user.id));
        }
    };

    return (
        <>
            <Head title="POSPro | User Management" />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            User Management
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage staff accounts and keep user information up
                            to date.
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
                                placeholder="Search by name or email"
                                className="w-full bg-transparent p-0 border-none outline-none focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400"
                            />
                        </label>

                        <select
                            value={selectedRole}
                            onChange={(event) =>
                                setSelectedRole(event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white shrink-0 cursor-pointer"
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                        </select>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors shrink-0 whitespace-nowrap shadow-sm"
                        >
                            Add User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-slate-500">
                                <th className="pb-3 font-medium">ID</th>
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Email</th>
                                <th className="pb-3 font-medium">Role</th>
                                <th className="pb-3 font-medium">Joined</th>
                                <th className="pb-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-6 text-center text-slate-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="py-3 font-medium text-slate-900">
                                            #{user.id}
                                        </td>
                                        <td className="py-3">{user.name}</td>
                                        <td className="py-3">{user.email}</td>
                                        <td className="py-3">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                {user.role || "Cashier"}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            {user.created_at}
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.id === currentUserId ? (
                                                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                                                        You (Profile)
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user,
                                                                )
                                                            }
                                                            className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user,
                                                                )
                                                            }
                                                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
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
                        {filteredUsers.length === 0 ? 0 : startIndex + 1}-
                        {Math.min(
                            startIndex + itemsPerPage,
                            filteredUsers.length,
                        )}{" "}
                        of {filteredUsers.length} users
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

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingUser ? "Edit User" : "Add User"}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {editingUser
                                    ? "Update the user details below."
                                    : "Create a new staff account for your system."}
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
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData("name", event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData("email", event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Role
                            </label>
                            <select
                                value={data.role}
                                onChange={(event) =>
                                    setData("role", event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Cashier">Cashier</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData("password", event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-rose-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(event) =>
                                        setData(
                                            "password_confirmation",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-rose-600">
                                        {errors.password_confirmation}
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
                                : editingUser
                                  ? "Save Changes"
                                  : "Create User"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

UserManagement.layout = (page) => <MasterLayout children={page} />;
