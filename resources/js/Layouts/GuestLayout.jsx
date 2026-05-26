import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        // Latar belakang utama (Mendukung Dark Mode: Slate-50 di terang, Biru sangat gelap di gelap)
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-slate-50 dark:bg-[#020817] selection:bg-sky-500 selection:text-white">
            
            {/* --- DEKORASI BACKGROUND (GLOW EFFECT) --- */}
            <div className="absolute top-0 flex justify-center w-full h-full overflow-hidden pointer-events-none -z-10">
                {/* Glow Biru/Sky di Kiri Atas */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-400/20 dark:bg-sky-600/10 blur-[120px]"></div>
                {/* Glow Indigo di Kanan Bawah */}
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px]"></div>
            </div>

            {/* --- LOGO APLIKASI --- */}
            <div className="relative z-10 mb-6 sm:mb-8">
                <Link href="/" className="flex flex-col items-center group">
                    <ApplicationLogo className="w-16 h-16 transition-transform duration-300 fill-current sm:w-20 sm:h-20 text-sky-600 dark:text-sky-500 group-hover:scale-105" />
                    <span className="mt-3 text-lg font-black tracking-widest uppercase text-slate-800 dark:text-white opacity-90">
                        SIM <span className="text-sky-600 dark:text-sky-400">RS</span>
                    </span>
                </Link>
            </div>

            {/* --- WRAPPER UNTUK CHILDREN (cth: Form Login/Register) --- */}
            {/* Dibuat tanpa background/shadow karena Card-nya sudah dibuat di Login.jsx */}
            <div className="relative z-10 w-full sm:max-w-md">
                {children}
            </div>
            
        </div>
    );
}