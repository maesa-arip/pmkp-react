import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import ComboboxMultiple from "@/Components/ComboboxMultiple";
import ComboboxPageReadonly from "@/Components/ComboboxPageReadonly";

export default function Form({
    errors,
    submit,
    data,
    setData,
    closeButton,
    ShouldMap,
    model,
}) {
    const [tglPelayanan, setTglPelayanan] = useState(null);
    const defaultValue = [{ name: "" }];
    const picIdStrings = data.pic_id ? data.pic_id : ",";
    const picIdString = picIdStrings.replace(/['"]+/g, "");
    const defaultPicIds = picIdString.split(",");
    const defaultPicIdStrings = defaultPicIds.map((value) => value.toString());

    const [selectedVerifikasi, setSelectedVerifikasi] = useState(() => {
        if (model) {
            return ShouldMap.IkpInvestigasiLengkap.find(
                (x) => x.id === model.ikp_hasil?.verifikasi
            );
        }
        return defaultValue[0];
    });
    const [selectedInvestigasiLengkap, setSelectedInvestigasiLengkap] = useState(() => {
        if (model) {
            return ShouldMap.IkpInvestigasiLengkap.find(
                (x) => x.id === model.ikp_hasil?.investigasi_lengkap
            );
        }
        return defaultValue[0];
    });
    const [selectedInvestigasiLanjut, setSelectedInvestigasiLanjut] = useState(() => {
        if (model) {
            return ShouldMap.IkpInvestigasiLanjut.find(
                (x) => x.id === model.ikp_hasil?.investigasi_lanjut
            );
        }
        return defaultValue[0];
    });
    const [selectedIkpDampak, setSelectedIkpDampak] = useState(() => {
        if (model) {
            return ShouldMap.IkpDampak.find(
                (x) => x.id === model.ikp_dampak_id
            );
        }
        return defaultValue[0];
    });
    const [selectedIkpProbabilitas, setSelectedIkpProbabilitas] = useState(
        () => {
            if (model) {
                return ShouldMap.IkpProbabilitas.find(
                    (x) => x.id === model.ikp_probabilitas_id
                );
            }
            return defaultValue[0];
        }
    );

    const [selectedIkpDampak2, setSelectedIkpDampak2] = useState(() => {
        if (model) {
            return ShouldMap.IkpDampak.find(
                (x) => x.id === model.ikp_hasil?.ikp_dampak2_id
            );
        }
        return defaultValue[0];
    });
    const [selectedIkpProbabilitas2, setSelectedIkpProbabilitas2] = useState(
        () => {
            if (model) {
                return ShouldMap.IkpProbabilitas.find(
                    (x) => x.id === model.ikp_hasil?.ikp_probabilitas2_id
                );
            }
            return defaultValue[0];
        }
    );


    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Data IKP
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6">
                                <InputLabel
                                    for="Dampak"
                                    value="Dampak Insiden Terhadap Pasien"
                                />
                                <ComboboxPageReadonly
                                    ShouldMap={ShouldMap.IkpDampak}
                                    selected={selectedIkpDampak}
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="Probabilitas"
                                    value="Probabilitas"
                                />
                                <ComboboxPageReadonly
                                    ShouldMap={ShouldMap.IkpProbabilitas}
                                    selected={selectedIkpProbabilitas}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Hasil Investigasi (Wajib di Input)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel
                                    for="penyebab"
                                    value="Penyebab Langsung Insiden :"
                                />
                                <TextAreaInput
                                    id="penyebab"
                                    value={data.penyebab}
                                    handleChange={(e) =>
                                        setData("penyebab", e.target.value)
                                    }
                                    rows={5}
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.penyebab}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="akarmasalah"
                                    value="Penyebab yang melatar belakangi/akar masalah insiden :"
                                />
                                <TextAreaInput
                                    id="akarmasalah"
                                    value={data.akarmasalah}
                                    handleChange={(e) =>
                                        setData("akarmasalah", e.target.value)
                                    }
                                    rows={5}
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.akarmasalah}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-4">
                                <InputLabel
                                    for="rekomendasi"
                                    value="Rekomendasi"
                                />
                                <TextInput
                                    id="rekomendasi"
                                    value={data.rekomendasi}
                                    handleChange={(e) =>
                                        setData("rekomendasi", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.rekomendasi}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-4">
                                <InputLabel
                                    for="pj1"
                                    value="Penanggung Jawab"
                                />
                                <TextInput
                                    id="pj1"
                                    value={data.pj1}
                                    handleChange={(e) =>
                                        setData("pj1", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.pj1}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-4">
                                <InputLabel
                                    for="tanggal_rekomendasi"
                                    value="Tanggal"
                                />
                                <TextInput
                                    id="tanggal_rekomendasi"
                                    value={data.tanggal_rekomendasi}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_rekomendasi",
                                            e.target.value
                                        )
                                    }
                                    type="date"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tanggal_rekomendasi}
                                    className="mt-2"
                                />
                            </div>

                            <div className="col-span-4">
                                <InputLabel
                                    for="tindakan"
                                    value="Tindakan yang akan dilakukan"
                                />
                                <TextInput
                                    id="tindakan"
                                    value={data.tindakan}
                                    handleChange={(e) =>
                                        setData("tindakan", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tindakan}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-4">
                                <InputLabel
                                    for="pj2"
                                    value="Penanggung Jawab"
                                />
                                <TextInput
                                    id="pj2"
                                    value={data.pj2}
                                    handleChange={(e) =>
                                        setData("pj2", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.pj2}
                                    className="mt-2"
                                />
                            </div>
                            {/* <div className="col-span-4">
                                <InputLabel
                                    for="tanggal_tindakan"
                                    value="Tanggal"
                                />
                                <TextInput
                                    id="tanggal_tindakan"
                                    value={data.tanggal_tindakan}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_tindakan",
                                            e.target.value
                                        )
                                    }
                                    type="date"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tanggal_tindakan}
                                    className="mt-2"
                                />
                            </div> */}

                            <div className="col-span-6">
                                <InputLabel
                                    for="nama"
                                    value="Nama Manajer/Kepala Bagian/Kepala Unit"
                                />
                                <TextInput
                                    id="nama"
                                    value={data.nama}
                                    handleChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.nama}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="tanggal_mulai_investigasi"
                                    value="Tanggal mulai Investigasi"
                                />
                                <TextInput
                                    id="tanggal_mulai_investigasi"
                                    value={data.tanggal_mulai_investigasi}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_mulai_investigasi",
                                            e.target.value
                                        )
                                    }
                                    type="date"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tanggal_mulai_investigasi}
                                    className="mt-2"
                                />
                            </div>

                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpVerifikasi"
                                    value="Verifikasi"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpVerifikasi}
                                    selected={selectedVerifikasi}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["verifikasi"]: e.id,
                                        });
                                        setSelectedVerifikasi(e);
                                    }}
                                />
                                <InputError
                                    message={errors.verifikasi}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="tanggal_selesaii_investigasi"
                                    value="Tanggal Selesai Investigasi"
                                />
                                <TextInput
                                    id="tanggal_selesaii_investigasi"
                                    value={data.tanggal_selesaii_investigasi}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_selesaii_investigasi",
                                            e.target.value
                                        )
                                    }
                                    type="date"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={
                                        errors.tanggal_selesaii_investigasi
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpInvestigasiLengkap"
                                    value="Investigasi lengkap:"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpInvestigasiLengkap}
                                    selected={selectedInvestigasiLengkap}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["investigasi_lengkap"]: e.id,
                                        });
                                        setSelectedInvestigasiLengkap(e);
                                    }}
                                />
                                <InputError
                                    message={errors.investigasi_lengkap}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="tanggal_investigasi"
                                    value="Tanggal Investigasi"
                                />
                                <TextInput
                                    id="tanggal_investigasi"
                                    value={data.tanggal_investigasi}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_investigasi",
                                            e.target.value
                                        )
                                    }
                                    type="date"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={
                                        errors.tanggal_investigasi
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpInvestigasiLanjut"
                                    value="Diperlukan Investigasi lebih lanjut:"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpInvestigasiLanjut}
                                    selected={selectedInvestigasiLanjut}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["investigasi_lanjut"]: e.id,
                                        });
                                        setSelectedInvestigasiLanjut(e);
                                    }}
                                />
                                <InputError
                                    message={errors.investigasi_lanjut}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6"></div>

                            <div className="col-span-6">
                                <InputLabel
                                    for="Dampak"
                                    value="Dampak Insiden Terhadap Pasien"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpDampak}
                                    selected={selectedIkpDampak2}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_dampak2_id"]: e.id,
                                        });
                                        setSelectedIkpDampak2(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_dampak2_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="Probabilitas"
                                    value="Probabilitas"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpProbabilitas}
                                    selected={selectedIkpProbabilitas2}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_probabilitas2_id"]: e.id,
                                        });
                                        setSelectedIkpProbabilitas2(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_probabilitas2_id}
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
