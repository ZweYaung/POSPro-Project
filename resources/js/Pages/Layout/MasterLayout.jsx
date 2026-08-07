import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function MasterLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;

    const roleLabel = (role) => {
        if (!role) return "User";

        const normalizedRole = String(role).trim().toLowerCase();

        if (normalizedRole === "admin" || normalizedRole === "administrator") {
            return "Admin";
        }

        if (
            normalizedRole === "manager" ||
            normalizedRole === "store manager"
        ) {
            return "Manager";
        }

        if (normalizedRole === "cashier") {
            return "Cashier";
        }

        return String(role).trim();
    };

    const normalizedRole = roleLabel(user?.role).toLowerCase();
    const displayName = user?.name || "User";
    const pageTitle = route().current("dashboard")
        ? "Dashboard"
        : route().current("products.*")
          ? "Products"
          : route().current("sales.*")
            ? "Sales Register"
            : route().current("users.*")
              ? "User Management"
              : route().current("reports")
                ? "Reports"
                : route().current("profile.*")
                  ? "Profile Settings"
                  : "Operations Center";

    const navItems = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            isActive: route().current("dashboard"),
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l9-9 9 9M5.25 10.5V21h13.5V10.5"
                    />
                </svg>
            ),
        },
        {
            name: "Products",
            href: route("products.index"),
            isActive: route().current("products.*"),
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-7.5-4.5-7.5 4.5v9l7.5 4.5 7.5-4.5v-9z"
                    />
                </svg>
            ),
        },
        {
            name: "Sales Register",
            href: route("sales.index"),
            isActive: route().current("sales.*"),
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75h19.5M4.5 15.75V9.75m7.5 6V4.5m7.5 11.25V7.5"
                    />
                </svg>
            ),
        },
        {
            name: "User Management",
            href: route("users.index"),
            isActive: route().current("users.*"),
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.5H4.5A2.25 2.25 0 012.25 17.25V6.75A2.25 2.25 0 014.5 4.5h13.5A2.25 2.25 0 0120.25 6.75v3.75"
                    />
                </svg>
            ),
        },
        {
            name: "Reports",
            href: route("reports"),
            isActive: route().current("reports"),
            icon: (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 18v-6.75A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0120.75 11.25V18"
                    />
                </svg>
            ),
        },
    ].filter((item) => {
        if (normalizedRole === "cashier") {
            return item.name === "Sales Register";
        }

        if (normalizedRole === "manager") {
            return item.name !== "User Management";
        }

        return true;
    });

    const roleBadgeClasses =
        normalizedRole === "admin"
            ? "bg-emerald-100 text-emerald-700"
            : normalizedRole === "manager"
              ? "bg-amber-100 text-amber-700"
              : "bg-sky-100 text-sky-700";

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`sticky top-0 h-screen flex flex-col border-r border-slate-200 bg-white px-3 py-6 shrink-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}
            >
                <div
                    className={`mb-8 flex justify-around items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
                >
                    {!isCollapsed && (
                        <div>
                            <p className="text-lg font-semibold text-slate-900">
                                POSPro
                            </p>
                            <p className="text-sm text-slate-500">
                                Operations Suite
                            </p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href || "#"}
                            className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${item.isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"} ${isCollapsed ? "justify-center" : "gap-3"}`}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {!isCollapsed && (
                    <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                            Need support?
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            Keep your operations running smoothly with daily
                            reminders.
                        </p>
                    </div>
                )}
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Inventory & POS
                            </p>
                            <h2 className="text-xl font-semibold text-slate-900">
                                {pageTitle}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${roleBadgeClasses}`}
                        >
                            {roleLabel(user?.role)}
                        </span>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsProfileOpen((prev) => !prev)
                                }
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {roleLabel(user?.role)}
                                    </p>
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                    {normalizedRole !== "cashier" && (
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                        >
                                            Profile Settings
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            router.post(route("logout"));
                                        }}
                                        className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
