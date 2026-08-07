import MasterLayout from "../Layout/MasterLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ status }) {
    return (
        <MasterLayout>
            <Head title="Profile Settings" />

            <div className="mx-auto max-w-5xl space-y-8 pb-12">
                {/* Profile Information Section */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Profile Information
                        </h2>
                        <p className="text-xs text-slate-500">
                            Update your account's profile name and email
                            address.
                        </p>
                    </div>
                    <UpdateProfileInformationForm className="max-w-xl" />
                </div>

                {/* Update Password Section */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Update Password
                        </h2>
                        <p className="text-xs text-slate-500">
                            Ensure your account is using a long, random password
                            to stay secure.
                        </p>
                    </div>
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Delete User Section */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm sm:p-8">
                    <div className="mb-6 border-b border-rose-100 pb-4">
                        <h2 className="text-lg font-semibold text-rose-900">
                            Delete Account
                        </h2>
                        <p className="text-xs text-rose-600">
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted.
                        </p>
                    </div>
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </MasterLayout>
    );
}
