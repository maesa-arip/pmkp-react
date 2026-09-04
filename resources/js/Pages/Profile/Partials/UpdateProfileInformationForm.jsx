import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // Styling Helpers
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400 mt-1.5";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400";

    return (
        <section className={className}>
            <header className="px-6 py-5 border-b bg-slate-50/50 dark:bg-transparent border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center">
                    <IdentificationIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Informasi Akun</h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Perbarui nama tampilan dan alamat email profil Anda.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="p-6 space-y-6">
                <div>
                    <label htmlFor="name" className={labelClass}>Nama Lengkap</label>
                    <TextInput
                        id="name"
                        className={inputClass}
                        value={data.name}
                        handleChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>Alamat Email</label>
                    <TextInput
                        id="email"
                        type="email"
                        className={inputClass}
                        value={data.email}
                        handleChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 border rounded-xl bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold underline transition-colors hover:text-amber-900 dark:hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                Klik di sini untuk mengirim ulang tautan verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                Tautan verifikasi baru telah dikirimkan ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <button 
                        disabled={processing}
                        className="inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-white transition-colors bg-sky-600 rounded-xl shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Simpan Profil
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 translate-x-4"
                    >
                        <p className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}