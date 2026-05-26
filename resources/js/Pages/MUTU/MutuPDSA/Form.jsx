import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import React from "react";
import {
    ClipboardDocumentListIcon,
    LightBulbIcon,
    PlayIcon,
} from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    ShouldMap,
    model,
    closeButton,
}) {
    // Reusable styling classes untuk tema Shadcn
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative overflow-hidden";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: PROBLEM & STEP --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Identifikasi Masalah</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Tentukan problem utama dan langkah identifikasi penyelesaiannya.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="problem" className={labelClass}>Problem (Masalah)</label>
                            <TextAreaInput 
                                id="problem" 
                                value={data.problem} 
                                handleChange={(e) => setData("problem", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Deskripsikan masalah spesifik yang terjadi..." 
                            />
                            <InputError message={errors.problem} className="mt-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="step" className={labelClass}>Step (Langkah)</label>
                            <TextAreaInput 
                                id="step" 
                                value={data.step} 
                                handleChange={(e) => setData("step", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Sebutkan urutan langkah-langkah kejadian atau proses saat ini..." 
                            />
                            <InputError message={errors.step} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: PLAN --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <LightBulbIcon className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">P - Plan (Rencana)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Buat rencana perbaikan dan tentukan target yang ingin dicapai.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label htmlFor="plan_rencana" className={labelClass}>Rencana Perbaikan</label>
                            <TextAreaInput 
                                id="plan_rencana" 
                                value={data.plan_rencana} 
                                handleChange={(e) => setData("plan_rencana", e.target.value)} 
                                rows={4} 
                                className={inputClass} 
                                placeholder="Apa detail rencana tindakan yang akan dilakukan?..." 
                            />
                            <InputError message={errors.plan_rencana} className="mt-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="plan_harapan" className={labelClass}>Harapan / Target</label>
                            <TextAreaInput 
                                id="plan_harapan" 
                                value={data.plan_harapan} 
                                handleChange={(e) => setData("plan_harapan", e.target.value)} 
                                rows={4} 
                                className={inputClass} 
                                placeholder="Apa target atau output terukur dari rencana ini?..." 
                            />
                            <InputError message={errors.plan_harapan} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: DO, STUDY, ACTION --- */}
                <div className={`${sectionCardClass} mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <PlayIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">D.S.A - Eksekusi & Evaluasi</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Implementasi (Do), pembelajaran (Study), dan standarisasi (Action).</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="do" className={labelClass}>
                                <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-sky-600 bg-sky-50 border border-sky-200 rounded dark:bg-sky-500/10 dark:border-sky-500/30 dark:text-sky-400">D</span> 
                                Do (Pelaksanaan)
                            </label>
                            <TextAreaInput 
                                id="do" 
                                value={data.do} 
                                handleChange={(e) => setData("do", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Bagaimana realisasi pelaksanaan dari rencana di atas?..." 
                            />
                            <InputError message={errors.do} className="mt-1" />
                        </div>
                        
                        <div className="flex flex-col">
                            <label htmlFor="study" className={labelClass}>
                                <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 rounded dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400">S</span> 
                                Study (Pembelajaran / Evaluasi)
                            </label>
                            <TextAreaInput 
                                id="study" 
                                value={data.study} 
                                handleChange={(e) => setData("study", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Apa hasil studi atau evaluasi setelah pelaksanaan?..." 
                            />
                            <InputError message={errors.study} className="mt-1" />
                        </div>
                        
                        <div className="flex flex-col">
                            <label htmlFor="action" className={labelClass}>
                                <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400">A</span> 
                                Action (Tindak Lanjut / Standarisasi)
                            </label>
                            <TextAreaInput 
                                id="action" 
                                value={data.action} 
                                handleChange={(e) => setData("action", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Tindakan selanjutnya (Standarisasi prosedur atau buat siklus perbaikan baru)?..." 
                            />
                            <InputError message={errors.action} className="mt-1" />
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