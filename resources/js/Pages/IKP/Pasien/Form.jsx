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
import ComboboxPageKeterangan from "@/Components/ComboboxPageKeterangan";
import Inputs from "./Inputs";
import { IconTrash } from "@tabler/icons";
import { useEffect } from "react";
import ThirdButton from "@/Components/ThirdButton";
import { Fragment } from "react";

export default function Form({
    errors,
    submit,
    data,
    setData,
    closeButton,
    ShouldMap,
    model,
}) {
    // console.log(model)
    const [tglPelayanan, setTglPelayanan] = useState(null);
    const defaultValue = [{ name: "" }];
    const picIdStrings = data.pic_id ? data.pic_id : ",";
    const picIdString = picIdStrings.replace(/['"]+/g, "");
    const defaultPicIds = picIdString.split(",");
    const defaultPicIdStrings = defaultPicIds.map((value) => value.toString());
    const [selectedPenanggung, setSelectedPenanggung] = useState(() => {
        if (model) {
            return ShouldMap.IkpPenanggung.find(
                (x) => x.id === model.ikp_penanggung_id
            );
        }
        return defaultValue[0];
    });
    const [selectedJenisKelamin, setSelectedJenisKelamin] = useState(() => {
        if (model) {
            return ShouldMap.JenisKelamin.find(
                (x) => x.id === model.jeniskelamin
            );
        }
        return defaultValue[0];
    });
    const [selectedPelapor, setSelectedPelapor] = useState(() => {
        if (model) {
            return ShouldMap.IkpPelapor.find(
                (x) => x.id === model.ikp_pelapor_id
            );
        }
        return defaultValue[0];
    });
    const [selectedGrupLayanan, setSelectedGrupLayanan] = useState(() => {
        if (model) {
            return ShouldMap.IkpGrupLayanan.find(
                (x) => x.id === model.ikp_gruplayanan_id
            );
        }
        return defaultValue[0];
    });
    const [selectedJenisInsiden, setSelectedJenisInsiden] = useState(() => {
        if (model) {
            return ShouldMap.IkpJenisInsiden.find(
                (x) => x.id === model.ikp_jenis_insiden_id
            );
        }
        return defaultValue[0];
    });
    const [selectedTipeInsiden, setSelectedTipeInsiden] = useState(() => {
        if (model) {
            return ShouldMap.IkpTipeInsiden.find(
                (x) => x.id === model.ikp_tipe_insiden_id
            );
        }
        return defaultValue[0];
    });
    const [selectedLokasi, setSelectedLokasi] = useState(() => {
        if (model) {
            return ShouldMap.IkpLokasi.find(
                (x) => x.id === model.ikp_lokasi_id
            );
        }
        return defaultValue[0];
    });
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState(() => {
        if (model) {
            return ShouldMap.IkpSpesialisasi.find(
                (x) => x.id === model.ikp_spesialisasi_id
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
    const [selectedIkpPenindak, setSelectedIkpPenindak] = useState(() => {
        if (model) {
            return ShouldMap.IkpPenindak.find(
                (x) => x.id === model.ikp_penindak_id
            );
        }
        return defaultValue[0];
    });
    const [selectedIkpTerjadiTempatLain, setSelectedIkpTerjadiTempatLain] =
        useState(() => {
            if (model) {
                return ShouldMap.IkpTerjadiTempatLain.find(
                    (x) => x.id === model.terjadi_tempatlain
                );
            }
            return defaultValue[0];
        });
    
    const [inputFields, setInputFields] = useState(model?.kronologis ?? [{ waktu: "", kronologi: "" }]);
    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
    };
    const addFields = (e) => {
        e.preventDefault();
        let newfield = { waktu: "", kronologi: "" };
        setInputFields([...inputFields, newfield]);
    };
    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1);
        setInputFields(data);
    };
    useEffect(() => {
        setData({ ...data, ["kronologis"]: inputFields });
    }, [inputFields]);
    // console.log(inputFields)
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700 "
                        >
                            Data Pasien (Wajib di Input)
                        </label>
                        {/* <Inputs/> */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6">
                                <InputLabel
                                    for="namapasien"
                                    value="Nama Pasien"
                                />
                                <TextInput
                                    id="namapasien"
                                    value={data.namapasien}
                                    handleChange={(e) =>
                                        setData("namapasien", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.namapasien}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel for="nrm" value="NRM" />
                                <TextInput
                                    id="nrm"
                                    value={data.nrm}
                                    handleChange={(e) =>
                                        setData("nrm", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.nrm}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-2">
                                <InputLabel for="umur_tahun" value="Umur" />
                                <TextInput
                                    id="umur_tahun"
                                    value={data.umur_tahun}
                                    placeholder="Tahun"
                                    handleChange={(e) =>
                                        setData("umur_tahun", e.target.value)
                                    }
                                    type="number"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.umur_tahun}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-2">
                                <InputLabel for="umur_bulan" value="-" />
                                <TextInput
                                    id="umur_bulan"
                                    value={data.umur_bulan}
                                    placeholder="Bulan"
                                    handleChange={(e) =>
                                        setData("umur_bulan", e.target.value)
                                    }
                                    type="number"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.umur_bulan}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-2">
                                <InputLabel for="umur_hari" value="-" />
                                <TextInput
                                    id="umur_hari"
                                    value={data.umur_hari}
                                    placeholder="Hari"
                                    handleChange={(e) =>
                                        setData("umur_hari", e.target.value)
                                    }
                                    type="number"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.umur_hari}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpPenanggung"
                                    value="Penanggung Biaya Pasien"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpPenanggung}
                                    selected={selectedPenanggung}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_penanggung_id"]: e.id,
                                        });
                                        setSelectedPenanggung(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_penanggung_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="JenisKelamin"
                                    value="Jenis Kelamin"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.JenisKelamin}
                                    selected={selectedJenisKelamin}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["jeniskelamin"]: e.id,
                                        });
                                        setSelectedJenisKelamin(e);
                                    }}
                                />
                                <InputError
                                    message={errors.jeniskelamin}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="TanggalPelayanan"
                                    value="Tanggal Masuk RS"
                                />
                                <TextInput
                                    id="tanggal_pelayanan"
                                    value={data.tanggal_pelayanan}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_pelayanan",
                                            e.target.value
                                        )
                                    }
                                    type="datetime-local"
                                    className="block w-full mt-1"
                                />

                                <InputError
                                    message={errors.tanggal_pelayanan}
                                    className="mt-2"
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
                            Rincian Kejadian (Wajib di Input)
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6">
                                <InputLabel
                                    for="tanggal_insiden"
                                    value="Tanggal dan Waktu Insiden"
                                />
                                <TextInput
                                    id="tanggal_insiden"
                                    value={data.tanggal_insiden}
                                    handleChange={(e) =>
                                        setData(
                                            "tanggal_insiden",
                                            e.target.value
                                        )
                                    }
                                    type="datetime-local"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tanggal_insiden}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpPelapor"
                                    value="Orang Pertama Yang Melaporkan Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpPelapor}
                                    selected={selectedPelapor}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_pelapor_id"]: e.id,
                                        });
                                        setSelectedPelapor(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_pelapor_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel for="insiden" value="Insiden" />
                                <TextInput
                                    id="insiden"
                                    value={data.insiden}
                                    handleChange={(e) =>
                                        setData("insiden", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.insiden}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpGrupLayanan"
                                    value="Insiden menyangkut pasien"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpGrupLayanan}
                                    selected={selectedGrupLayanan}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_gruplayanan_id"]: e.id,
                                        });
                                        setSelectedGrupLayanan(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_gruplayanan_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12 px-4 py-6 my-6 border-2 border-yellow-200 rounded-lg ">
                                <label
                                    htmlFor=""
                                    className="block mb-4 text-lg font-bold text-gray-700 "
                                >
                                    Kronologi
                                </label>
                                <div className="grid grid-cols-12 gap-2">
                                    {inputFields.map((input, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <div className="col-span-2">
                                                    <InputLabel
                                                        for="waktu"
                                                        value="Waktu"
                                                    />
                                                    <input
                                                        required
                                                        type="datetime-local"
                                                        name="waktu"
                                                        value={input.waktu}
                                                        autoComplete="off"
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        onChange={(event) =>
                                                            handleFormChange(
                                                                index,
                                                                event
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col-span-9">
                                                    <InputLabel
                                                        for="kronologi"
                                                        value="Kronologis Insiden"
                                                    />
                                                    <textarea
                                                        required
                                                        name="kronologi"
                                                        value={input.kronologi}
                                                        rows={5}
                                                        autoComplete="off"
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        onChange={(event) =>
                                                            handleFormChange(
                                                                index,
                                                                event
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {inputFields.length !== 1 && (
                                                <div className="col-span-1">
                                                    <ThirdButton
                                                        type={"button"}
                                                        color="red"
                                                        className="mt-6"
                                                        onClick={() =>
                                                            removeFields(index)
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-5 h-5 icon icon-tabler icon-tabler-trash"
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2}
                                                            stroke="currentColor"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                            />
                                                            <path d="M4 7l16 0" />
                                                            <path d="M10 11l0 6" />
                                                            <path d="M14 11l0 6" />
                                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                        </svg>
                                                    </ThirdButton>
                                                </div>)}
                                            </Fragment>
                                        );
                                    })}
                                    <div className="col-span-12">
                                        <ThirdButton onClick={addFields}>
                                            Tambah
                                        </ThirdButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpJenisInsiden"
                                    value="Jenis Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpJenisInsiden}
                                    selected={selectedJenisInsiden}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_jenis_insiden_id"]: e.id,
                                        });
                                        setSelectedJenisInsiden(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_jenis_insiden_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpTipeInsiden"
                                    value="Tipe Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpTipeInsiden}
                                    selected={selectedTipeInsiden}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_tipe_insiden_id"]: e.id,
                                        });
                                        setSelectedTipeInsiden(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_tipe_insiden_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpSpesialisasi"
                                    value="Insiden Terjadi Pada Pasien"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpSpesialisasi}
                                    selected={selectedSpesialisasi}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_spesialisasi_id"]: e.id,
                                        });
                                        setSelectedSpesialisasi(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_spesialisasi_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="IkpLokasi"
                                    value="Tempat Insiden"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpLokasi}
                                    selected={selectedLokasi}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_lokasi_id"]: e.id,
                                        });
                                        setSelectedLokasi(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_lokasi_id}
                                    className="mt-2"
                                />
                            </div>
                            {data.ikp_lokasi_id ? (
                                <>
                                    <div className="col-span-6"></div>
                                    <div className="col-span-6">
                                        <InputLabel
                                            for="lokasi_name"
                                            value="Lokasi Detail Kejadian IKP"
                                        />
                                        <TextInput
                                            id="lokasi_name"
                                            value={data.lokasi_name}
                                            handleChange={(e) =>
                                                setData(
                                                    "lokasi_name",
                                                    e.target.value
                                                )
                                            }
                                            type="text"
                                            className="block w-full mt-1"
                                        />
                                        <InputError
                                            message={errors.lokasi_name}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}

                            <div className="col-span-12">
                                <InputLabel
                                    for="Kategori Risiko"
                                    value="Unit Kerja Penyebab Insiden"
                                />
                                <ComboboxMultiple
                                    ShouldMap={ShouldMap.pics}
                                    name={"pic_id"}
                                    onChange={(selectedIdsString) => {
                                        setData({
                                            ...data,
                                            ["pic_id"]: selectedIdsString,
                                        });
                                    }}
                                    defaultValues={defaultPicIdStrings}
                                />
                                <InputError
                                    message={errors.pic_id}
                                    className="mt-2"
                                />
                            </div>

                            <div className="col-span-6">
                                <InputLabel
                                    for="Dampak"
                                    value="Dampak Insiden Terhadap Pasien"
                                />
                                <ComboboxPageKeterangan
                                    ShouldMap={ShouldMap.IkpDampak}
                                    selected={selectedIkpDampak}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_dampak_id"]: e.id,
                                        });
                                        setSelectedIkpDampak(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_dampak_id}
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
                                    selected={selectedIkpProbabilitas}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_probabilitas_id"]: e.id,
                                        });
                                        setSelectedIkpProbabilitas(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_probabilitas_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="tindak_lanjut_hasil"
                                    value="Tindak lanjut yang dilakukan segera setelah kejadian, dan hasilnya"
                                />
                                <TextAreaInput
                                    id="tindak_lanjut_hasil"
                                    value={data.tindak_lanjut_hasil}
                                    handleChange={(e) =>
                                        setData(
                                            "tindak_lanjut_hasil",
                                            e.target.value
                                        )
                                    }
                                    rows={5}
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tindak_lanjut_hasil}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="Penindak"
                                    value="Tindak Lanjut Dilakukan Oleh"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpPenindak}
                                    selected={selectedIkpPenindak}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["ikp_penindak_id"]: e.id,
                                        });
                                        setSelectedIkpPenindak(e);
                                    }}
                                />
                                <InputError
                                    message={errors.ikp_penindak_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel
                                    for="TerjadiTempatlain"
                                    value="Apakah kejadian insiden yang sama pernah terjadi pada Pelayanan lain ?"
                                />
                                <ComboboxPage
                                    ShouldMap={ShouldMap.IkpTerjadiTempatLain}
                                    selected={selectedIkpTerjadiTempatLain}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            ["terjadi_tempatlain"]: e.id,
                                        });
                                        setSelectedIkpTerjadiTempatLain(e);
                                    }}
                                />
                                <InputError
                                    message={errors.terjadi_tempatlain}
                                    className="mt-2"
                                />
                            </div>
                            {data.terjadi_tempatlain == 1 ? (
                                <div className="col-span-12">
                                    <InputLabel
                                        for="langkah_tempatlain"
                                        value="Langkah/tindakan apa yang telah diambil pada pelayanan tersebut untuk mencegah terulangnya kejadian yang sama?"
                                    />
                                    <TextAreaInput
                                        id="langkah_tempatlain"
                                        value={data.langkah_tempatlain}
                                        handleChange={(e) =>
                                            setData(
                                                "langkah_tempatlain",
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        type="text"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.langkah_tempatlain}
                                        className="mt-2"
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
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
