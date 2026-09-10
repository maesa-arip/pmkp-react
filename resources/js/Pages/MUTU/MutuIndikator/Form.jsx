import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";
import { 
    CalculatorIcon, 
    TagIcon 
} from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    model,
    ShouldMap,
    closeButton,
}) {
    const [year, setYear] = useState(model?.tahun || new Date().getFullYear());
    const defaultValue = [{ name: "" }];

    // --- STATES INIT ---
    const [selectedIndikatorBaru, setSelectedIndikatorBaru] = useState(() => {
        if (model) return ShouldMap.IndikatorBaru?.find((x) => x.id === model.IndikatorBaru) || defaultValue[0];
        return ShouldMap.IndikatorBaru?.find((x) => x.id === data.IndikatorBaru) || defaultValue[0];
    });

    const [selectedOperator, setSelectedOperator] = useState(() => {
        if (model) return ShouldMap.Operator?.find((x) => x.id === model.operator) || defaultValue[0];
        return defaultValue[0];
    });

    const [selectedPenyebut, setSelectedPenyebut] = useState(() => {
        if (model) return ShouldMap.Penyebut?.find((x) => x.id === model.penyebut) || defaultValue[0];
        return defaultValue[0];
    });

    const [selectedIndikatorFitur4, setSelectedIndikatorFitur4] = useState(() => {
        if (model) return ShouldMap.IndikatorFitur4?.find((x) => x.id === model.indikator_fitur4_id) || defaultValue[0];
        return defaultValue[0];
    });

    const [selectedIndikatorFitur3, setSelectedIndikatorFitur3] = useState(() => defaultValue[0]);

    const [selectedKategori, setSelectedKategori] = useState(() => {
        if (model) return ShouldMap.MutuKategori?.find((x) => x.id === model.mutu_kategori_id) || defaultValue[0];
        return defaultValue[0];
    });

    // --- STYLING CLASSES ---
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                <label className="block text-sm">Tahun indikator<select className="ml-3 rounded" disabled={!!model} value={year} onChange={e => { setYear(Number(e.target.value)); setData('indikator_fitur4_id', ''); setSelectedIndikatorFitur4(defaultValue[0]); }}>{[...new Set((ShouldMap.IndikatorFitur4 || []).map(x => x.tahun))].sort().map(y => <option key={y} value={y}>{y}</option>)}</select></label><p className="text-sm">Indikator baru dikelola melalui draft pada menu Indikator Tahunan.</p><InputError message={errors.IndikatorBaru} />
                {/* --- SECTION 1: INFORMASI INDIKATOR MUTU --- */}
                <div className={`${sectionCardClass} relative z-[50]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <TagIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Kamus Indikator</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Tentukan profil utama dari Indikator Mutu ini.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        {/* Menjaga Logika Persis Aslinya */}
                        {!model ? (
                            <>
                                <div className="relative flex flex-col col-span-12 md:col-span-12 z-[60]">
                                    <label className={labelClass}>Indikator Baru ?</label>
                                    <ComboboxPage
                                        ShouldMap={(ShouldMap.IndikatorBaru || []).filter(x => Number(x.id) === 0)}
                                        selected={selectedIndikatorBaru}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                ["IndikatorBaru"]: e.id,
                                            });
                                            setSelectedIndikatorBaru(e);
                                        }}
                                    />
                                    <InputError message={errors.IndikatorBaru} className="mt-1" />
                                </div>
                            </>
                        ) : null}

                        {model ? (
                            <div className="relative flex flex-col col-span-12 md:col-span-12 z-[59]">
                                <label className={labelClass}>Pilih Indikator</label>
                                <ComboboxPage
                                    ShouldMap={(ShouldMap.IndikatorFitur4 || []).filter(x => x.tahun === year)}
                                    selected={selectedIndikatorFitur4}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["indikator_fitur4_id"]: e.id,
                                        });
                                        setSelectedIndikatorFitur4(e);
                                    }}
                                />
                                <InputError message={errors.indikator_fitur4_id} className="mt-1" />
                            </div>
                        ) : (
                            <>
                                {data.IndikatorBaru == 1 ? (
                                    <>
                                        <div className="relative flex flex-col col-span-12 md:col-span-12 z-[59]">
                                            <label className={labelClass}>Masukan Indikator Baru</label>
                                            <TextInput
                                                id="indikator"
                                                value={data.indikator}
                                                handleChange={(e) =>
                                                    setData("indikator", e.target.value)
                                                }
                                                type="text"
                                                className={inputClass}
                                                placeholder="Ketikkan nama indikator mutu yang baru..."
                                            />
                                            <InputError message={errors.indikator} className="mt-1" />
                                        </div>
                                        <div className="relative flex flex-col col-span-12 md:col-span-12 z-[58]">
                                            <label className={labelClass}>Pilih Indikator Fitur 3 (Parent)</label>
                                            <ComboboxPage
                                                ShouldMap={ShouldMap.IndikatorFitur3 || []}
                                                selected={selectedIndikatorFitur3}
                                                onChange={(e) => {
                                                    setData({
                                                        ...data,
                                                        ["indikator_fitur3_id"]: e.id,
                                                    });
                                                    setSelectedIndikatorFitur3(e);
                                                }}
                                            />
                                            <InputError message={errors.indikator_fitur3_id} className="mt-1" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative flex flex-col col-span-12 md:col-span-12 z-[59]">
                                        <label className={labelClass}>Pilih Indikator</label>
                                        <ComboboxPage
                                            ShouldMap={(ShouldMap.IndikatorFitur4 || []).filter(x => x.tahun === year)}
                                            selected={selectedIndikatorFitur4}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    ["indikator_fitur4_id"]: e.id,
                                                });
                                                setSelectedIndikatorFitur4(e);
                                            }}
                                        />
                                        <InputError message={errors.indikator_fitur4_id} className="mt-1" />
                                    </div>
                                )}
                            </>
                        )}

                        <div className="relative flex flex-col col-span-12 md:col-span-12 z-[57]">
                            <label className={labelClass}>Kategori</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.MutuKategori || []}
                                selected={selectedKategori}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ["mutu_kategori_id"]: e.id,
                                    });
                                    setSelectedKategori(e);
                                }}
                            />
                            <InputError message={errors.mutu_kategori_id} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: FORMULA & STANDAR MUTU --- */}
                <div className={`${sectionCardClass} relative z-[40] mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <CalculatorIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Formula & Standar Pengukuran</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Atur deskripsi pembilang, penyebut, dan target pencapaian.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 p-6">
                        
                        <div className="flex flex-col gap-6">
                            {/* NUMERATOR */}
                            <div className="relative flex flex-col w-full z-[45]">
                                <label className={labelClass}>
                                    <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-sky-600 bg-sky-50 border border-sky-200 rounded dark:bg-sky-500/10 dark:border-sky-500/30 dark:text-sky-400">N</span> 
                                    NUM (Numerator / Pembilang)
                                </label>
                                <TextAreaInput
                                    id="num_name"
                                    value={data.num_name}
                                    handleChange={(e) => setData("num_name", e.target.value)}
                                    rows={2}
                                    className={inputClass}
                                    placeholder="Deskripsi pembilang..."
                                />
                                <InputError message={errors.num_name} className="mt-1" />
                            </div>

                            {/* DENUMERATOR */}
                            <div className="relative flex flex-col w-full z-[44]">
                                <label className={labelClass}>
                                    <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400">D</span> 
                                    DENUM (Denumerator / Penyebut)
                                </label>
                                <TextAreaInput
                                    id="denum_name"
                                    value={data.denum_name}
                                    handleChange={(e) => setData("denum_name", e.target.value)}
                                    rows={2}
                                    className={inputClass}
                                    placeholder="Deskripsi penyebut..."
                                />
                                <InputError message={errors.denum_name} className="mt-1" />
                            </div>

                            {/* STANDAR & OPERATOR (PERBAIKAN TAMPILAN) */}
                            <div className="pt-5 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-3 block">
                                    Target Standar Pencapaian
                                </label>
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                    
                                    <div className="relative flex flex-col sm:col-span-4 z-[43]">
                                        <label className={labelClass}>Pilih Operator</label>
                                        <ComboboxPage
                                            ShouldMap={ShouldMap.Operator || []}
                                            selected={selectedOperator}
                                            onChange={(e) => {
                                                setData({ ...data, ["operator"]: e.id });
                                                setSelectedOperator(e);
                                            }}
                                        />
                                        <InputError message={errors.operator} className="mt-1" />
                                    </div>
                                    
                                    <div className="relative flex flex-col sm:col-span-4 z-[42]">
                                        <label className={labelClass}>Standar / Nilai Target</label>
                                        <TextInput
                                            id="standar"
                                            value={data.standar}
                                            handleChange={(e) => setData("standar", e.target.value)}
                                            type="number"
                                            className={inputClass}
                                            placeholder="Contoh: 100"
                                        />
                                        <InputError message={errors.standar} className="mt-1" />
                                    </div>

                                    <div className="relative flex flex-col sm:col-span-4 z-[41]">
                                        <label className={labelClass}>Pilih Satuan / Penyebut</label>
                                        <ComboboxPage
                                            ShouldMap={ShouldMap.Penyebut || []}
                                            selected={selectedPenyebut}
                                            onChange={(e) => {
                                                setData({ ...data, ["penyebut"]: e.id });
                                                setSelectedPenyebut(e);
                                            }}
                                        />
                                        <InputError message={errors.penyebut} className="mt-1" />
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
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