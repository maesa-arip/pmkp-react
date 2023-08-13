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
                <div className="col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Data Risiko
                        </label>
                        <div className="grid grid-cols-12 gap-6">
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
                        </div>
                    </div>

                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            OSD Residual (Wajib di input setelah ada
                            pengendalian)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel for="Dampak" value="Dampak" />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.impactValues}
                                    selected={selectedImpact2}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["osd2_dampak"]: e.id,
                                        });
                                        setSelectedImpact2(e);
                                    }}
                                />
                                <InputError
                                    message={errors.osd2_dampak}
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
                            <div className="col-span-12">
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
                            <div className="col-span-12">
                                <InputLabel
                                    for="Yang Belum Tertangani"
                                    value="Yang Belum Tertangani"
                                />
                                <TextAreaInput
                                    id="belum_tertangani"
                                    value={data.belum_tertangani}
                                    handleChange={(e) =>
                                        setData(
                                            "belum_tertangani",
                                            e.target.value
                                        )
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
                                        setData(
                                            "usulan_perbaikan",
                                            e.target.value
                                        )
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
                                <InputLabel for="Realisasi" value="Realisasi" />
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
                                <InputLabel for="Output" value="Output" />
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
                            {/* <Tooltip message={"✨ Coming soon!"}>
                                <button>Subscribe</button>
                            </Tooltip> */}
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
