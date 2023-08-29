import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxPageReadonly from "@/Components/ComboboxPageReadonly";
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
    const [selectedImpact2, setSelectedImpact2] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(
                (x) => x.value === model.osd2_dampak
            );
        }
        return defaultValue[0];
    });
    const [selectedProbability2, setSelectedProbability2] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(
                (x) => x.value === model.osd2_probabilitas
            );
        }
        return defaultValue[0];
    });
    const [selectedControl2, setSelectedControl2] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(
                (x) => x.value === model.osd2_controllability
            );
        }
        return defaultValue[0];
    });
    

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
                        <div className="col-span-12 p-6 my-6 border-4 rounded-lg">
                                <div className="grid grid-cols-12 gap-6">
                                    <label
                                        htmlFor=""
                                        className="block col-span-12 mb-4 text-base font-bold text-gray-700 "
                                    >
                                        Dampak dan Probabilitas akan Otomatis
                                        Terisi Setelah Melakukan FGD
                                    </label>
                            <div className="col-span-12">
                                <InputLabel for="Dampak" value="Dampak" />
                                <ComboboxPageReadonly
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
                                <ComboboxPageReadonly
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
                            </div></div>

                            {/* <div className="col-span-12">
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
                            </div> */}
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
                            <div className="col-span-12">
                                <InputLabel for="Dokumen Pendukung" value="Dokumen Pendukung" />
                                <TextAreaInput
                                    id="dokumen_pendukung"
                                    value={data.dokumen_pendukung}
                                    handleChange={(e) =>
                                        setData("dokumen_pendukung", e.target.value)
                                    }
                                    // onChange={onChange}
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.dokumen_pendukung}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="Kendala" value="Kendala" />
                                <TextAreaInput
                                    id="kendala"
                                    value={data.kendala}
                                    handleChange={(e) =>
                                        setData("kendala", e.target.value)
                                    }
                                    // onChange={onChange}
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.kendala}
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
