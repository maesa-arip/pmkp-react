import { Head } from '@inertiajs/react';
import App from '@/Layouts/App';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Pengaturan Profil" />

            <div className="flex flex-col gap-6 mx-auto max-w-[1200px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600"></div>
                    <div className="relative z-10 flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 mr-4 border rounded-full shadow-sm bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 shrink-0 border-sky-200 dark:border-sky-500/30">
                            <UserCircleIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Pengaturan Profil</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelola informasi identitas dan keamanan kata sandi akun Anda.</p>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT CARDS --- */}
                <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* BENTO 1: Informasi Profil */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm relative overflow-hidden">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full"
                        />
                    </div>

                    {/* BENTO 2: Update Password */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm relative overflow-hidden">
                        <UpdatePasswordForm className="w-full" />
                    </div>

                </div>
            </div>
        </div>
    );
}

Edit.layout = (page) => <App children={page} />;