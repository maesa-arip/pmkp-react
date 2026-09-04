import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RadioCard from "@/Components/RadioCard";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { DocumentTextIcon, DocumentCheckIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    ShouldMap,
    model,
    closeButton,
}) {
    // Inisiasi nilai status awal untuk RadioCard
    const [selectedCurrently, setSelectedCurrently] = useState(() => {
        if (model) return ShouldMap.currently.find((x) => x.id === model.currently_id);
        return { name: "" };
    });

    // Reusable styling classes untuk tema Shadcn
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: KONTEKS RISIKO (READ ONLY) --- */}
                <div className={`${sectionCardClass} flex-col md:flex-row overflow-hidden`}>
                    {/* Info Input */}
                    <div className="flex flex-col justify-center p-6 border-b border-slate-200 dark:border-slate-800 md:w-1/3 bg-slate-50/50 dark:bg-white/[0.02] md:border-b-0 md:border-r">
                        <div className="mb-2">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Tanggal & Jam Register</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                {data.created_at ? moment(data.created_at).format("DD MMM YYYY") : "-"} • {data.created_at ? moment(data.created_at).format("HH:mm") : "-"}
                            </span>
                        </div>
                    </div>
                    {/* Pernyataan Risiko Readonly */}
                    <div className="relative flex flex-col justify-center flex-1 p-6">
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500 hidden md:block"></div>
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-500 md:hidden"></div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2 pl-2 md:pl-3">Pernyataan Risiko</span>
                        <p className="pl-2 text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200 md:pl-3">
                            {data.pernyataan_risiko || "-"}
                        </p>
                    </div>
                </div>

                {/* --- SECTION 2: DATA LAPORAN DARI PIC (READ-ONLY) --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <DocumentCheckIcon className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Laporan Perbaikan (Dari PIC)</h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Data berikut diinput oleh PIC dan bersifat hanya baca.</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700">
                                Read Only
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        <div className="flex flex-col col-span-12 gap-1.5 md:col-span-6">
                            <label className={labelClass}>Tanggal Perbaikan</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.tgl_perbaikan ? moment(data.tgl_perbaikan).format("DD MMMM YYYY") : "-"}
                            </div>
                        </div>
                        
                        <div className="flex flex-col col-span-12 gap-1.5 md:col-span-6">
                            <label className={labelClass}>Jam Perbaikan</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.jam_perbaikan || "-"}
                            </div>
                        </div>

                        <div className="flex flex-col col-span-12 gap-1.5">
                            <label className={labelClass}>Upaya Pengendalian Aktual</label>
                            <div className={`${readOnlyInputClass} px-4 py-3 min-h-[100px] whitespace-pre-wrap`}>
                                {data.upaya_pengendalian || "-"}
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- SECTION 3: KEPUTUSAN VERIFIKASI --- */}
                <div className={`${sectionCardClass} border-sky-200 dark:border-sky-500/30 overflow-hidden mb-4`}>
                    <div className="px-6 py-5 border-b bg-sky-50/50 dark:bg-sky-500/5 border-sky-100 dark:border-sky-500/20">
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Keputusan Verifikasi Status</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Apakah tindakan pengendalian di atas sudah mengatasi kejadian risiko ini?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-white dark:bg-[#0f172a]">
                        <RadioCard
                            ShouldMap={ShouldMap.currently}
                            selected={selectedCurrently}
                            onChange={(e) => {
                                setData({ ...data, ["currently_id"]: e.id });
                                setSelectedCurrently(e);
                            }}
                        />
                        <InputError message={errors.currently_id} className="mt-2" />
                    </div>
                </div>

            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-20 rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-sky-600 rounded-xl shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                >
                    {submit}
                </button>
                <button 
                    type="button" 
                    onClick={closeButton} 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"
                >
                    Batal
                </button>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>
        </div>
    );
}