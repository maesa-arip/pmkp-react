import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import React, { useEffect, useState } from "react";
import { DocumentTextIcon, CalculatorIcon } from "@heroicons/react/24/outline";

export default function Form({
    errors,
    submit,
    data,
    setData,
    model,
    closeButton,
}) {
    const [dampakMode, setDampakMode] = useState(data.osd1_dampak || "");
    const [probabilitasMode, setProbabilitasMode] = useState(data.osd1_probabilitas || "");

    // Logika perhitungan Modus Dampak (Dioptimasi untuk OSD1)
    useEffect(() => {
        const dampakValues = [
            data.dampak_responden1, data.dampak_responden2, data.dampak_responden3, data.dampak_responden4,
            data.dampak_responden5, data.dampak_responden6, data.dampak_responden7, data.dampak_responden8,
        ];
        const nonEmptyValues = dampakValues.filter((v) => v !== "" && v !== null && v !== undefined);
        
        let modeValue = "";
        if (nonEmptyValues.length > 0) {
            const frequencyMap = {};
            let maxFrequency = 0;

            nonEmptyValues.forEach((value) => {
                const numVal = Number(value);
                if (!isNaN(numVal)) {
                    frequencyMap[numVal] = (frequencyMap[numVal] || 0) + 1;
                    if (frequencyMap[numVal] > maxFrequency) {
                        maxFrequency = frequencyMap[numVal];
                        modeValue = numVal.toString();
                    }
                }
            });
        }
        
        setDampakMode(modeValue);
        setData("osd1_dampak", modeValue);
    }, [
        data.dampak_responden1, data.dampak_responden2, data.dampak_responden3, data.dampak_responden4,
        data.dampak_responden5, data.dampak_responden6, data.dampak_responden7, data.dampak_responden8,
    ]);

    // Logika perhitungan Modus Probabilitas (Dioptimasi untuk OSD1)
    useEffect(() => {
        const probValues = [
            data.probabilitas_responden1, data.probabilitas_responden2, data.probabilitas_responden3, data.probabilitas_responden4,
            data.probabilitas_responden5, data.probabilitas_responden6, data.probabilitas_responden7, data.probabilitas_responden8,
        ];
        const nonEmptyValues = probValues.filter((v) => v !== "" && v !== null && v !== undefined);
        
        let modeValue = "";
        if (nonEmptyValues.length > 0) {
            const frequencyMap = {};
            let maxFrequency = 0;

            nonEmptyValues.forEach((value) => {
                const numVal = Number(value);
                if (!isNaN(numVal)) {
                    frequencyMap[numVal] = (frequencyMap[numVal] || 0) + 1;
                    if (frequencyMap[numVal] > maxFrequency) {
                        maxFrequency = frequencyMap[numVal];
                        modeValue = numVal.toString();
                    }
                }
            });
        }
        
        setProbabilitasMode(modeValue);
        setData("osd1_probabilitas", modeValue);
    }, [
        data.probabilitas_responden1, data.probabilitas_responden2, data.probabilitas_responden3, data.probabilitas_responden4,
        data.probabilitas_responden5, data.probabilitas_responden6, data.probabilitas_responden7, data.probabilitas_responden8,
    ]);

    // Reusable styling classes untuk tema Shadcn
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";

    // Komponen Field Input Responden
    const RespondentField = ({ label, id, value, fieldName, error }) => (
        <div className="relative flex flex-col gap-1.5 group">
            <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <input
                id={id}
                type="number"
                min="1"
                max="5"
                value={value}
                onChange={(e) => setData(fieldName, e.target.value)}
                className="block w-full text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none px-3 py-2.5 text-center shadow-sm placeholder:font-normal placeholder:text-slate-300 dark:placeholder:text-slate-600"
                placeholder="-"
            />
            {error && <p className="absolute -bottom-4 text-[10px] text-red-500 font-medium whitespace-nowrap">{error}</p>}
        </div>
    );

    return (
        // FIX BUG: Menghapus flex-1 overflow-hidden agar card tidak terpotong, diganti h-full w-full
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- CONTEXT BOX (Pernyataan Risiko Auto-Generated) --- */}
                <div className={`${sectionCardClass} p-5 overflow-hidden`}>
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-500"></div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 pl-2 mb-2">
                        <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                        Konteks Risiko (Inherent)
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

                {/* --- TWO COLUMN BENTO CARDS --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* CARD 1: PENILAIAN DAMPAK INHERENT */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Skor Dampak (Inherent)</h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Penilaian awal skala 1-5 dari 8 responden.</p>
                        </div>
                        
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                                <RespondentField label="R.1" id="d_r1" fieldName="dampak_responden1" value={data.dampak_responden1} error={errors.dampak_responden1} />
                                <RespondentField label="R.2" id="d_r2" fieldName="dampak_responden2" value={data.dampak_responden2} error={errors.dampak_responden2} />
                                <RespondentField label="R.3" id="d_r3" fieldName="dampak_responden3" value={data.dampak_responden3} error={errors.dampak_responden3} />
                                <RespondentField label="R.4" id="d_r4" fieldName="dampak_responden4" value={data.dampak_responden4} error={errors.dampak_responden4} />
                                
                                <div className="col-span-4 my-0.5 border-t border-slate-200 border-dashed dark:border-slate-800"></div>

                                <RespondentField label="R.5" id="d_r5" fieldName="dampak_responden5" value={data.dampak_responden5} error={errors.dampak_responden5} />
                                <RespondentField label="R.6" id="d_r6" fieldName="dampak_responden6" value={data.dampak_responden6} error={errors.dampak_responden6} />
                                <RespondentField label="R.7" id="d_r7" fieldName="dampak_responden7" value={data.dampak_responden7} error={errors.dampak_responden7} />
                                <RespondentField label="R.8" id="d_r8" fieldName="dampak_responden8" value={data.dampak_responden8} error={errors.dampak_responden8} />
                            </div>
                        </div>

                        {/* AUTO COMPUTED HIGHLIGHT BAR */}
                        <div className="flex items-center justify-between p-5 border-t bg-sky-50 dark:bg-sky-500/5 border-sky-100 dark:border-sky-500/20">
                            <div className="flex items-center">
                                <CalculatorIcon className="w-5 h-5 mr-2 text-sky-600 dark:text-sky-400" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-800 dark:text-sky-400">Nilai Modus</span>
                            </div>
                            <div className="px-4 py-1.5 bg-white dark:bg-[#020817] border border-sky-200 dark:border-sky-500/30 rounded-lg text-base font-black text-sky-700 dark:text-sky-400 shadow-sm">
                                {dampakMode || "0"}
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: PENILAIAN PROBABILITAS INHERENT */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Skor Probabilitas (Inherent)</h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Penilaian awal skala 1-5 dari 8 responden.</p>
                        </div>
                        
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                                <RespondentField label="R.1" id="p_r1" fieldName="probabilitas_responden1" value={data.probabilitas_responden1} error={errors.probabilitas_responden1} />
                                <RespondentField label="R.2" id="p_r2" fieldName="probabilitas_responden2" value={data.probabilitas_responden2} error={errors.probabilitas_responden2} />
                                <RespondentField label="R.3" id="p_r3" fieldName="probabilitas_responden3" value={data.probabilitas_responden3} error={errors.probabilitas_responden3} />
                                <RespondentField label="R.4" id="p_r4" fieldName="probabilitas_responden4" value={data.probabilitas_responden4} error={errors.probabilitas_responden4} />
                                
                                <div className="col-span-4 my-0.5 border-t border-slate-200 border-dashed dark:border-slate-800"></div>

                                <RespondentField label="R.5" id="p_r5" fieldName="probabilitas_responden5" value={data.probabilitas_responden5} error={errors.probabilitas_responden5} />
                                <RespondentField label="R.6" id="p_r6" fieldName="probabilitas_responden6" value={data.probabilitas_responden6} error={errors.probabilitas_responden6} />
                                <RespondentField label="R.7" id="p_r7" fieldName="probabilitas_responden7" value={data.probabilitas_responden7} error={errors.probabilitas_responden7} />
                                <RespondentField label="R.8" id="p_r8" fieldName="probabilitas_responden8" value={data.probabilitas_responden8} error={errors.probabilitas_responden8} />
                            </div>
                        </div>

                        {/* AUTO COMPUTED HIGHLIGHT BAR */}
                        <div className="flex items-center justify-between p-5 border-t bg-sky-50 dark:bg-sky-500/5 border-sky-100 dark:border-sky-500/20">
                            <div className="flex items-center">
                                <CalculatorIcon className="w-5 h-5 mr-2 text-sky-600 dark:text-sky-400" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-800 dark:text-sky-400">Nilai Modus</span>
                            </div>
                            <div className="px-4 py-1.5 bg-white dark:bg-[#020817] border border-sky-200 dark:border-sky-500/30 rounded-lg text-base font-black text-sky-700 dark:text-sky-400 shadow-sm">
                                {probabilitasMode || "0"}
                            </div>
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