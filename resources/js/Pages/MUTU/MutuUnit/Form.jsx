import ComboboxPageIndikatorMutu from "@/Components/ComboboxPageIndikatorMutu";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { DocumentChartBarIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    model,
    ShouldMap,
    closeButton,
}) {
    const defaultValue = [{ name: "" }];

    // State Initialization
    const [selectedIndikator, setSelectedIndikator] = useState(() => {
        if (model) return ShouldMap.MutuIndikator?.find((x) => x.id === model.mutu_indikator_id) || defaultValue[0];
        return defaultValue[0];
    });

    // Formatting tanggal dari ReactDatePicker agar bisa dibaca Inertia/Backend
    const handleDateChange = (date) => {
        if (date) {
            // Karena data berupa bulan/tahun, kita set ke tanggal 1 pada bulan tersebut agar format date valid (YYYY-MM-DD)
            const d = new Date(date);
            const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
            setData("tanggal_mutu", formatted);
        } else {
            setData("tanggal_mutu", "");
        }
    };

    // Helper Styling
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: PILIH INDIKATOR & PERIODE --- */}
                <div className={`${sectionCardClass} relative z-[50]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <DocumentChartBarIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pilih Indikator & Periode</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Tentukan kamus indikator mutu mana yang akan diinput capaiannya.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        <div className="relative flex flex-col col-span-12 z-[60]">
                            <label className={labelClass}>Indikator Mutu</label>
                            <ComboboxPageIndikatorMutu
                                ShouldMap={ShouldMap.MutuIndikator || []}
                                selected={selectedIndikator}
                                onChange={(e) => {
                                    setData({ ...data, ["mutu_indikator_id"]: e.id });
                                    setSelectedIndikator(e);
                                }}
                            />
                            <InputError message={errors.mutu_indikator_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[59]">
                            <label className={labelClass}>Periode Bulan & Tahun</label>
                            <div className="relative">
                                {/* Wrap Custom ReactDatePicker dgn Tailwind Class */}
                                <ReactDatePicker
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                    selected={data.tanggal_mutu ? new Date(data.tanggal_mutu) : null}
                                    onChange={handleDateChange}
                                    placeholderText="Pilih Bulan & Tahun"
                                    className={`${inputClass} px-3 py-2.5`}
                                />
                            </div>
                            <InputError message={errors.tanggal_mutu} className="mt-1" />
                        </div>

                    </div>
                </div>

                {/* --- SECTION 2: INPUT CAPAIAN (NUM & DENUM) --- */}
                <div className={`${sectionCardClass} relative z-[40] mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <PresentationChartLineIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Input Pengukuran Numerator & Denumerator</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Masukkan nilai mentah untuk pembilang dan penyebut pada bulan ini.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12 bg-slate-50/50 dark:bg-transparent rounded-b-2xl">
                        
                        {/* INPUT NUMERATOR */}
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[45]">
                            <label className={labelClass}>
                                <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-sky-600 bg-sky-50 border border-sky-200 rounded dark:bg-sky-500/10 dark:border-sky-500/30 dark:text-sky-400">N</span> 
                                Nilai Numerator
                            </label>
                            <TextInput
                                id="num"
                                value={data.num}
                                handleChange={(e) => setData("num", e.target.value)}
                                type="number"
                                className={inputClass}
                                placeholder="0"
                            />
                            <InputError message={errors.num} className="mt-1" />
                        </div>

                        {/* INPUT DENUMERATOR */}
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[44]">
                            <label className={labelClass}>
                                <span className="inline-flex px-1.5 py-0.5 mr-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400">D</span> 
                                Nilai Denumerator
                            </label>
                            <TextInput
                                id="denum"
                                value={data.denum}
                                handleChange={(e) => setData("denum", e.target.value)}
                                type="number"
                                className={inputClass}
                                placeholder="0"
                            />
                            <InputError message={errors.denum} className="mt-1" />
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
                
                /* Menyesuaikan lebar full dropdown datepicker agar seimbang dengan field input Shadcn */
                :global(.react-datepicker-wrapper) { width: 100%; display: block; }
            `}</style>
        </div>
    );
}