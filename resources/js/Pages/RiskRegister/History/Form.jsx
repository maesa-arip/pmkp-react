import React, { useEffect, useRef } from "react";
import { ClockIcon, ShieldCheckIcon, ExclamationTriangleIcon, SparklesIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function Form({
    model,
    closeButton,
}) {
    // Pengamanan Data Riwayat
    const histories = model?.risk_register_histories || [];
    
    // Referensi untuk area yang bisa di-scroll
    const scrollContainerRef = useRef(null);

    // FIX: Memastikan posisi scroll berada di paling atas saat modal pertama kali dibuka
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [model]);

    // Helper Format Tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', { 
            day: 'numeric', month: 'long', year: 'numeric', 
            hour: '2-digit', minute:'2-digit' 
        });
    };

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* FIX: Elemen ini tidak terlihat (sr-only) tapi berguna untuk "menangkap" auto-focus 
                bawaan Headless UI agar layar tidak otomatis scroll ke tombol paling bawah */}
            <button type="button" className="sr-only" autoFocus>
                Top of Modal
            </button>
            
            {/* Scrollable Content Area */}
            <div ref={scrollContainerRef} className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar scroll-smooth">
                
                {/* --- SECTION 1: KONTEKS RISIKO --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative overflow-hidden p-6">
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 pl-2">
                        <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                        Konteks Risiko: <span className="ml-1.5 text-sky-600 dark:text-sky-400">{model?.kode_risiko}</span>
                    </div>
                    <p className="pl-2 text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        {model?.pernyataan_risiko || "Tidak ada pernyataan risiko."}
                    </p>
                    <div className="pt-4 mt-4 ml-2 text-[12px] font-medium text-slate-600 border-t border-slate-100 dark:border-slate-800 dark:text-slate-400">
                        <span className="block mb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">Sebab Utama:</span> 
                        {model?.sebab || "-"}
                    </div>
                </div>

                {/* --- SECTION 2: TIMELINE HISTORY --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex-1">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent">
                        <h3 className="flex items-center text-base font-bold text-slate-900 dark:text-white">
                            <ClockIcon className="w-5 h-5 mr-2 text-sky-500" />
                            Jejak Riwayat (Timeline History)
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Linimasa perubahan status dan aktivitas pada data risiko ini.</p>
                    </div>
                    
                    <div className="p-6">
                        {histories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                                <ClockIcon className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-600" />
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada riwayat terekam untuk risiko ini.</p>
                            </div>
                        ) : (
                            <div className="relative pb-4 ml-3 space-y-8 border-l-2 sm:ml-4 border-slate-200 dark:border-slate-800/80">
                                {histories.map((history, index) => {
                                    // Logika penentuan status & visual timeline
                                    const isBaruDibuat = history.created_at === model?.created_at;
                                    const isKejadian = history.currently_id === 1;
                                    
                                    let statusConfig = {
                                        color: "bg-slate-500",
                                        badgeBg: "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10",
                                        icon: <ClockIcon className="w-4 h-4 text-white" />,
                                        title: "Pembaruan Data",
                                        user: history.user?.name || model?.user_name || "Sistem"
                                    };

                                    if (isBaruDibuat) {
                                        statusConfig = {
                                            color: "bg-sky-500",
                                            badgeBg: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30",
                                            icon: <SparklesIcon className="w-4 h-4 text-white" />,
                                            title: "RISIKO BARU DIBUAT",
                                            user: history.user?.name || model?.user_name || "Sistem"
                                        };
                                    } else if (isKejadian) {
                                        statusConfig = {
                                            color: "bg-rose-500",
                                            badgeBg: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
                                            icon: <ExclamationTriangleIcon className="w-4 h-4 text-white" />,
                                            title: "SEDANG TERJADI / KEJADIAN",
                                            user: history.user?.name || model?.user_name || "Sistem"
                                        };
                                    } else if (!isKejadian && !isBaruDibuat) {
                                        statusConfig = {
                                            color: "bg-emerald-500",
                                            badgeBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
                                            icon: <ShieldCheckIcon className="w-4 h-4 text-white" />,
                                            title: "SELESAI PERBAIKAN",
                                            user: history.user?.name || model?.user_name || "Sistem"
                                        };
                                    }

                                    return (
                                        <div key={index} className="relative pl-6 sm:pl-8 group">
                                            {/* Dot Indicator */}
                                            <span className={`absolute -left-[13px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white dark:ring-[#0f172a] shadow-sm ${statusConfig.color}`}>
                                                {statusConfig.icon}
                                            </span>

                                            {/* Timeline Content Card */}
                                            <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 transition-colors group-hover:border-sky-300 dark:group-hover:border-sky-500/50 shadow-sm">
                                                <div className="flex flex-col justify-between gap-3 mb-4 sm:flex-row sm:items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg border ${statusConfig.badgeBg}`}>
                                                        {statusConfig.title}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                                        {formatDate(history.created_at)}
                                                    </span>
                                                </div>
                                                
                                                <p className="mt-2 mb-5 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                                                    {history.pernyataan_risiko || model?.pernyataan_risiko}
                                                </p>
                                                
                                                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center">
                                                    <span className="opacity-80">Tercatat oleh:</span> <span className="ml-1 font-bold text-slate-700 dark:text-slate-300">{statusConfig.user}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex justify-end z-20 mt-auto rounded-b-2xl">
                <button 
                    type="button" 
                    onClick={closeButton} 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                >
                    Tutup Riwayat
                </button>
            </div>
            
        </div>
    );
}