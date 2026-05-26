import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import React from "react";
import { KeyIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    closeButton,
}) {
    // Reusable styling classes
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative overflow-hidden";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- DEFINISI HAK AKSES --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <KeyIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Definisi Hak Akses</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Masukkan kata kunci (key) untuk hak akses operasional (Contoh: "tambah user").</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className={labelClass}>Permission Key (Nama Hak Akses)</label>
                            <TextInput
                                id="name"
                                value={data.name}
                                handleChange={(e) => setData("name", e.target.value)}
                                type="text"
                                className={inputClass}
                                placeholder="Contoh: edit laporan"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                    </div>
                </div>

            </div>

            {/* --- FORM ACTIONS (STICKY BOTTOM) --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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