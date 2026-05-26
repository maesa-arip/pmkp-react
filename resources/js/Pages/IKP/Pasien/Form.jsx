import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxMultiple from "@/Components/ComboboxMultiple";
import ComboboxPageKeterangan from "@/Components/ComboboxPageKeterangan";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useState, useEffect, Fragment } from "react";
import { 
    UserIcon, 
    ExclamationTriangleIcon, 
    ClockIcon,
    ShieldCheckIcon,
    PlusIcon,
    TrashIcon,
    DocumentTextIcon
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
    
    const picIdStrings = data.pic_id ? data.pic_id : ",";
    const picIdString = picIdStrings.replace(/['"]+/g, "");
    const defaultPicIds = picIdString.split(",");
    const defaultPicIdStrings = defaultPicIds.map((value) => value.toString());

    // --- STATES INIT (Safe Fallback) ---
    const [selectedPenanggung, setSelectedPenanggung] = useState(() => model ? ShouldMap.IkpPenanggung?.find((x) => x.id === model.ikp_penanggung_id) || defaultValue[0] : defaultValue[0]);
    const [selectedJenisKelamin, setSelectedJenisKelamin] = useState(() => model ? ShouldMap.JenisKelamin?.find((x) => x.id === model.jeniskelamin) || defaultValue[0] : defaultValue[0]);
    const [selectedPelapor, setSelectedPelapor] = useState(() => model ? ShouldMap.IkpPelapor?.find((x) => x.id === model.ikp_pelapor_id) || defaultValue[0] : defaultValue[0]);
    const [selectedGrupLayanan, setSelectedGrupLayanan] = useState(() => model ? ShouldMap.IkpGrupLayanan?.find((x) => x.id === model.ikp_gruplayanan_id) || defaultValue[0] : defaultValue[0]);
    const [selectedJenisInsiden, setSelectedJenisInsiden] = useState(() => model ? ShouldMap.IkpJenisInsiden?.find((x) => x.id === model.ikp_jenis_insiden_id) || defaultValue[0] : defaultValue[0]);
    const [selectedTipeInsiden, setSelectedTipeInsiden] = useState(() => model ? ShouldMap.IkpTipeInsiden?.find((x) => x.id === model.ikp_tipe_insiden_id) || defaultValue[0] : defaultValue[0]);
    const [selectedLokasi, setSelectedLokasi] = useState(() => model ? ShouldMap.IkpLokasi?.find((x) => x.id === model.ikp_lokasi_id) || defaultValue[0] : defaultValue[0]);
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState(() => model ? ShouldMap.IkpSpesialisasi?.find((x) => x.id === model.ikp_spesialisasi_id) || defaultValue[0] : defaultValue[0]);
    const [selectedIkpDampak, setSelectedIkpDampak] = useState(() => model ? ShouldMap.IkpDampak?.find((x) => x.id === model.ikp_dampak_id) || defaultValue[0] : defaultValue[0]);
    const [selectedIkpProbabilitas, setSelectedIkpProbabilitas] = useState(() => model ? ShouldMap.IkpProbabilitas?.find((x) => x.id === model.ikp_probabilitas_id) || defaultValue[0] : defaultValue[0]);
    const [selectedIkpPenindak, setSelectedIkpPenindak] = useState(() => model ? ShouldMap.IkpPenindak?.find((x) => x.id === model.ikp_penindak_id) || defaultValue[0] : defaultValue[0]);
    const [selectedIkpTerjadiTempatLain, setSelectedIkpTerjadiTempatLain] = useState(() => model ? ShouldMap.IkpTerjadiTempatLain?.find((x) => x.id === model.terjadi_tempatlain) || defaultValue[0] : defaultValue[0]);

    // --- LOGIKA KRONOLOGIS DINAMIS (Dari Inputs.jsx) ---
    const [inputFields, setInputFields] = useState(model?.kronologis ?? [{ waktu: "", kronologi: "" }]);
    
    const handleFormChange = (index, event) => {
        let newData = [...inputFields];
        newData[index][event.target.name] = event.target.value;
        setInputFields(newData);
    };
    
    const addFields = () => setInputFields([...inputFields, { waktu: "", kronologi: "" }]);
    const removeFields = (index) => {
        let newData = [...inputFields];
        newData.splice(index, 1);
        setInputFields(newData);
    };

    useEffect(() => {
        setData(prevData => ({ ...prevData, ["kronologis"]: inputFields }));
    }, [inputFields]);

    // --- STYLING CLASSES ---
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- BENTO 1: DATA PASIEN --- */}
                <div className={`${sectionCardClass} relative z-[90]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Pasien</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Informasi identitas dan penanggung biaya pasien.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        
                        <div className="relative flex flex-col col-span-12 md:col-span-8 z-[99]">
                            <label className={labelClass}>Nama Pasien</label>
                            <TextInput
                                id="namapasien"
                                value={data.namapasien}
                                handleChange={(e) => setData("namapasien", e.target.value)}
                                type="text"
                                className={inputClass}
                                placeholder="Nama lengkap..."
                            />
                            <InputError message={errors.namapasien} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-4 z-[98]">
                            <label className={labelClass}>Nomor Rekam Medis (NRM)</label>
                            <TextInput
                                id="nrm"
                                value={data.nrm}
                                handleChange={(e) => setData("nrm", e.target.value)}
                                type="text"
                                className={inputClass}
                            />
                            <InputError message={errors.nrm} className="mt-1" />
                        </div>

                        {/* Umur (Tahun, Bulan, Hari) */}
                        <div className="col-span-12 pt-4 border-t md:col-span-6 border-slate-100 dark:border-slate-800 md:border-none md:pt-0">
                            <label className={labelClass}>Umur Pasien (Tahun / Bulan / Hari)</label>
                            <div className="grid grid-cols-3 gap-3">
                                <TextInput
                                    id="umur_tahun"
                                    value={data.umur_tahun}
                                    handleChange={(e) => setData("umur_tahun", e.target.value)}
                                    type="number"
                                    className={inputClass}
                                    placeholder="Tahun"
                                />
                                <TextInput
                                    id="umur_bulan"
                                    value={data.umur_bulan}
                                    handleChange={(e) => setData("umur_bulan", e.target.value)}
                                    type="number"
                                    className={inputClass}
                                    placeholder="Bulan"
                                />
                                <TextInput
                                    id="umur_hari"
                                    value={data.umur_hari}
                                    handleChange={(e) => setData("umur_hari", e.target.value)}
                                    type="number"
                                    className={inputClass}
                                    placeholder="Hari"
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <InputError message={errors.umur_tahun} />
                                <InputError message={errors.umur_bulan} />
                                <InputError message={errors.umur_hari} />
                            </div>
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[97]">
                            <label className={labelClass}>Jenis Kelamin</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.JenisKelamin || []}
                                selected={selectedJenisKelamin}
                                onChange={(e) => {
                                    setData({ ...data, ["jeniskelamin"]: e.id });
                                    setSelectedJenisKelamin(e);
                                }}
                            />
                            <InputError message={errors.jeniskelamin} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[96]">
                            <label className={labelClass}>Penanggung Biaya Pasien</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpPenanggung || []}
                                selected={selectedPenanggung}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_penanggung_id"]: e.id });
                                    setSelectedPenanggung(e);
                                }}
                            />
                            <InputError message={errors.ikp_penanggung_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[95]">
                            <label className={labelClass}>Tanggal Masuk RS / Pelayanan</label>
                            <TextInput
                                id="tanggal_pelayanan"
                                value={data.tanggal_pelayanan}
                                handleChange={(e) => setData("tanggal_pelayanan", e.target.value)}
                                type="datetime-local"
                                className={inputClass}
                            />
                            <InputError message={errors.tanggal_pelayanan} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- BENTO 2: RINCIAN KEJADIAN INSIDEN --- */}
                <div className={`${sectionCardClass} relative z-[80]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Rincian Kejadian Insiden</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Deskripsikan waktu, lokasi, dan detail insiden secara lengkap.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[89]">
                            <label className={labelClass}>Tanggal dan Waktu Insiden</label>
                            <TextInput
                                id="tanggal_insiden"
                                value={data.tanggal_insiden}
                                handleChange={(e) => setData("tanggal_insiden", e.target.value)}
                                type="datetime-local"
                                className={inputClass}
                            />
                            <InputError message={errors.tanggal_insiden} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[88]">
                            <label className={labelClass}>Orang Pertama Yang Melaporkan</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpPelapor || []}
                                selected={selectedPelapor}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_pelapor_id"]: e.id });
                                    setSelectedPelapor(e);
                                }}
                            />
                            <InputError message={errors.ikp_pelapor_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 z-[87]">
                            <label className={labelClass}>Deskripsi Insiden</label>
                            <TextAreaInput
                                id="insiden"
                                value={data.insiden}
                                handleChange={(e) => setData("insiden", e.target.value)}
                                rows={3}
                                className={inputClass}
                                placeholder="Jelaskan secara rinci insiden yang terjadi..."
                            />
                            <InputError message={errors.insiden} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[86]">
                            <label className={labelClass}>Insiden Menyangkut Pasien</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpGrupLayanan || []}
                                selected={selectedGrupLayanan}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_gruplayanan_id"]: e.id });
                                    setSelectedGrupLayanan(e);
                                }}
                            />
                            <InputError message={errors.ikp_gruplayanan_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[85]">
                            <label className={labelClass}>Tempat Insiden (Lokasi Secara Umum)</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpLokasi || []}
                                selected={selectedLokasi}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_lokasi_id"]: e.id });
                                    setSelectedLokasi(e);
                                }}
                            />
                            <InputError message={errors.ikp_lokasi_id} className="mt-1" />
                        </div>

                        {data.ikp_lokasi_id && (
                            <div className="relative flex flex-col col-span-12 z-[84]">
                                <label className={labelClass}>Lokasi Detail Kejadian</label>
                                <TextInput
                                    id="lokasi_name"
                                    value={data.lokasi_name}
                                    handleChange={(e) => setData("lokasi_name", e.target.value)}
                                    type="text"
                                    className={inputClass}
                                    placeholder="Contoh: Kamar Mandi Bangsal Melati, dsb..."
                                />
                                <InputError message={errors.lokasi_name} className="mt-1" />
                            </div>
                        )}

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[83]">
                            <label className={labelClass}>Unit Kerja Penyebab Insiden</label>
                            <ComboboxMultiple
                                ShouldMap={ShouldMap.pics || []}
                                name={"pic_id"}
                                onChange={(selectedIdsString) => setData({ ...data, ["pic_id"]: selectedIdsString })}
                                defaultValues={defaultPicIdStrings}
                            />
                            <InputError message={errors.pic_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[82]">
                            <label className={labelClass}>Insiden Terjadi Pada Spesialisasi</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpSpesialisasi || []}
                                selected={selectedSpesialisasi}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_spesialisasi_id"]: e.id });
                                    setSelectedSpesialisasi(e);
                                }}
                            />
                            <InputError message={errors.ikp_spesialisasi_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[81]">
                            <label className={labelClass}>Jenis Insiden</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpJenisInsiden || []}
                                selected={selectedJenisInsiden}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_jenis_insiden_id"]: e.id });
                                    setSelectedJenisInsiden(e);
                                }}
                            />
                            <InputError message={errors.ikp_jenis_insiden_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[80]">
                            <label className={labelClass}>Tipe Insiden</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpTipeInsiden || []}
                                selected={selectedTipeInsiden}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_tipe_insiden_id"]: e.id });
                                    setSelectedTipeInsiden(e);
                                }}
                            />
                            <InputError message={errors.ikp_tipe_insiden_id} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- BENTO 3: KRONOLOGI INSIDEN (DYNAMIC FIELDS) --- */}
                <div className={`${sectionCardClass} relative z-[70]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ClockIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Kronologi Kejadian</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Ceritakan urutan waktu dan kronologis kejadian insiden.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-4 p-6 bg-slate-50/50 dark:bg-transparent rounded-b-2xl">
                        {inputFields.map((input, index) => (
                            <div key={index} className="relative p-5 bg-white border shadow-sm dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 rounded-xl group transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50">
                                
                                {/* Timeline Badge Number */}
                                <div className="absolute flex items-center justify-center w-6 h-6 text-xs font-black text-white bg-indigo-500 rounded-full shadow -top-3 -left-3 ring-4 ring-white dark:ring-[#0f172a]">
                                    {index + 1}
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                                        <label className={labelClass}>Waktu Kejadian</label>
                                        <input
                                            required
                                            type="datetime-local"
                                            name="waktu"
                                            value={input.waktu}
                                            autoComplete="off"
                                            className={inputClass}
                                            onChange={(event) => handleFormChange(index, event)}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-8 lg:col-span-8">
                                        <label className={labelClass}>Catatan Kronologi</label>
                                        <TextAreaInput
                                            required
                                            name="kronologi"
                                            value={input.kronologi}
                                            rows={2}
                                            className={inputClass}
                                            placeholder="Jelaskan urutan kejadian pada waktu tersebut..."
                                            handleChange={(event) => handleFormChange(index, event)}
                                        />
                                    </div>

                                    {/* Action Buttons inside row */}
                                    <div className="flex items-end justify-end col-span-12 md:col-span-12 lg:col-span-1">
                                        {inputFields.length > 1 && (
                                            <button type="button" onClick={() => removeFields(index)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors tooltip-trigger" title="Hapus Baris">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center mt-2">
                            <button type="button" onClick={addFields} className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-600 transition-colors bg-white border border-indigo-200 border-dashed rounded-lg shadow-sm hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10">
                                <PlusIcon className="w-4 h-4 mr-1.5" /> Tambah Kronologi
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BENTO 4: DAMPAK & PROBABILITAS --- */}
                <div className={`${sectionCardClass} relative z-[60]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Analisis Dampak & Probabilitas</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Penilaian risiko awal terkait insiden tersebut.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[69]">
                            <label className={labelClass}>Dampak Insiden Terhadap Pasien</label>
                            <ComboboxPageKeterangan
                                ShouldMap={ShouldMap.IkpDampak || []}
                                selected={selectedIkpDampak}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_dampak_id"]: e.id });
                                    setSelectedIkpDampak(e);
                                }}
                            />
                            <InputError message={errors.ikp_dampak_id} className="mt-1" />
                        </div>
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[68]">
                            <label className={labelClass}>Probabilitas Terjadi</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpProbabilitas || []}
                                selected={selectedIkpProbabilitas}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_probabilitas_id"]: e.id });
                                    setSelectedIkpProbabilitas(e);
                                }}
                            />
                            <InputError message={errors.ikp_probabilitas_id} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- BENTO 5: TINDAK LANJUT --- */}
                <div className={`${sectionCardClass} relative z-[50] mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <DocumentTextIcon className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Tindak Lanjut & Pencegahan</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Langkah perbaikan langsung dan pencegahan di unit lain.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="relative flex flex-col col-span-12 z-[59]">
                            <label className={labelClass}>Tindak lanjut segera setelah kejadian & Hasilnya</label>
                            <TextAreaInput
                                id="tindak_lanjut_hasil"
                                value={data.tindak_lanjut_hasil}
                                handleChange={(e) => setData("tindak_lanjut_hasil", e.target.value)}
                                rows={4}
                                className={inputClass}
                                placeholder="Jelaskan tindakan darurat atau respons awal..."
                            />
                            <InputError message={errors.tindak_lanjut_hasil} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[58]">
                            <label className={labelClass}>Tindak Lanjut Dilakukan Oleh</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpPenindak || []}
                                selected={selectedIkpPenindak}
                                onChange={(e) => {
                                    setData({ ...data, ["ikp_penindak_id"]: e.id });
                                    setSelectedIkpPenindak(e);
                                }}
                            />
                            <InputError message={errors.ikp_penindak_id} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[57]">
                            <label className={labelClass}>Apakah pernah terjadi pada pelayanan lain?</label>
                            <ComboboxPage
                                ShouldMap={ShouldMap.IkpTerjadiTempatLain || []}
                                selected={selectedIkpTerjadiTempatLain}
                                onChange={(e) => {
                                    setData({ ...data, ["terjadi_tempatlain"]: e.id });
                                    setSelectedIkpTerjadiTempatLain(e);
                                }}
                            />
                            <InputError message={errors.terjadi_tempatlain} className="mt-1" />
                        </div>

                        {data.terjadi_tempatlain == 1 && (
                            <div className="relative flex flex-col col-span-12 z-[56]">
                                <label className={labelClass}>Langkah Pencegahan di Tempat Lain</label>
                                <TextAreaInput
                                    id="langkah_tempatlain"
                                    value={data.langkah_tempatlain}
                                    handleChange={(e) => setData("langkah_tempatlain", e.target.value)}
                                    rows={4}
                                    className={`${inputClass} border-amber-300 dark:border-amber-500/40 focus:border-amber-500`}
                                    placeholder="Langkah apa yang telah diambil untuk mencegah kejadian yang sama berulang?..."
                                />
                                <InputError message={errors.langkah_tempatlain} className="mt-1" />
                            </div>
                        )}
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