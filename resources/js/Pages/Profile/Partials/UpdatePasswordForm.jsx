import { useRef } from 'react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { KeyIcon } from '@heroicons/react/24/outline';

export default function UpdatePasswordForm({ className }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    // Styling Helpers
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400 mt-1.5";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400";

    return (
        <section className={className}>
            <header className="px-6 py-5 border-b bg-slate-50/50 dark:bg-transparent border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center">
                    <KeyIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Ubah Kata Sandi</h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Pastikan akun Anda menggunakan kata sandi panjang yang acak agar tetap aman.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={updatePassword} className="p-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className={labelClass}>Kata Sandi Saat Ini</label>
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        handleChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Kata Sandi Baru</label>
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        handleChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={labelClass}>Konfirmasi Kata Sandi</label>
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        handleChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <button 
                        disabled={processing}
                        className="inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-white transition-colors bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Simpan Sandi
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