import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import RadioCard from "@/Components/RadioCard";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import TextInputWithError from "@/Components/TextInputWithError";
import Tooltip from "@/Components/Tooltip";
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
    const [selectedIndikatorFitur4, setSelectedIndikatorFitur4] = useState(
        () => {
            if (model) {
                return ShouldMap.indikatorFitur4s.find(
                    (x) => x.id === model.indikator_fitur4_id
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

    const [selectedRealisasi, setSelectedRealisasi] = useState(() => {
        if (model) {
            return ShouldMap.realisasi.find((x) => x.id === model.realisasi_id);
        }
        return defaultValue[0];
    });

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
                <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Data Risiko (Wajib di Input)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel for="Indikator" value="Indikator" />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.indikatorFitur4s}
                                    selected={selectedIndikatorFitur4}
                                    readOnly
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["indikator_fitur4_id"]: e.id,
                                        });
                                        setSelectedIndikatorFitur4(e);
                                    }}
                                />
                                <InputError
                                    message={errors.indikator_fitur4_id}
                                    className="mt-2"
                                />
                            </div>
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
                                        const d = new Date(
                                            date
                                        ).toLocaleDateString("en-CA");
                                        // console.log(d);
                                        setData("tgl_register", d);
                                    }}
                                />
                                <InputError
                                    message={errors.tgl_register}
                                    className="mt-2"
                                />
                            </div>
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
                                <InputError
                                    message={errors.sebab}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-4 mt-6">
                                <RadioCard
                                    ShouldMap={ShouldMap.currently}
                                    selected={selectedCurrently}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["currently_id"]: e.id,
                                        });
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
                                    value="PIC Unit Terkait"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.pics}
                                    selected={selectedPic}
                                    onChange={(e) => {
                                        setData({ ...data, ["pic_id"]: e.id });
                                        setSelectedPic(e);
                                    }}
                                />
                                <InputError
                                    message={errors.pic_id}
                                    className="mt-2"
                                />
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
                                <InputLabel for="resiko" value="Risiko" />
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
                                <InputError
                                    message={errors.resiko}
                                    className="mt-2"
                                />
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
                                <InputError
                                    message={errors.dampak}
                                    className="mt-2"
                                />
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
                                        setData(
                                            "pernyataan_risiko",
                                            e.target.value
                                        )
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
                                <InputLabel
                                    for="Jenis Insiden"
                                    value="Jenis Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.riskVarieties}
                                    selected={selectedVariety}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["risk_variety_id"]: e.id,
                                        });
                                        setSelectedVariety(e);
                                    }}
                                />
                                <InputError
                                    message={errors.risk_variety_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="Tipe insiden"
                                    value="Tipe Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.riskTypes}
                                    selected={selectedType}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["risk_type_id"]: e.id,
                                        });
                                        setSelectedType(e);
                                    }}
                                />
                                <InputError
                                    message={errors.risk_type_id}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            NUM DENUM (Wajib di Input)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6">
                                <InputLabel for="Denum" value="Denum" />
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
                                <InputLabel for="NUM" value="NUM" />
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
                            <div className="col-span-6">
                                <TextInputWithError
                                    label="Target Waktu Tindak Lanjut(Hari)"
                                    type="number"
                                    id="target_waktu"
                                    name="target_waktu"
                                    value={data.target_waktu}
                                    handleChange={(e) =>
                                        setData("target_waktu", e.target.value)
                                    }
                                    message={errors.target_waktu}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            OSD Inherent (Wajib di Input)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel for="Dampak" value="Dampak" />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.impactValues}
                                    selected={selectedImpact1}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["osd1_dampak"]: e.id,
                                        });
                                        setSelectedImpact1(e);
                                    }}
                                />
                                <InputError
                                    message={errors.osd1_dampak}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
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
                            <div className="col-span-12">
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
                            <div className="col-span-4">
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
                        </div>
                    </div>
                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Pengendalian Yang Sudah Ada (Wajib di input setelah
                            ada pengendalian)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel
                                    for="pengendalian_risiko"
                                    value="Pengendalian Risiko yang Sudah Ada"
                                />
                                <TextAreaInput
                                    id="pengendalian_risiko"
                                    value={data.pengendalian_risiko}
                                    handleChange={(e) =>
                                        setData(
                                            "pengendalian_risiko",
                                            e.target.value
                                        )
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
                            <div className="col-span-6 my-6">
                                <InputLabel
                                    for="Efektif/Kurang Efektif"
                                    value="Efektif/Kurang Efektif"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.efektif}
                                    selected={selectedEfektif}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["efektif_id"]: e.id,
                                        });
                                        setSelectedEfektif(e);
                                    }}
                                />
                                <InputError
                                    message={errors.efektif_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="pengendalian_risiko"
                                    value="Pengendalian yang Harus Ada"
                                />
                                <TextAreaInput
                                    id="pengendalian_risiko"
                                    value={data.pengendalian_risiko}
                                    handleChange={(e) =>
                                        setData(
                                            "pengendalian_risiko",
                                            e.target.value
                                        )
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
                        </div>
                    </div>
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
