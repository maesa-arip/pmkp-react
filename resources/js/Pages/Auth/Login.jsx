import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    EnvelopeIcon, 
    LockClosedIcon, 
    ArrowRightOnRectangleIcon, 
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    // STATE UNTUK SHOW/HIDE PASSWORD
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    // Reusable styling classes untuk form Shadcn Theme
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 focus:bg-white dark:focus:bg-[#0f172a] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400 py-3.5";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="w-full max-w-md mx-auto my-8 sm:my-auto">
                
                {/* --- BENTO CARD LOGIN --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden">
                    
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-600"></div>

                    <div className="p-8 mt-2 sm:p-10">
                        
                        {/* Logo Aplikasi */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 border shadow-sm bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20 rounded-2xl rotate-3 hover:rotate-0">
                                <ShieldCheckIcon className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>

                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Selamat Datang</h2>
                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Silakan masuk ke akun Anda untuk melanjutkan.</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="flex items-center justify-center gap-2 p-4 mb-6 text-sm font-bold text-center border shadow-sm text-emerald-700 bg-emerald-50 border-emerald-200 rounded-xl dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                                <ShieldCheckIcon className="w-5 h-5" />
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* EMAIL INPUT */}
                            <div className="relative flex flex-col">
                                <label htmlFor="email" className={labelClass}>Alamat Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors pointer-events-none group-focus-within:text-sky-500">
                                        <EnvelopeIcon className="w-5 h-5 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 dark:group-focus-within:text-sky-400" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={`${inputClass} pl-11`}
                                        autoComplete="username"
                                        isFocused={true}
                                        handleChange={onHandleChange}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* PASSWORD INPUT */}
                            <div className="relative flex flex-col">
                                <label htmlFor="password" className={labelClass}>Kata Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors pointer-events-none group-focus-within:text-sky-500">
                                        <LockClosedIcon className="w-5 h-5 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 dark:group-focus-within:text-sky-400" />
                                    </div>
                                    
                                    <TextInput
                                        id="password"
                                        // TYPE DIUBAH MENJADI DINAMIS
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        // DITAMBAHKAN pr-11 AGAR TEKS TIDAK MENABRAK IKON MATA
                                        className={`${inputClass} pl-11 pr-11`}
                                        autoComplete="current-password"
                                        handleChange={onHandleChange}
                                        placeholder="••••••••"
                                    />

                                    {/* TOMBOL TOGGLE SHOW/HIDE PASSWORD */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 focus:outline-none"
                                        title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            {/* REMEMBER ME & FORGOT PASSWORD */}
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox 
                                        name="remember" 
                                        value={data.remember} 
                                        handleChange={onHandleChange} 
                                        className="w-4 h-4 transition-colors border-slate-300 rounded cursor-pointer text-sky-600 focus:ring-sky-500 dark:border-slate-700 dark:bg-[#1e293b] dark:checked:bg-sky-500"
                                    />
                                    <span className="ml-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-bold transition-colors text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none focus:underline"
                                    >
                                        Lupa sandi?
                                    </Link>
                                )}
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-2 mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="relative flex items-center justify-center w-full px-8 py-3.5 text-sm font-bold text-white transition-all shadow-md bg-sky-600 rounded-xl hover:bg-sky-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-80 disabled:cursor-not-allowed group overflow-hidden"
                                >
                                    {processing ? (
                                        <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Masuk Sistem
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} Sistem Manajemen Risiko RS.
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}