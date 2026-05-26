import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RadioCard from "@/Components/RadioCard";
import TextAreaInput from "@/Components/TextAreaInput";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { 
    DocumentTextIcon, 
    WrenchScrewdriverIcon, 
    ShieldCheckIcon 
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
    const defaultValue = [{ name: "" }];

    // State Status Saat Ini
    const [selectedCurrently, setSelectedCurrently] = useState(() => {
        if (model) return ShouldMap.currently?.find((x) => x.id === model.currently_id) || defaultValue[0];
        return defaultValue[0];
    });

    // Auto-generate Pernyataan Risiko (Persis bawaan asli)
    useEffect(() => {
        if (data.sebab && data.resiko && data.dampak) {
            setData({
                ...data,
                ["pernyataan_risiko"]: "Karena " + data.sebab + " Kemungkinan " + data.resiko + " Sehingga " + data.dampak,
            });
        }
    }, [data.sebab, data.resiko, data.dampak]);

    // Styling helpers Shadcn Theme
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: DATA RISIKO (READ ONLY) --- */}
                <div className={`${sectionCardClass} overflow-hidden`}>
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-violet-500"></div>
                    <div className="p-6 pl-8">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                            <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                            Data Pernyataan Risiko Prioritas
                        </div>
                        <TextAreaInput
                            id="pernyataan_risiko"
                            readOnly={true}
                            value={data.pernyataan_risiko || "Pernyataan risiko belum tersedia."}
                            rows={3}
                            className={readOnlyInputClass}
                        />
                        <InputError message={errors.pernyataan_risiko} className="mt-1" />
                    </div>
                </div>

                {/* --- SECTION 2: DATA LAPORAN PIC (READ ONLY) --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Laporan Perbaikan (PIC)</h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Informasi perbaikan yang dilaporkan oleh unit terkait.</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700">
                                Read Only
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12 bg-slate-50/30 dark:bg-transparent">
                        <div className="col-span-12 cursor-not-allowed md:col-span-6 opacity-80">
                            <label className={labelClass}>Tanggal Input (Sistem)</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.created_at ? moment(data.created_at).format("DD MMMM YYYY") : "-"}
                            </div>
                        </div>
                        <div className="col-span-12 cursor-not-allowed md:col-span-6 opacity-80">
                            <label className={labelClass}>Jam Input (Sistem)</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.created_at ? moment(data.created_at).format("HH:mm") : "-"}
                            </div>
                        </div>

                        <div className="col-span-12 cursor-not-allowed md:col-span-6 opacity-80">
                            <label className={labelClass}>Tanggal Dilaporkan Selesai</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.tgl_perbaikan ? moment(data.tgl_perbaikan).format("DD MMMM YYYY") : "-"}
                            </div>
                        </div>
                        <div className="col-span-12 cursor-not-allowed md:col-span-6 opacity-80">
                            <label className={labelClass}>Jam Dilaporkan Selesai</label>
                            <div className={`${readOnlyInputClass} px-3 py-2.5`}>
                                {data.jam_perbaikan || "-"}
                            </div>
                        </div>

                        <div className="col-span-12 cursor-not-allowed opacity-80">
                            <label className={labelClass}>Upaya Pengendalian Aktual</label>
                            <div className={`${readOnlyInputClass} px-4 py-3 min-h-[100px] whitespace-pre-wrap`}>
                                {data.upaya_pengendalian || "-"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: VERIFIKASI ADMIN PRIORITAS (FORM INPUT) --- */}
                <div className={`${sectionCardClass} border-violet-200 dark:border-violet-500/30 overflow-hidden mb-4`}>
                    <div className="px-6 py-5 border-b bg-violet-50/50 dark:bg-violet-500/5 border-violet-100 dark:border-violet-500/20">
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-6 h-6 mr-2 text-violet-600 dark:text-violet-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Verifikasi Admin (Risiko Prioritas)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Masukkan catatan pengawasan untuk risiko tingkat tinggi ini.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12 bg-white dark:bg-[#0f172a]">
                        <div className="relative flex flex-col col-span-12 z-[40]">
                            <label className={labelClass}>Keterangan / Catatan Verifikasi Admin</label>
                            <TextAreaInput
                                id="keterangan"
                                value={data.keterangan}
                                handleChange={(e) => setData("keterangan", e.target.value)}
                                rows={4}
                                className={inputClass}
                                placeholder="Masukkan catatan hasil pengawasan admin..."
                            />
                            <InputError message={errors.keterangan} className="mt-1" />
                        </div>
                        
                        <div className="relative flex flex-col col-span-12 z-[30]">
                            <label className={labelClass}>Keputusan Status Risiko Saat Ini</label>
                            <RadioCard
                                ShouldMap={ShouldMap.currently || []}
                                selected={selectedCurrently}
                                onChange={(e) => {
                                    setData({ ...data, ["currently_id"]: e.id });
                                    setSelectedCurrently(e);
                                }}
                            />
                            <InputError message={errors.currently_id} className="mt-1" />
                        </div>
                    </div>
                </div>

            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-violet-600 rounded-xl shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
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