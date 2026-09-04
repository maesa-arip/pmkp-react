import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React from "react";
import { DocumentTextIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    model,
    closeButton,
}) {
    // Reusable styling classes untuk tema Shadcn
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: KONTEKS RISIKO (READ ONLY) --- */}
                <div className={`${sectionCardClass} p-5 overflow-hidden`}>
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500"></div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2 pl-2">
                        <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                        Pernyataan Risiko
                    </div>
                    <div className="w-full pl-2">
                        <TextAreaInput 
                            id="pernyataan_risiko" 
                            readOnly={true} 
                            value={data.pernyataan_risiko || "Tidak ada detail pernyataan risiko."} 
                            rows={3} 
                            className={readOnlyInputClass} 
                        />
                    </div>
                </div>

                {/* --- SECTION 2: FORM UPDATE STATUS --- */}
                <div className={`${sectionCardClass} mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Formulir Update Status</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Masukkan data upaya perbaikan yang telah dilakukan.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        <div className="flex flex-col col-span-12 md:col-span-6">
                            <label htmlFor="tgl_perbaikan" className={labelClass}>Tanggal Perbaikan</label>
                            <TextInput
                                id="tgl_perbaikan"
                                value={data.tgl_perbaikan}
                                handleChange={(e) => setData("tgl_perbaikan", e.target.value)}
                                type="date"
                                className={inputClass}
                            />
                            <InputError message={errors.tgl_perbaikan} className="mt-1" />
                        </div>
                        
                        <div className="flex flex-col col-span-12 md:col-span-6">
                            <label htmlFor="jam_perbaikan" className={labelClass}>Jam Perbaikan</label>
                            <TextInput
                                id="jam_perbaikan"
                                value={data.jam_perbaikan}
                                handleChange={(e) => setData("jam_perbaikan", e.target.value)}
                                type="time"
                                className={inputClass}
                            />
                            <InputError message={errors.jam_perbaikan} className="mt-1" />
                        </div>

                        <div className="flex flex-col col-span-12">
                            <label htmlFor="upaya_pengendalian" className={labelClass}>Upaya Pengendalian</label>
                            <TextAreaInput
                                id="upaya_pengendalian"
                                value={data.upaya_pengendalian}
                                handleChange={(e) => setData("upaya_pengendalian", e.target.value)}
                                rows={4}
                                className={inputClass}
                                placeholder="Deskripsikan upaya pengendalian yang telah dijalankan secara detail..."
                            />
                            <InputError message={errors.upaya_pengendalian} className="mt-1" />
                        </div>

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