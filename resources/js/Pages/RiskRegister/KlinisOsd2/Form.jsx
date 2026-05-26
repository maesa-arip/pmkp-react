import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxPageReadonly from "@/Components/ComboboxPageReadonly";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import React, { useEffect, useState } from "react";
import { DocumentTextIcon, ChartPieIcon, CheckBadgeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

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
    
    // State Initialization untuk Dropdown
    const [selectedImpact2, setSelectedImpact2] = useState(() => {
        if (model) return ShouldMap.impactValues.find((x) => x.value === model.osd2_dampak);
        return defaultValue[0];
    });
    
    const [selectedProbability2, setSelectedProbability2] = useState(() => {
        if (model) return ShouldMap.probabilityValues.find((x) => x.value === model.osd2_probabilitas);
        return defaultValue[0];
    });
    
    const [selectedControl2, setSelectedControl2] = useState(() => {
        if (model) return ShouldMap.controlValues.find((x) => x.value === model.osd2_controllability);
        return defaultValue[0];
    });
    
    const [selectedWaktuImplementasi, setSelectedWaktuImplementasi] = useState(() => {
        if (model) return ShouldMap.waktuImplementasi.find((x) => x.id === model.waktu_implementasi_id);
        return defaultValue[0];
    });

    const [selectedRealisasi, setSelectedRealisasi] = useState(() => {
        if (model) return ShouldMap.realisasi.find((x) => x.id === model.realisasi_id);
        return defaultValue[0];
    });

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
                        <InputError message={errors.pernyataan_risiko} className="mt-1" />
                    </div>
                </div>

                {/* --- SECTION 1: OSD RESIDUAL --- */}
                <div className={`${sectionCardClass} relative z-[30]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ChartPieIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">OSD Residual</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Dampak dan Probabilitas ini terisi otomatis setelah FGD Residual.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid w-full grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[35]">
                            <label className={labelClass}>Dampak (Otomatis)</label>
                            <div className={readOnlyInputClass + " p-0 border-0"}>
                                <ComboboxPageReadonly 
                                    ShouldMap={ShouldMap.impactValues} 
                                    selected={selectedImpact2} 
                                    onChange={(e) => { 
                                        setData({ ...data, ["osd2_dampak"]: e.id }); 
                                        setSelectedImpact2(e); 
                                    }} 
                                />
                            </div>
                            <InputError message={errors.osd2_dampak} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[34]">
                            <label className={labelClass}>Probabilitas (Otomatis)</label>
                            <div className={readOnlyInputClass + " p-0 border-0"}>
                                <ComboboxPageReadonly 
                                    ShouldMap={ShouldMap.probabilityValues} 
                                    selected={selectedProbability2} 
                                    onChange={(e) => { 
                                        setData({ ...data, ["osd2_probabilitas"]: e.id }); 
                                        setSelectedProbability2(e); 
                                    }} 
                                />
                            </div>
                            <InputError message={errors.osd2_probabilitas} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: EVALUASI & USULAN --- */}
                <div className={`${sectionCardClass} relative z-[20]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Evaluasi & Tindakan Perbaikan</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Catat kendala yang terjadi dan berikan usulan perbaikan.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid w-full grid-cols-1 gap-6 p-6">
                        <div className="flex flex-col w-full">
                            <label className={labelClass}>Yang Belum Tertangani</label>
                            <TextAreaInput 
                                id="belum_tertangani" 
                                value={data.belum_tertangani} 
                                handleChange={(e) => setData("belum_tertangani", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Apa saja yang masih menjadi kendala atau belum selesai ditangani?..." 
                            />
                            <InputError message={errors.belum_tertangani} className="mt-1" />
                        </div>

                        <div className="flex flex-col w-full">
                            <label className={labelClass}>Usulan Perbaikan</label>
                            <TextAreaInput 
                                id="usulan_perbaikan" 
                                value={data.usulan_perbaikan} 
                                handleChange={(e) => setData("usulan_perbaikan", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Tuliskan usulan konkrit untuk perbaikan ke depannya..." 
                            />
                            <InputError message={errors.usulan_perbaikan} className="mt-1" />
                        </div>
                        
                        <div className="flex flex-col w-full">
                            <label className={labelClass}>Kendala Utama</label>
                            <TextAreaInput 
                                id="kendala" 
                                value={data.kendala} 
                                handleChange={(e) => setData("kendala", e.target.value)} 
                                rows={3} 
                                className={inputClass} 
                                placeholder="Jelaskan hambatan atau masalah yang mengganggu proses mitigasi..." 
                            />
                            <InputError message={errors.kendala} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: REALISASI & DOKUMENTASI --- */}
                <div className={`${sectionCardClass} mb-4 relative z-[10]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <CheckBadgeIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Status Realisasi & Output</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Verifikasi akhir hasil penanganan risiko.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid w-full grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[15]">
                            <label className={labelClass}>Waktu Implementasi</label>
                            <ComboboxPage 
                                ShouldMap={ShouldMap.waktuImplementasi} 
                                selected={selectedWaktuImplementasi} 
                                onChange={(e) => { 
                                    setData({ ...data, ["waktu_implementasi_id"]: e.id }); 
                                    setSelectedWaktuImplementasi(e); 
                                }} 
                            />
                            <InputError message={errors.waktu_implementasi_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[14]">
                            <label className={labelClass}>Status Realisasi</label>
                            <ComboboxPage 
                                ShouldMap={ShouldMap.realisasi} 
                                selected={selectedRealisasi} 
                                onChange={(e) => { 
                                    setData({ ...data, ["realisasi_id"]: e.id }); 
                                    setSelectedRealisasi(e); 
                                }} 
                            />
                            <InputError message={errors.realisasi_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col w-full relative z-[13]">
                            <label className={labelClass}>Output Akhir</label>
                            <TextAreaInput 
                                id="output" 
                                value={data.output} 
                                handleChange={(e) => setData("output", e.target.value)} 
                                rows={2} 
                                className={inputClass} 
                                placeholder="Hasil akhir dari proses pengendalian (misal: SOP baru, dsb)..." 
                            />
                            <InputError message={errors.output} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col w-full relative z-[12]">
                            <label className={labelClass}>Dokumen Pendukung / Link Bukti</label>
                            <TextAreaInput 
                                id="dokumen_pendukung" 
                                value={data.dokumen_pendukung} 
                                handleChange={(e) => setData("dokumen_pendukung", e.target.value)} 
                                rows={2} 
                                className={inputClass} 
                                placeholder="Masukkan nama dokumen atau tautan (link) ke file bukti mitigasi..." 
                            />
                            <InputError message={errors.dokumen_pendukung} className="mt-1" />
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