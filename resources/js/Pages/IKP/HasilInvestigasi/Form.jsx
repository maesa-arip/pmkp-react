import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxPageReadonly from "@/Components/ComboboxPageReadonly";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { 
    MagnifyingGlassIcon, 
    ShieldCheckIcon, 
    DocumentTextIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    closeButton,
    ShouldMap,
    model,
}) {
    const defaultValue = [{ name: "" }];
    const { permissionNames } = usePage().props;
    const permission_name = permissionNames ? permissionNames.map((p) => p.name) : [];

    // --- STATES INIT (Dengan Safe Fallback) ---
    const [selectedVerifikasi, setSelectedVerifikasi] = useState(() => {
        if (model) return ShouldMap.IkpVerifikasi?.find((x) => x.id === model.ikp_hasil?.verifikasi) || defaultValue[0];
        return defaultValue[0];
    });
    
    const [selectedInvestigasiLengkap, setSelectedInvestigasiLengkap] = useState(() => {
        if (model) return ShouldMap.IkpInvestigasiLengkap?.find((x) => x.id === model.ikp_hasil?.investigasi_lengkap) || defaultValue[0];
        return defaultValue[0];
    });
    
    const [selectedInvestigasiLanjut, setSelectedInvestigasiLanjut] = useState(() => {
        if (model) return ShouldMap.IkpInvestigasiLanjut?.find((x) => x.id === model.ikp_hasil?.investigasi_lanjut) || defaultValue[0];
        return defaultValue[0];
    });
    
    const [selectedIkpDampak, setSelectedIkpDampak] = useState(() => {
        if (model) return ShouldMap.IkpDampak?.find((x) => x.id === model.ikp_dampak_id) || defaultValue[0];
        return defaultValue[0];
    });
    
    const [selectedIkpProbabilitas, setSelectedIkpProbabilitas] = useState(() => {
        if (model) return ShouldMap.IkpProbabilitas?.find((x) => x.id === model.ikp_probabilitas_id) || defaultValue[0];
        return defaultValue[0];
    });

    const [selectedIkpDampak2, setSelectedIkpDampak2] = useState(() => {
        if (model) return ShouldMap.IkpDampak?.find((x) => x.id === model.ikp_hasil?.ikp_dampak2_id) || defaultValue[0];
        return defaultValue[0];
    });
    
    const [selectedIkpProbabilitas2, setSelectedIkpProbabilitas2] = useState(() => {
        if (model) return ShouldMap.IkpProbabilitas?.find((x) => x.id === model.ikp_hasil?.ikp_probabilitas2_id) || defaultValue[0];
        return defaultValue[0];
    });

    // --- STYLING CLASSES ---
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- BENTO 1: GRADING AWAL (READ ONLY) --- */}
                <div className={`${sectionCardClass} relative z-[70]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-400" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Grading Awal Insiden</h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat risiko saat insiden pertama kali dilaporkan.</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700">
                                Read Only
                            </span>
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12 bg-slate-50/30 dark:bg-transparent">
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[79] opacity-80 cursor-not-allowed">
                            <label className={labelClass}>Dampak Insiden Terhadap Pasien</label>
                            <div className={`${readOnlyInputClass} p-0 border-0`}>
                                <ComboboxPageReadonly
                                    ShouldMap={ShouldMap.IkpDampak || []}
                                    selected={selectedIkpDampak}
                                />
                            </div>
                        </div>
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[78] opacity-80 cursor-not-allowed">
                            <label className={labelClass}>Probabilitas</label>
                            <div className={`${readOnlyInputClass} p-0 border-0`}>
                                <ComboboxPageReadonly
                                    ShouldMap={ShouldMap.IkpProbabilitas || []}
                                    selected={selectedIkpProbabilitas}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BENTO 2: HASIL INVESTIGASI --- */}
                <div className={`${sectionCardClass} relative z-[60]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Formulir Investigasi Sederhana</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Analisis penyebab, akar masalah, dan rekomendasi perbaikan.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        <div className="relative flex flex-col col-span-12 z-[69]">
                            <label className={labelClass}>Penyebab Langsung Insiden</label>
                            <TextAreaInput
                                id="penyebab"
                                value={data.penyebab}
                                handleChange={(e) => setData("penyebab", e.target.value)}
                                rows={3}
                                className={inputClass}
                                placeholder="Jelaskan penyebab langsung..."
                            />
                            <InputError message={errors.penyebab} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 z-[68]">
                            <label className={labelClass}>Akar Masalah (Root Cause)</label>
                            <TextAreaInput
                                id="akarmasalah"
                                value={data.akarmasalah}
                                handleChange={(e) => setData("akarmasalah", e.target.value)}
                                rows={3}
                                className={inputClass}
                                placeholder="Jelaskan penyebab yang melatarbelakangi insiden..."
                            />
                            <InputError message={errors.akarmasalah} className="mt-1" />
                        </div>

                        {/* Rekomendasi & Tindakan */}
                        <div className="col-span-12 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                                <div className="relative flex flex-col col-span-12 md:col-span-4 z-[67]">
                                    <label className={labelClass}>Rekomendasi Perbaikan</label>
                                    <TextInput
                                        id="rekomendasi"
                                        value={data.rekomendasi}
                                        handleChange={(e) => setData("rekomendasi", e.target.value)}
                                        type="text"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.rekomendasi} className="mt-1" />
                                </div>
                                <div className="relative flex flex-col col-span-12 md:col-span-5 z-[66]">
                                    <label className={labelClass}>Penanggung Jawab (PJ)</label>
                                    <TextInput
                                        id="pj1"
                                        value={data.pj1}
                                        handleChange={(e) => setData("pj1", e.target.value)}
                                        type="text"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.pj1} className="mt-1" />
                                </div>
                                <div className="relative flex flex-col col-span-12 md:col-span-3 z-[65]">
                                    <label className={labelClass}>Tanggal</label>
                                    <TextInput
                                        id="tanggal_rekomendasi"
                                        value={data.tanggal_rekomendasi}
                                        handleChange={(e) => setData("tanggal_rekomendasi", e.target.value)}
                                        type="date"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.tanggal_rekomendasi} className="mt-1" />
                                </div>

                                <div className="relative flex flex-col col-span-12 md:col-span-4 z-[64]">
                                    <label className={labelClass}>Tindakan Yang Akan Dilakukan</label>
                                    <TextInput
                                        id="tindakan"
                                        value={data.tindakan}
                                        handleChange={(e) => setData("tindakan", e.target.value)}
                                        type="text"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.tindakan} className="mt-1" />
                                </div>
                                <div className="relative flex flex-col col-span-12 md:col-span-5 z-[63]">
                                    <label className={labelClass}>Penanggung Jawab (PJ) Tindakan</label>
                                    <TextInput
                                        id="pj2"
                                        value={data.pj2}
                                        handleChange={(e) => setData("pj2", e.target.value)}
                                        type="text"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.pj2} className="mt-1" />
                                </div>
                                {/* Original code didn't have tanggal_tindakan input explicitly rendered, but we mapped it in ShouldMap/useState. Let's keep it clean as requested. */}
                            </div>
                        </div>

                        {/* Manajer & Waktu */}
                        <div className="col-span-12 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[62]">
                                    <label className={labelClass}>Nama Manajer / Kepala Unit</label>
                                    <TextInput
                                        id="nama"
                                        value={data.nama}
                                        handleChange={(e) => setData("nama", e.target.value)}
                                        type="text"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.nama} className="mt-1" />
                                </div>

                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[61]">
                                    <label className={labelClass}>Tanggal Mulai Investigasi</label>
                                    <TextInput
                                        id="tanggal_mulai_investigasi"
                                        value={data.tanggal_mulai_investigasi}
                                        handleChange={(e) => setData("tanggal_mulai_investigasi", e.target.value)}
                                        type="date"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.tanggal_mulai_investigasi} className="mt-1" />
                                </div>

                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[60]">
                                    <label className={labelClass}>Tanggal Selesai Investigasi</label>
                                    <TextInput
                                        id="tanggal_selesaii_investigasi"
                                        value={data.tanggal_selesaii_investigasi}
                                        handleChange={(e) => setData("tanggal_selesaii_investigasi", e.target.value)}
                                        type="date"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.tanggal_selesaii_investigasi} className="mt-1" />
                                </div>

                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[59]">
                                    <label className={labelClass}>Status Verifikasi Investigasi</label>
                                    <ComboboxPage
                                        ShouldMap={ShouldMap.IkpVerifikasi || []}
                                        selected={selectedVerifikasi}
                                        onChange={(e) => {
                                            setData({ ...data, ["verifikasi"]: e.id });
                                            setSelectedVerifikasi(e);
                                        }}
                                    />
                                    <InputError message={errors.verifikasi} className="mt-1" />
                                </div>
                                
                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[58]">
                                    <label className={labelClass}>Apakah Investigasi Sudah Lengkap?</label>
                                    <ComboboxPage
                                        ShouldMap={ShouldMap.IkpInvestigasiLengkap || []}
                                        selected={selectedInvestigasiLengkap}
                                        onChange={(e) => {
                                            setData({ ...data, ["investigasi_lengkap"]: e.id });
                                            setSelectedInvestigasiLengkap(e);
                                        }}
                                    />
                                    <InputError message={errors.investigasi_lengkap} className="mt-1" />
                                </div>

                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[57]">
                                    <label className={labelClass}>Diperlukan Investigasi Lebih Lanjut?</label>
                                    <ComboboxPage
                                        ShouldMap={ShouldMap.IkpInvestigasiLanjut || []}
                                        selected={selectedInvestigasiLanjut}
                                        onChange={(e) => {
                                            setData({ ...data, ["investigasi_lanjut"]: e.id });
                                            setSelectedInvestigasiLanjut(e);
                                        }}
                                    />
                                    <InputError message={errors.investigasi_lanjut} className="mt-1" />
                                </div>
                                
                                <div className="relative flex flex-col col-span-12 md:col-span-6 z-[56]">
                                    <label className={labelClass}>Tanggal (Jika perlu Investigasi Lanjut)</label>
                                    <TextInput
                                        id="tanggal_investigasi"
                                        value={data.tanggal_investigasi}
                                        handleChange={(e) => setData("tanggal_investigasi", e.target.value)}
                                        type="date"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.tanggal_investigasi} className="mt-1" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- BENTO 3: ADMIN IKP (CONDITIONAL PERMISSION) --- */}
                {permission_name.indexOf("regrading data ikp") > -1 && (
                    <div className={`${sectionCardClass} relative z-[50] mb-4 border-sky-200 dark:border-sky-500/30 overflow-hidden`}>
                        <div className="px-6 py-4 border-b bg-sky-50/50 dark:bg-sky-500/5 border-sky-100 dark:border-sky-500/20">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="w-5 h-5 mr-2 text-sky-600 dark:text-sky-400" />
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Validasi & Re-Grading Admin IKP</h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Penilaian ulang skala risiko berdasarkan hasil investigasi.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12 bg-white dark:bg-[#0f172a]">
                            <div className="relative flex flex-col col-span-12 md:col-span-4 z-[59]">
                                <label className={labelClass}>Tanggal Cek Keruangan</label>
                                <TextInput
                                    id="tanggal_cek"
                                    value={data.tanggal_cek}
                                    handleChange={(e) => setData("tanggal_cek", e.target.value)}
                                    type="date"
                                    className={inputClass}
                                />
                                <InputError message={errors.tanggal_cek} className="mt-1" />
                            </div>

                            <div className="relative flex flex-col col-span-12 md:col-span-8 z-[58]">
                                <label className={labelClass}>Dampak Insiden (Re-Grading)</label>
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpDampak || []}
                                    selected={selectedIkpDampak2}
                                    onChange={(e) => {
                                        setData({ ...data, ["ikp_dampak2_id"]: e.id });
                                        setSelectedIkpDampak2(e);
                                    }}
                                />
                                <InputError message={errors.ikp_dampak2_id} className="mt-1" />
                            </div>

                            <div className="relative flex flex-col col-span-12 md:col-span-4 z-[57]">
                                <label className={labelClass}>Probabilitas (Re-Grading)</label>
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpProbabilitas || []}
                                    selected={selectedIkpProbabilitas2}
                                    onChange={(e) => {
                                        setData({ ...data, ["ikp_probabilitas2_id"]: e.id });
                                        setSelectedIkpProbabilitas2(e);
                                    }}
                                />
                                <InputError message={errors.ikp_probabilitas2_id} className="mt-1" />
                            </div>

                            <div className="relative flex flex-col col-span-12 md:col-span-8 z-[56]">
                                <label className={labelClass}>Tindak Lanjut Admin</label>
                                <TextAreaInput
                                    id="tindak_lanjut"
                                    value={data.tindak_lanjut}
                                    handleChange={(e) => setData("tindak_lanjut", e.target.value)}
                                    rows={2}
                                    className={inputClass}
                                    placeholder="Catatan tindak lanjut dari Admin IKP..."
                                />
                                <InputError message={errors.tindak_lanjut} className="mt-1" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
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