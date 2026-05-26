import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    EnvelopeIcon, 
    KeyIcon, 
    PaperAirplaneIcon,
    ArrowLeftIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // Reusable styling classes yang sama dengan halaman Login
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 focus:bg-white dark:focus:bg-[#0f172a] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400 py-3.5";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="w-full max-w-md mx-auto my-8 sm:my-auto">
                
                {/* --- BENTO CARD FORGOT PASSWORD --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden">
                    
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-600"></div>

                    <div className="p-8 mt-2 sm:p-10">
                        
                        {/* Ikon Header (Kunci) */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 border shadow-sm bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20 rounded-2xl rotate-3 hover:rotate-0">
                                <KeyIcon className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>

                        {/* Judul & Deskripsi */}
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Lupa Kata Sandi?</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                Jangan khawatir. Masukkan alamat email yang terdaftar dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                            </p>
                        </div>

                        {/* Status Message (Muncul jika email berhasil dikirim) */}
                        {status && (
                            <div className="flex items-start p-4 mb-6 text-sm font-bold border shadow-sm gap-2.5 text-emerald-700 bg-emerald-50 border-emerald-200 rounded-xl dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                                <CheckBadgeIcon className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{status}</span>
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
                                        id="email" // FIX: Memperbaiki bug bawaan Breeze (sebelumnya id="password")
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={`${inputClass} pl-11`}
                                        isFocused={true}
                                        handleChange={onHandleChange}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-2">
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
                                            Kirim Tautan Reset
                                            <PaperAirplaneIcon className="w-5 h-5 ml-2 transition-transform duration-300 -translate-y-0.5 translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* KEMBALI KE LOGIN */}
                            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center text-sm font-bold transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 group"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
                                    Kembali ke halaman Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Footer Copy */}
                <div className="mt-8 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} Sistem Manajemen Risiko RS.
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}