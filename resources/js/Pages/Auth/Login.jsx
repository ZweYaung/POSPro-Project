import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
// import  from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-15">
                <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-12 py-16 shadow-sm">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="1.8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25M3 8.25l9 6 9-6M3 8.25l9 6 9-6"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            POSPro
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Secure access to your point-of-sale workspace
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-5 max-w-sm mx-auto"
                    >
                        <div>
                            <label
                                for="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                isFocused={true}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="example@pospro.com"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                for="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                placeholder=""
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <PrimaryButton
                            className="block w-full rounded-xl bg-indigo-600 px-4 py-3 justify-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                            disabled={processing}
                        >
                            Login
                        </PrimaryButton>
                    </form>
                </div>
            </main>
        </>
    );
}
