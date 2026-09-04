import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import TextInputWithError from "@/Components/TextInputWithError";
import ComboboxMultiple from "@/Components/ComboboxMultiple";
import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxPageReadonly from "@/Components/ComboboxPageReadonly";
import RadioCard from "@/Components/RadioCard";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DocumentTextIcon, ExclamationTriangleIcon, LockClosedIcon } from "@heroicons/react/24/outline";

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
    const picIdStrings = data.pic_id ? data.pic_id : ",";
    const picIdString = picIdStrings.replace(/['"]+/g, '');
    const defaultPicIds = picIdString.split(",");
    const defaultPicIdStrings = defaultPicIds.map((value) => value.toString());

    // STATE INITIALIZATION
    const [selectedCurrently, setSelectedCurrently] = useState(() => model ? ShouldMap.currently.find((x) => x.id === model.currently_id) : defaultValue[0]);
    const [selectedCategory, setSelectedCategory] = useState(() => model ? ShouldMap.riskCategories.find((x) => x.id === model.risk_category_id) : defaultValue[0]);
    const [selectedSource, setSelectedSource] = useState(() => model ? ShouldMap.identificationSources.find((x) => x.id === model.identification_source_id) : defaultValue[0]);
    
    // TAMBAHAN: Lokasi
    const [selectedLocation, setSelectedLocation] = useState(() => model ? ShouldMap.locations.find((x) => x.id === model.location_id) : defaultValue[0]);
    
    const [selectedVariety, setSelectedVariety] = useState(() => model ? ShouldMap.riskVarieties.find((x) => x.id === model.risk_variety_id) : defaultValue[0]);
    const [selectedType, setSelectedType] = useState(() => model ? ShouldMap.riskTypes.find((x) => x.id === model.risk_type_id) : defaultValue[0]);
    const [selectedJenisSebab, setSelectedJenisSebab] = useState(() => model ? ShouldMap.jenisSebabs.find((x) => x.id === model.jenis_sebab_id) : defaultValue[0]);
    const [selectedImpact1, setSelectedImpact1] = useState(() => model ? ShouldMap.impactValues.find((x) => x.id === model.osd1_dampak) : defaultValue[0]);
    const [selectedProbability1, setSelectedProbability1] = useState(() => model ? ShouldMap.probabilityValues.find((x) => x.id === model.osd1_probabilitas) : defaultValue[0]);
    const [selectedControl1, setSelectedControl1] = useState(() => model ? ShouldMap.controlValues.find((x) => x.id === model.osd1_controllability) : defaultValue[0]);
    const [selectedIndikatorFitur4, setSelectedIndikatorFitur4] = useState(() => model ? ShouldMap.indikatorFitur4s.find((x) => x.id === model.indikator_fitur4_id) : defaultValue[0]);
    const [selectedPerluPenanganan, setSelectedPerluPenanganan] = useState(() => model ? ShouldMap.perluPenanganan.find((x) => x.id === model.perlu_penanganan_id) : defaultValue[0]);
    const [selectedOpsiPengendalian, setSelectedOpsiPengendalian] = useState(() => model ? ShouldMap.opsiPengendalian.find((x) => x.id === model.opsi_pengendalian_id) : defaultValue[0]);
    const [selectedPembiayaanRisiko, setSelectedPembiayaanRisiko] = useState(() => model ? ShouldMap.pembiayaanRisiko.find((x) => x.id === model.pembiayaan_risiko_id) : defaultValue[0]);
    const [selectedEfektif, setSelectedEfektif] = useState(() => model ? ShouldMap.efektif.find((x) => x.id === model.efektif_id) : defaultValue[0]);
    const [selectedJenisPengendalian, setSelectedJenisPengendalian] = useState(() => model ? ShouldMap.jenisPengendalian.find((x) => x.id === model.jenis_pengendalian_id) : defaultValue[0]);
    const [selectedWaktuPengendalian, setSelectedWaktuPengendalian] = useState(() => model ? ShouldMap.waktuPengendalian.find((x) => x.id === model.waktu_pengendalian_id) : defaultValue[0]);

    // Auto-generate Pernyataan Risiko
    useEffect(() => {
        setData({
            ...data,
            ["pernyataan_risiko"]: "Karena " + (data.sebab || "___") + " kemungkinan " + (data.resiko || "___") + " sehingga " + (data.dampak || "___"),
        });
    }, [data.sebab, data.resiko, data.dampak]);
    
    const [tglRegister, setTglRegister] = useState(model?.tgl_register ? new Date(model.tgl_register) : null);

    // REUSABLE STYLING CLASSES
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const readOnlyInputClass = "block w-full text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-lg dark:text-slate-400 dark:bg-slate-800/60 dark:border-slate-800 cursor-not-allowed shadow-inner focus:ring-0 focus:border-slate-200 dark:focus:border-slate-800";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- SECTION 1: DATA RISIKO UTAMA --- */}
                <div className={`${sectionCardClass} relative z-[50]`}>
                    <div className={sectionHeaderClass}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Dasar Risiko Non Klinis</h3>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[60]">
                            <label className={labelClass}>Indikator</label>
                            <ComboboxPage ShouldMap={ShouldMap.indikatorFitur4s} selected={selectedIndikatorFitur4} onChange={(e) => { setData({ ...data, ["indikator_fitur4_id"]: e.id }); setSelectedIndikatorFitur4(e); }} />
                            <InputError message={errors.indikator_fitur4_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[59]">
                            <label className={labelClass}>Kategori Risiko</label>
                            <ComboboxPage ShouldMap={ShouldMap.riskCategories} selected={selectedCategory} onChange={(e) => { setData({ ...data, ["risk_category_id"]: e.id }); setSelectedCategory(e); }} />
                            <InputError message={errors.risk_category_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[58]">
                            <label className={labelClass}>Tanggal Register</label>
                            <DatePicker
                                dateFormat="dd-MM-yyyy"
                                value={data.tgl_register}
                                selected={tglRegister}
                                id="tgl_register"
                                name="tgl_register"
                                autoComplete="off"
                                className={inputClass}
                                onChange={(date) => {
                                    setTglRegister(date);
                                    if(date) {
                                        const d = new Date(date).toLocaleDateString("en-CA");
                                        setData("tgl_register", d);
                                    }
                                }}
                            />
                            <InputError message={errors.tgl_register} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[57]">
                            <label className={labelClass}>Jenis Sebab</label>
                            <ComboboxPage ShouldMap={ShouldMap.jenisSebabs} selected={selectedJenisSebab} onChange={(e) => { setData({ ...data, ["jenis_sebab_id"]: e.id }); setSelectedJenisSebab(e); }} />
                            <InputError message={errors.jenis_sebab_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[56]">
                            <label className={labelClass}>Sumber Identifikasi</label>
                            <ComboboxPage ShouldMap={ShouldMap.identificationSources} selected={selectedSource} onChange={(e) => { setData({ ...data, ["identification_source_id"]: e.id }); setSelectedSource(e); }} />
                            <InputError message={errors.identification_source_id} className="mt-1" />
                        </div>

                        {/* TAMBAHAN: LOKASI UNTUK NON KLINIS */}
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[55]">
                            <label className={labelClass}>Lokasi</label>
                            <ComboboxPage ShouldMap={ShouldMap.locations} selected={selectedLocation} onChange={(e) => { setData({ ...data, ["location_id"]: e.id }); setSelectedLocation(e); }} />
                            <InputError message={errors.location_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[54]">
                            <label className={labelClass}>Sebab Utama</label>
                            <TextAreaInput id="sebab" value={data.sebab} handleChange={(e) => setData("sebab", e.target.value)} rows={3} className={inputClass} placeholder="Deskripsikan penyebab utama dari masalah ini..." />
                            <InputError message={errors.sebab} className="mt-1" />
                        </div>
                        
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[53]">
                            <label className={labelClass}>Risiko Terjadi</label>
                            <TextAreaInput id="resiko" value={data.resiko} handleChange={(e) => setData("resiko", e.target.value)} rows={3} className={inputClass} placeholder="Deskripsikan kemungkinan risiko yang akan terjadi..." />
                            <InputError message={errors.resiko} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[52]">
                            <label className={labelClass}>Dampak (Penjabaran)</label>
                            <TextAreaInput id="dampak" value={data.dampak} handleChange={(e) => setData("dampak", e.target.value)} rows={3} className={inputClass} placeholder="Penjabaran dampak apa saja yang ditimbulkan..." />
                            <InputError message={errors.dampak} className="mt-1" />
                        </div>

                        {/* --- PREVIEW PERNYATAAN RISIKO (READ ONLY) --- */}
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[51]">
                            <label className={labelClass}>
                                <div className="flex items-center text-sky-600 dark:text-sky-400">
                                    <LockClosedIcon className="w-3 h-3 mr-1" />
                                    Preview Pernyataan (Auto-Generated)
                                </div>
                            </label>
                            <TextAreaInput 
                                id="pernyataan_risiko" 
                                readOnly={true} 
                                value={data.pernyataan_risiko} 
                                rows={3} 
                                className={readOnlyInputClass} 
                            />
                            <InputError message={errors.pernyataan_risiko} className="mt-1" />
                        </div>

                        {/* Status Terkini (Radio Card) */}
                        <div className="col-span-12 mt-2 md:col-span-6 relative z-[50]">
                            <label className={labelClass}>Status Saat Ini</label>
                            <RadioCard ShouldMap={ShouldMap.currently} selected={selectedCurrently} onChange={(e) => { setData({ ...data, ["currently_id"]: e.id }); setSelectedCurrently(e); }} />
                            <InputError message={errors.currently_id} className="mt-1" />
                        </div>

                        {/* Conditional Skenario Fraud */}
                        {data.risk_category_id === 6 && (
                            <div className="col-span-12 flex flex-col gap-1.5 p-5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl mt-2 relative z-[49]">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1 flex items-center">
                                    <ExclamationTriangleIcon className="w-4 h-4 mr-1.5" />
                                    Skenario (Wajib untuk Risiko Fraud)
                                </div>
                                <TextAreaInput id="kronologi" value={data.kronologi} handleChange={(e) => setData("kronologi", e.target.value)} rows={3} className={`${inputClass} border-orange-300 dark:border-orange-500/40 focus:border-orange-500 focus:ring-orange-500/20`} placeholder="Tuliskan skenario..." />
                                <InputError message={errors.kronologi} className="mt-1" />
                            </div>
                        )}

                        <div className="col-span-12 flex flex-col relative z-[48]">
                            <label className={labelClass}>PIC Unit Terkait</label>
                            <ComboboxMultiple ShouldMap={ShouldMap.pics} name={"pic_id"} onChange={(selectedIdsString) => setData({ ...data, ["pic_id"]: selectedIdsString })} defaultValues={defaultPicIdStrings} />
                            <InputError message={errors.pic_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col relative z-[47]">
                            <label className={labelClass}>Pihak Yang Terkena Dampak</label>
                            <TextAreaInput id="pihak_terkena" value={data.pihak_terkena} handleChange={(e) => setData("pihak_terkena", e.target.value)} rows={2} className={inputClass} placeholder="Siapa yang terdampak..." />
                            <InputError message={errors.pihak_terkena} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[46]">
                            <label className={labelClass}>Jenis Insiden</label>
                            <ComboboxPage ShouldMap={ShouldMap.riskVarieties} selected={selectedVariety} onChange={(e) => { setData({ ...data, ["risk_variety_id"]: e.id }); setSelectedVariety(e); }} />
                            <InputError message={errors.risk_variety_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[45]">
                            <label className={labelClass}>Tipe Insiden</label>
                            <ComboboxPage ShouldMap={ShouldMap.riskTypes} selected={selectedType} onChange={(e) => { setData({ ...data, ["risk_type_id"]: e.id }); setSelectedType(e); }} />
                            <InputError message={errors.risk_type_id} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: NUMERATOR & DENUMERATOR --- */}
                <div className={`${sectionCardClass} relative z-[40]`}>
                    <div className={sectionHeaderClass}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Numerator & Denumerator</h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Metrik pengukuran untuk target tindak lanjut monitoring.</p>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[45]">
                            <label className={labelClass}>Denumerator</label>
                            <TextInput id="denum" value={data.denum} handleChange={(e) => setData("denum", e.target.value)} type="number" className={inputClass} />
                            <InputError message={errors.denum} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[44]">
                            <label className={labelClass}>Numerator</label>
                            <TextInput id="num" value={data.num} handleChange={(e) => setData("num", e.target.value)} type="number" className={inputClass} />
                            <InputError message={errors.num} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex flex-col relative z-[43]">
                            <label className={labelClass}>Target Monitoring (Hari)</label>
                            <TextInput id="target_waktu" value={data.target_waktu} handleChange={(e) => setData("target_waktu", e.target.value)} type="number" placeholder="Contoh: 90/180/365" className={inputClass} />
                            <InputError message={errors.target_waktu} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: OSD INHERENT --- */}
                <div className={`${sectionCardClass} relative z-[30]`}>
                    <div className={sectionHeaderClass}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Analisa OSD Inherent</h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Pemetaan awal tingkat risiko sebelum adanya tindakan pengendalian tambahan.</p>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="flex items-start col-span-12 p-4 border bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 rounded-xl">
                            <svg className="w-5 h-5 mr-3 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-sm font-medium leading-snug text-sky-800 dark:text-sky-300">
                                Nilai Dampak dan Probabilitas saat ini <span className="font-bold">Hanya Baca (Read-Only)</span>. Nilai akan otomatis terisi setelah menyelesaikan proses Focus Group Discussion (FGD).
                            </p>
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[35]">
                            <label className={labelClass}>
                                <div className="flex items-center text-slate-400">
                                    <LockClosedIcon className="w-3 h-3 mr-1" />
                                    Dampak (Inherent / Auto)
                                </div>
                            </label>
                            <div className={readOnlyInputClass + " p-0 border-0"}>
                                <ComboboxPageReadonly ShouldMap={ShouldMap.impactValues} selected={selectedImpact1} onChange={(e) => { setData({ ...data, ["osd1_dampak"]: e.id }); setSelectedImpact1(e); }} />
                            </div>
                            <InputError message={errors.osd1_dampak} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[34]">
                            <label className={labelClass}>
                                <div className="flex items-center text-slate-400">
                                    <LockClosedIcon className="w-3 h-3 mr-1" />
                                    Probabilitas (Inherent / Auto)
                                </div>
                            </label>
                            <div className={readOnlyInputClass + " p-0 border-0"}>
                                <ComboboxPageReadonly ShouldMap={ShouldMap.probabilityValues} selected={selectedProbability1} onChange={(e) => { setData({ ...data, ["osd1_probabilitas"]: e.id }); setSelectedProbability1(e); }} />
                            </div>
                            <InputError message={errors.osd1_probabilitas} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[33]">
                            <label className={labelClass}>Controllability (Inherent)</label>
                            <ComboboxPage ShouldMap={ShouldMap.controlValues} selected={selectedControl1} onChange={(e) => { setData({ ...data, ["osd1_controllability"]: e.id }); setSelectedControl1(e); }} />
                            <InputError message={errors.osd1_controllability} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[32]">
                            <label className={labelClass}>Perlu Penanganan?</label>
                            <ComboboxPage ShouldMap={ShouldMap.perluPenanganan} selected={selectedPerluPenanganan} onChange={(e) => { setData({ ...data, ["perlu_penanganan_id"]: e.id }); setSelectedPerluPenanganan(e); }} />
                            <InputError message={errors.perlu_penanganan_id} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 4: PENGENDALIAN EKSISTING --- */}
                <div className={`${sectionCardClass} relative z-[20]`}>
                    <div className={sectionHeaderClass}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Pengendalian Yang Sudah Ada</h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Evaluasi kontrol dan mitigasi yang sedang berjalan saat ini.</p>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 flex flex-col relative z-[25]">
                            <label className={labelClass}>Pengendalian Risiko (Sesuai Standar)</label>
                            <TextAreaInput id="pengendalian_risiko" value={data.pengendalian_risiko} handleChange={(e) => setData("pengendalian_risiko", e.target.value)} rows={3} className={inputClass} placeholder="Tuliskan upaya yang sudah ada..." />
                            <InputError message={errors.pengendalian_risiko} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[24]">
                            <label className={labelClass}>Tingkat Keefektifan</label>
                            <ComboboxPage ShouldMap={ShouldMap.efektif} selected={selectedEfektif} onChange={(e) => { setData({ ...data, ["efektif_id"]: e.id }); setSelectedEfektif(e); }} />
                            <InputError message={errors.efektif_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col relative z-[23]">
                            <label className={labelClass}>Pengendalian Yang Diharapkan (Harus Ada)</label>
                            <TextAreaInput id="pengendalian_harus_ada" value={data.pengendalian_harus_ada} handleChange={(e) => setData("pengendalian_harus_ada", e.target.value)} rows={3} className={inputClass} placeholder="Tuliskan kontrol ideal yang diharapkan..." />
                            <InputError message={errors.pengendalian_harus_ada} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 5: OPSI PENGENDALIAN LANJUTAN --- */}
                <div className={`${sectionCardClass} mb-4 relative z-[10]`}>
                    <div className={sectionHeaderClass}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Opsi Pengendalian Lanjutan</h3>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Rencana tindakan lebih lanjut untuk mitigasi risiko.</p>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[16]">
                            <label className={labelClass}>Opsi Pengendalian</label>
                            <ComboboxPage ShouldMap={ShouldMap.opsiPengendalian} selected={selectedOpsiPengendalian} onChange={(e) => { setData({ ...data, ["opsi_pengendalian_id"]: e.id }); setSelectedOpsiPengendalian(e); }} />
                            <InputError message={errors.opsi_pengendalian_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[15]">
                            <label className={labelClass}>Pembiayaan Risiko</label>
                            <ComboboxPage ShouldMap={ShouldMap.pembiayaanRisiko} selected={selectedPembiayaanRisiko} onChange={(e) => { setData({ ...data, ["pembiayaan_risiko_id"]: e.id }); setSelectedPembiayaanRisiko(e); }} />
                            <InputError message={errors.pembiayaan_risiko_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[14]">
                            <label className={labelClass}>Jenis Pengendalian Tambahan</label>
                            <ComboboxPage ShouldMap={ShouldMap.jenisPengendalian} selected={selectedJenisPengendalian} onChange={(e) => { setData({ ...data, ["jenis_pengendalian_id"]: e.id }); setSelectedJenisPengendalian(e); }} />
                            <InputError message={errors.jenis_pengendalian_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[13]">
                            <label className={labelClass}>Waktu Implementasi / Pemantauan</label>
                            <ComboboxPage ShouldMap={ShouldMap.waktuPengendalian} selected={selectedWaktuPengendalian} onChange={(e) => { setData({ ...data, ["waktu_pengendalian_id"]: e.id }); setSelectedWaktuPengendalian(e); }} />
                            <InputError message={errors.waktu_pengendalian_id} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col relative z-[12]">
                            <label className={labelClass}>Uraian Penanganan Risiko</label>
                            <TextAreaInput id="penanganan_risiko" value={data.penanganan_risiko} handleChange={(e) => setData("penanganan_risiko", e.target.value)} rows={3} className={inputClass} placeholder="Tuliskan uraian penanganan..." />
                            <InputError message={errors.penanganan_risiko} className="mt-1" />
                        </div>

                        <div className="col-span-12 flex flex-col relative z-[11]">
                            <label className={labelClass}>Rencana Kegiatan Pengendalian (Step-by-Step)</label>
                            <TextAreaInput id="rencana_pengendalian" value={data.rencana_pengendalian} handleChange={(e) => setData("rencana_pengendalian", e.target.value)} rows={4} className={inputClass} placeholder="Langkah 1... Langkah 2..." />
                            <InputError message={errors.rencana_pengendalian} className="mt-1" />
                        </div>

                        {/* TAMBAHAN UNTUK NON KLINIS (Sesuai kode awal Anda) */}
                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[10]">
                            <label className={labelClass}>Yang Belum Tertangani</label>
                            <TextAreaInput id="belum_tertangani" value={data.belum_tertangani} handleChange={(e) => setData("belum_tertangani", e.target.value)} rows={2} className={inputClass} placeholder="Kendala tersisa..." />
                            <InputError message={errors.belum_tertangani} className="mt-1" />
                        </div>

                        <div className="col-span-12 md:col-span-6 flex flex-col relative z-[9]">
                            <label className={labelClass}>Usulan Perbaikan</label>
                            <TextAreaInput id="usulan_perbaikan" value={data.usulan_perbaikan} handleChange={(e) => setData("usulan_perbaikan", e.target.value)} rows={2} className={inputClass} placeholder="Saran perbaikan..." />
                            <InputError message={errors.usulan_perbaikan} className="mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FORM ACTIONS (STICKY BOTTOM / FOOTER) --- */}
            <div className="sticky bottom-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
                <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-sky-600 rounded-xl shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                    {submit}
                </button>
                <button type="button" onClick={closeButton} className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none">
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
