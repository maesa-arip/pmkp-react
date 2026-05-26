import Container from "@/Components/Container";
import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function App({ auth, header, children }) {
    const { flash } = usePage().props;
    
    // STATE REACT: Mengatur Buka/Tutup Sidebar di Mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        if (flash?.type && flash?.message) {
            toast[flash.type](flash.message);
        }
    }, [flash]);

    return (
        <div className="min-h-screen font-sans antialiased text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#020817] selection:bg-sky-500 selection:text-white">
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ className: 'dark:bg-slate-800 dark:text-white rounded-xl shadow-lg' }} />
            
            <Container>
                <div className="grid grid-cols-12 lg:gap-1">
                    
                    {/* SIDEBAR BLOCK (Menerima State) */}
                    <Sidebar 
                        isMobileMenuOpen={isMobileMenuOpen} 
                        setIsMobileMenuOpen={setIsMobileMenuOpen} 
                    />
                    
                    {/* MAIN CONTENT BLOCK */}
                    <div className="col-span-12 col-start-1 my-2 transition-colors border shadow-sm lg:col-span-10 lg:col-start-3 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col min-h-[calc(100vh-1.5rem)]">
                        
                        {/* NAVBAR (Menerima fungsi untuk buka sidebar) */}
                        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        
                        <main className="flex-1 p-4 overflow-x-hidden sm:p-6 custom-scrollbar">
                            {header && <div className="mb-6">{header}</div>}
                            {children}
                        </main>
                    </div>

                </div>
            </Container>

            {/* Global Scrollbar Halus */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
            `}</style>
        </div>
    );
}