import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import React from "react";
import { DocumentTextIcon, QuestionMarkCircleIcon, LightBulbIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
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
                
                {/* --- CONTEXT BOX (Pernyataan Risiko Read-Only) --- */}
                <div className={`${sectionCardClass} p-5 overflow-hidden`}>
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-500"></div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 pl-2 mb-2">
                        <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                        Konteks Risiko
                    </div>
                    <div className="w-full pl-2">
                        <TextAreaInput 
                            id="pernyataan_risiko" 
                            readOnly={true} 
                            value={data.pernyataan_risiko || "Pernyataan risiko tidak ditemukan."} 
                            rows={3} 
                            className={readOnlyInputClass} 
                        />
                    </div>
                </div>

                {/* --- SECTION 1: ANALISIS 5 WHY --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Analisis 5 Why (Root Cause Analysis)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Gali akar masalah dengan menanyakan "Mengapa" secara beruntun.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid w-full grid-cols-1 gap-5 p-6">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="relative flex flex-col w-full">
                                <label className={labelClass}>Why {num}</label>
                                <div className="flex items-start w-full gap-3">
                                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 text-xs font-bold border rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                        {num}
                                    </div>
                                    {/* FIX BUG: Menambahkan min-w-0 w-full untuk mencegah TextArea mendesak border card */}
                                    <div className="flex-1 w-full min-w-0">
                                        <TextAreaInput 
                                            id={`why${num}`} 
                                            value={data[`why${num}`]} 
                                            handleChange={(e) => setData(`why${num}`, e.target.value)} 
                                            rows={2} 
                                            className={inputClass} 
                                            placeholder={`Mengapa kejadian pada langkah ${num === 1 ? 'awal' : num - 1} bisa terjadi?...`} 
                                        />
                                        <InputError message={errors[`why${num}`]} className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SECTION 2: KESIMPULAN AKAR PENYEBAB --- */}
                <div className={`${sectionCardClass} mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <LightBulbIcon className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Kesimpulan Akar Penyebab</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Berdasarkan analisis 5 Why di atas, simpulkan akar masalah utamanya.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full p-6">
                        <div className="flex flex-col w-full">
                            <label className={labelClass}>Akar Penyebab Utama (Root Cause)</label>
                            <TextAreaInput 
                                id="akar_penyebab" 
                                value={data.akar_penyebab} 
                                handleChange={(e) => setData("akar_penyebab", e.target.value)} 
                                rows={4} 
                                className={`${inputClass} border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-500/30`} 
                                placeholder="Simpulkan akar penyebab utama dari insiden operasional ini..." 
                            />
                            <InputError message={errors.akar_penyebab} className="mt-1" />
                        </div>
                    </div>
                </div>

            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 rounded-b-xl z-20 mt-auto">
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