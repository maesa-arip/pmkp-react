import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import RadioCard from "@/Components/RadioCard";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "@/Components/DatePicker/DatePicker";

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
    // console.log(ShouldMap);
    const [selectedProses, setSelectedProses] = useState(() => {
        if (model) {
            return ShouldMap.proses.find((x) => x.id === model.proses_id);
        }
        return defaultValue[0];
    });
    const [selectedCurrently, setSelectedCurrently] = useState(() => {
        if (model) {
            return ShouldMap.currently.find((x) => x.id === model.currently_id);
        }
        return defaultValue[0];
    });
    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (model) {
            return ShouldMap.riskCategories.find(
                (x) => x.id === model.risk_category_id
            );
        }
        return defaultValue[0];
    });
    // console.log(data)
    const [selectedSource, setSelectedSource] = useState(() => {
        if (model) {
            return ShouldMap.identificationSources.find(
                (x) => x.id === model.identification_source_id
            );
        }
        return defaultValue[0];
    });
    const [selectedLocation, setSelectedLocation] = useState(() => {
        if (model) {
            return ShouldMap.locations.find((x) => x.id === model.location_id);
        }
        return defaultValue[0];
    });
    const [selectedVariety, setSelectedVariety] = useState(() => {
        if (model) {
            return ShouldMap.riskVarieties.find(
                (x) => x.id === model.risk_variety_id
            );
        }
        return defaultValue[0];
    });
    const [selectedType, setSelectedType] = useState(() => {
        if (model) {
            return ShouldMap.riskTypes.find((x) => x.id === model.risk_type_id);
        }
        return defaultValue[0];
    });
    const [selectedImpact1, setSelectedImpact1] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(
                (x) => x.id === model.osd1_dampak
            );
        }
        return defaultValue[0];
    });
    const [selectedProbability1, setSelectedProbability1] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(
                (x) => x.id === model.osd1_probabilitas
            );
        }
        return defaultValue[0];
    });
    const [selectedControl1, setSelectedControl1] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(
                (x) => x.id === model.osd1_controllability
            );
        }
        return defaultValue[0];
    });
    const [selectedImpact2, setSelectedImpact2] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(
                (x) => x.id === model.osd2_dampak
            );
        }
        return defaultValue[0];
    });
    const [selectedProbability2, setSelectedProbability2] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(
                (x) => x.id === model.osd2_probabilitas
            );
        }
        return defaultValue[0];
    });
    const [selectedControl2, setSelectedControl2] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(
                (x) => x.id === model.osd2_controllability
            );
        }
        return defaultValue[0];
    });
    const [selectedPic, setSelectedPic] = useState(() => {
        if (model) {
            return ShouldMap.pics.find((x) => x.id === model.pic_id);
        }
        return defaultValue[0];
    });
    const [selectedIndikatorFitur04, setSelectedIndikatorFitur04] = useState(
        () => {
            if (model) {
                return ShouldMap.indikatorFitur04s.find(
                    (x) => x.id === model.indikator_fitur04_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedPengawasan, setSelectedPengawasan] = useState(() => {
        if (model) {
            return ShouldMap.pengawasan.find(
                (x) => x.id === model.pengawasan_id
            );
        }
        return defaultValue[0];
    });
    const [selectedPerluPenanganan, setSelectedPerluPenanganan] = useState(
        () => {
            if (model) {
                return ShouldMap.perluPenanganan.find(
                    (x) => x.id === model.perlu_penanganan_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedOpsiPengendalian, setSelectedOpsiPengendalian] = useState(
        () => {
            if (model) {
                return ShouldMap.opsiPengendalian.find(
                    (x) => x.id === model.opsi_pengendalian_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedPembiayaanRisiko, setSelectedPembiayaanRisiko] = useState(
        () => {
            if (model) {
                return ShouldMap.pembiayaanRisiko.find(
                    (x) => x.id === model.pembiayaan_risiko_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedEfektif, setSelectedEfektif] = useState(() => {
        if (model) {
            return ShouldMap.efektif.find((x) => x.id === model.efektif_id);
        }
        return defaultValue[0];
    });
    const [selectedJenisPengendalian, setSelectedJenisPengendalian] = useState(
        () => {
            if (model) {
                return ShouldMap.jenisPengendalian.find(
                    (x) => x.id === model.jenis_pengendalian_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedWaktuPengendalian, setSelectedWaktuPengendalian] = useState(
        () => {
            if (model) {
                return ShouldMap.waktuPengendalian.find(
                    (x) => x.id === model.waktu_pengendalian_id
                );
            }
            return defaultValue[0];
        }
    );

    const [selectedWaktuImplementasi, setSelectedWaktuImplementasi] = useState(
        () => {
            if (model) {
                return ShouldMap.waktuImplementasi.find(
                    (x) => x.id === model.waktu_implementasi_id
                );
            }
            return defaultValue[0];
        }
    );

    const [selectedRealisasi, setSelectedRealisasi] = useState(
        () => {
            if (model) {
                return ShouldMap.realisasi.find(
                    (x) => x.id === model.realisasi_id
                );
            }
            return defaultValue[0];
        }
    );

    useEffect(() => {
        setData({
            ...data,
            ["pernyataan_risiko"]:
                "Karena " +
                data.sebab +
                " Kemungkinan " +
                data.resiko +
                " Sehingga " +
                data.dampak,
        });
        // const setPernyataanResiko = 'Karena ' + data.sebab + 'Kemungkinan ' + data.resiko + 'Sehingga ' + data.dampak;
    }, [data.sebab, data.resiko, data.dampak]);

    const [tglRegister, setTglRegister] = useState(null);
    const [tglSelesai, setTglSelesai] = useState(null);
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <InputLabel for="Indikator" value="Indikator" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.indikatorFitur04s}
                            selected={selectedIndikatorFitur04}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["indikator_fitur04_id"]: e.id,
                                });
                                setSelectedIndikatorFitur04(e);
                            }}
                        />
                        <InputError
                            message={errors.indikator_fitur04_id}
                            className="mt-2"
                        />
                    </div>

                    {/* <div className="col-span-6">
                        <InputLabel for="Proses" value="Proses" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.proses}
                            selected={selectedProses}
                            onChange={(e) => {
                                setData({ ...data, ["proses_id"]: e.id });
                                setSelectedProses(e);
                                
                            }}
                        />
                        <InputError
                            message={errors.proses_id}
                            className="mt-2"
                        />
                    </div> */}
                    <div className="col-span-6">
                        <InputLabel
                            for="Kategori Risiko"
                            value="Kategori Risiko"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.riskCategories}
                            selected={selectedCategory}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["risk_category_id"]: e.id,
                                });
                                setSelectedCategory(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_category_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="TanggalRegister"
                            value="Tanggal Register"
                        />
                        <DatePicker
                            dateFormat="dd-MM-yyyy"
                            value={data.tgl_register}
                            selected={tglRegister}
                            id="tgl_register"
                            name="tgl_register"
                            autoComplete="off"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(date) => {
                                setTglRegister(date);
                                const d = new Date(date).toLocaleDateString(
                                    "en-CA"
                                );
                                // console.log(d);
                                setData("tgl_register", d);
                            }}
                        />
                        <InputError
                            message={errors.tgl_register}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="TargetWaktu"
                            value="Target Waktu (Hari)"
                        />
                        {/* <DatePicker/> */}
                        {/* <DatePicker 
                        dateFormat="dd-MM-yyyy"
                        value={data.tgl_selesai}
                        selected={tglSelesai} id="tgl_selesai" autoComplete="off" name="tgl_selesai" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                        onChange={(date) => {
                            setTglSelesai(date);
                            const d = new Date(date).toLocaleDateString('en-CA');
                            // console.log(d);
                            
                            setData("tgl_selesai", d);
                        }} /> */}

                        {/* <InputError
                            message={errors.tgl_selesai}
                            className="mt-2"
                        /> */}
                        <TextInput
                            id="target_waktu"
                            value={data.target_waktu}
                            handleChange={(e) =>
                                setData("target_waktu", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.target_waktu}
                            className="mt-2"
                        />
                    </div>

                    {/* <div className="col-span-12 p-2 border rounded-lg">
                        <label htmlFor="" className="block mb-4 text-lg font-bold text-gray-700">Target Waktu</label>
                        <div className="col-span-12">
                        <TextInput
                            id="target_waktu"
                            value={data.target_waktu}
                            handleChange={(e) =>
                                setData("target_waktu", e.target.value)
                            }
                            readOnly={false}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.target_waktu} className="mt-2" />
                    </div>
                    </div> */}

                    {/* <div className="col-span-4">
                        <InputLabel for="Lokasi" value="Lokasi" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.locations}
                            selected={selectedLocation}
                            onChange={(e) => {
                                setData({ ...data, ["location_id"]: e.id });
                                setSelectedLocation(e);
                            }}
                        />
                        <InputError
                            message={errors.location_id}
                            className="mt-2"
                        />
                    </div> */}
                    <div className="col-span-8">
                        <InputLabel for="sebab" value="Sebab" />
                        <TextAreaInput
                            id="sebab"
                            value={data.sebab}
                            handleChange={(e) =>
                                setData("sebab", e.target.value)
                            }
                            // onChange={onChange}
                            rows={5}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.sebab} className="mt-2" />
                    </div>
                    <div className="col-span-4 mt-6">
                        <RadioCard
                            ShouldMap={ShouldMap.currently}
                            selected={selectedCurrently}
                            onChange={(e) => {
                                setData({ ...data, ["currently_id"]: e.id });
                                setSelectedCurrently(e);
                            }}
                        />
                        <InputError
                            message={errors.currently_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-8">
                        <InputLabel
                            for="Kategori Risiko"
                            value="Penanggung Jawab / Pic"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.pics}
                            selected={selectedPic}
                            onChange={(e) => {
                                setData({ ...data, ["pic_id"]: e.id });
                                setSelectedPic(e);
                            }}
                        />
                        <InputError message={errors.pic_id} className="mt-2" />
                    </div>
                    <div className="col-span-4">
                        <InputLabel
                            for="Sumber Identifikasi"
                            value="Sumber Identifikasi"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.identificationSources}
                            selected={selectedSource}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["identification_source_id"]: e.id,
                                });
                                setSelectedSource(e);
                            }}
                        />
                        <InputError
                            message={errors.identification_source_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-12">
                        <InputLabel for="resiko" value="Resiko" />
                        <TextAreaInput
                            id="resiko"
                            value={data.resiko}
                            handleChange={(e) =>
                                setData("resiko", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.resiko} className="mt-2" />
                    </div>
                    <div className="col-span-12">
                        <InputLabel for="dampak" value="Dampak" />
                        <TextAreaInput
                            id="dampak"
                            value={data.dampak}
                            handleChange={(e) =>
                                setData("dampak", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.dampak} className="mt-2" />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="pernyataan risiko"
                            value="Pernyataan Risiko"
                        />
                        <TextAreaInput
                            id="pernyataan_risiko"
                            readOnly={true}
                            value={data.pernyataan_risiko ?? ""}
                            handleChange={(e) =>
                                setData("pernyataan_risiko", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.pernyataan_risiko}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6">
                        <InputLabel for="Jenis Insiden" value="Jenis Insiden" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.riskVarieties}
                            selected={selectedVariety}
                            onChange={(e) => {
                                setData({ ...data, ["risk_variety_id"]: e.id });
                                setSelectedVariety(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_variety_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel for="Tipe insiden" value="Tipe Insiden" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.riskTypes}
                            selected={selectedType}
                            onChange={(e) => {
                                setData({ ...data, ["risk_type_id"]: e.id });
                                setSelectedType(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_type_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6 p-2 my-2 border rounded-lg">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            OSD 1
                        </label>

                        <div className="col-span-12 my-6">
                            <InputLabel for="Dampak" value="Dampak" />
                            <ComboboxPage
                                ShouldMap={ShouldMap.impactValues}
                                selected={selectedImpact1}
                                onChange={(e) => {
                                    setData({ ...data, ["osd1_dampak"]: e.id });
                                    setSelectedImpact1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_dampak}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Probabilitas"
                            />
                            <ComboboxPage
                                ShouldMap={ShouldMap.probabilityValues}
                                selected={selectedProbability1}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ["osd1_probabilitas"]: e.id,
                                    });
                                    setSelectedProbability1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_probabilitas}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Controllability"
                            />
                            <ComboboxPage
                                ShouldMap={ShouldMap.controlValues}
                                selected={selectedControl1}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ["osd1_controllability"]: e.id,
                                    });
                                    setSelectedControl1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_controllability}
                                className="mt-2"
                            />
                        </div>
                        {/* <div className="col-span-12 my-6">
                            <InputLabel
                                for="osd_inherent"
                                value="OSD Inherent"
                            />
                            <TextInput
                            id="osd_inherent"
                            value={data.osd_inherent}
                            handleChange={(e) =>
                                setData("osd_inherent", e.target.value)
                            }
                            readOnly={true}
                            type="number"
                            className="block w-full mt-1"
                        />
                            <InputError
                                message={errors.osd_inherent}
                                className="mt-2"
                            />
                        </div> */}
                    </div>
                    <div className="col-span-6 p-2 my-2 border rounded-lg">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            OSD 2
                        </label>

                        <div className="col-span-12 my-6">
                            <InputLabel for="Dampak" value="Dampak" />
                            <ComboboxPage
                                ShouldMap={ShouldMap.impactValues}
                                selected={selectedImpact2}
                                onChange={(e) => {
                                    setData({ ...data, ["osd2_dampak"]: e.id });
                                    setSelectedImpact2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_dampak}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Probabilitas"
                            />
                            <ComboboxPage
                                ShouldMap={ShouldMap.probabilityValues}
                                selected={selectedProbability2}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ["osd2_probabilitas"]: e.id,
                                    });
                                    setSelectedProbability2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_probabilitas}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Controllability"
                            />
                            <ComboboxPage
                                ShouldMap={ShouldMap.controlValues}
                                selected={selectedControl2}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ["osd2_controllability"]: e.id,
                                    });
                                    setSelectedControl2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_controllability}
                                className="mt-2"
                            />
                        </div>
                        {/* <div className="col-span-12 my-6">
                            <InputLabel
                                for="osd_residual"
                                value="OSD Residual"
                            />
                            <TextInput
                            id="osd_residual"
                            value={data.osd_residual}
                            handleChange={(e) =>
                                setData("osd_residual", e.target.value)
                            }
                            readOnly={true}
                            type="number"
                            className="block w-full mt-1"
                        />
                            <InputError
                                message={errors.osd_residual}
                                className="mt-2"
                            />
                        </div> */}
                    </div>
                    {/* <div className="col-span-12 p-2 border rounded-lg">
                        <label htmlFor="" className="block mb-4 text-lg font-bold text-gray-700">Grading Matrix</label>
                        <div className="col-span-12">
                        <TextInput
                            id="grading1"
                            value={data.grading1}
                            handleChange={(e) =>
                                setData("grading1", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.grading1} className="mt-2" />
                    </div>
                    </div> */}

                    <div className="col-span-8">
                        <InputLabel
                            for="pengendalian_risiko"
                            value="Pengendalian Risiko"
                        />
                        <TextAreaInput
                            id="pengendalian_risiko"
                            value={data.pengendalian_risiko}
                            handleChange={(e) =>
                                setData("pengendalian_risiko", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.pengendalian_risiko}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-4 my-6">
                        <InputLabel
                            for="Perlu Penanganan"
                            value="Perlu Penanganan"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.perluPenanganan}
                            selected={selectedPerluPenanganan}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["perlu_penanganan_id"]: e.id,
                                });
                                setSelectedPerluPenanganan(e);
                            }}
                        />
                        <InputError
                            message={errors.perlu_penanganan_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Opsi Pengendalian"
                            value="Opsi Pengendalian"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.opsiPengendalian}
                            selected={selectedOpsiPengendalian}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["opsi_pengendalian_id"]: e.id,
                                });
                                setSelectedOpsiPengendalian(e);
                            }}
                        />
                        <InputError
                            message={errors.opsi_pengendalian_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Pembiayaan Risiko"
                            value="Pembiayaan Risiko"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.pembiayaanRisiko}
                            selected={selectedPembiayaanRisiko}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["pembiayaan_risiko_id"]: e.id,
                                });
                                setSelectedPembiayaanRisiko(e);
                            }}
                        />
                        <InputError
                            message={errors.pembiayaan_risiko_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Efektif/Kurang Efektif"
                            value="Efektif/Kurang Efektif"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.efektif}
                            selected={selectedEfektif}
                            onChange={(e) => {
                                setData({ ...data, ["efektif_id"]: e.id });
                                setSelectedEfektif(e);
                            }}
                        />
                        <InputError
                            message={errors.efektif_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Jenis Pengendalian"
                            value="Jenis Pengendalian"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.jenisPengendalian}
                            selected={selectedJenisPengendalian}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["jenis_pengendalian_id"]: e.id,
                                });
                                setSelectedJenisPengendalian(e);
                            }}
                        />
                        <InputError
                            message={errors.jenis_pengendalian_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Waktu Pengendalian"
                            value="Waktu Pengendalian"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.waktuPengendalian}
                            selected={selectedWaktuPengendalian}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["waktu_pengendalian_id"]: e.id,
                                });
                                setSelectedWaktuPengendalian(e);
                            }}
                        />
                        <InputError
                            message={errors.waktu_pengendalian_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="Yang Belum Tertangani"
                            value="Yang Belum Tertangani"
                        />
                        <TextAreaInput
                            id="belum_tertangani"
                            value={data.belum_tertangani}
                            handleChange={(e) =>
                                setData("belum_tertangani", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.belum_tertangani}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="Usulan Perbaikan"
                            value="Usulan Perbaikan"
                        />
                        <TextAreaInput
                            id="usulan_perbaikan"
                            value={data.usulan_perbaikan}
                            handleChange={(e) =>
                                setData("usulan_perbaikan", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.usulan_perbaikan}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Denum"
                            value="Denum"
                        />
                        <TextInput
                            id="denum"
                            value={data.denum}
                            handleChange={(e) =>
                                setData("denum", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.denum}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="NUM"
                            value="NUM"
                        />
                        <TextInput
                            id="num"
                            value={data.num}
                            handleChange={(e) =>
                                setData("num", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.num}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-8">
                        <InputLabel
                            for="Waktu Denum NUM"
                            value="Waktu Denum NUM"
                        />
                        <TextInput
                            id="waktudenumnum"
                            value={data.waktudenumnum}
                            handleChange={(e) =>
                                setData("waktudenumnum", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.waktudenumnum}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Waktu Implementasi"
                            value="Waktu Implementasi"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.waktuImplementasi}
                            selected={selectedWaktuImplementasi}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["waktu_implementasi_id"]: e.id,
                                });
                                setSelectedWaktuImplementasi(e);
                            }}
                        />
                        <InputError
                            message={errors.waktu_implementasi_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-6 my-6">
                        <InputLabel
                            for="Realisasi"
                            value="Realisasi"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.realisasi}
                            selected={selectedRealisasi}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["realisasi_id"]: e.id,
                                });
                                setSelectedRealisasi(e);
                            }}
                        />
                        <InputError
                            message={errors.realisasi_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="Output"
                            value="Output"
                        />
                        <TextAreaInput
                            id="output"
                            value={data.output}
                            handleChange={(e) =>
                                setData("output", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.output}
                            className="mt-2"
                        />
                    </div>

                    {/* <div className="col-span-4">
                        <InputLabel
                            for="Sumber Identifikasi"
                            value="Pengawasan"
                        />
                        <ComboboxPage
                            ShouldMap={ShouldMap.pengawasan}
                            selected={selectedPengawasan}
                            onChange={(e) => {
                                setData({ ...data, ["pengawasan_id"]: e.id });
                                setSelectedPengawasan(e);
                            }}
                        />
                        <InputError
                            message={errors.pengawasan_id}
                            className="mt-2"
                        />
                    </div> */}
                </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <PrimaryButton>{submit}</PrimaryButton>
                <SecondaryButton className="mx-2" onClick={closeButton}>
                    Batal
                </SecondaryButton>
            </div>
        </>
    );
}
