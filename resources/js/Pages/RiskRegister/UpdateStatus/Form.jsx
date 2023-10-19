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
import moment from "moment";
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
console.log(model.currently_id)
   

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
    }, [data.sebab, data.resiko, data.dampak]);
    const [selectedCurrently, setSelectedCurrently] = useState(() => {
        if (model) {
            return ShouldMap.currently.find((x) => x.id === model.currently_id);
        }
        return defaultValue[0];
    });
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

                    <div className="col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            Data PIC Unit Terkait
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6">
                                <InputLabel for="created_at" value="Tanggal Input" />
                                <TextInput
                                    id="created_at"
                                    readOnly={true}
                                    value={moment(
                                        data.created_at
                                    ).format("YYYY-MM-DD")}
                                   
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                
                            </div>
                            <div className="col-span-6">
                                <InputLabel for="created_at" value="Jam Input" />
                                <TextInput
                                    id="created_at"
                                    readOnly={true}
                                    value={moment(
                                        data.created_at
                                    ).format("H:MM")}
                                   
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                
                            </div>
                            <div className="col-span-6">
                                <InputLabel for="tgl_perbaikan" value="Tanggal Perbaikan" />
                                <TextInput
                                    id="tgl_perbaikan"
                                    readOnly={true}
                                    value={moment(
                                        data.tgl_perbaikan
                                    ).format("YYYY-MM-DD")}
                                    handleChange={(e) =>
                                        setData("tgl_perbaikan", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.tgl_perbaikan}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <InputLabel for="jam_perbaikan" value="Jam Perbaikan" />
                                <TextInput
                                    id="jam_perbaikan"
                                    value={data.jam_perbaikan}
                                    readOnly={true}
                                    handleChange={(e) =>
                                        setData("jam_perbaikan", e.target.value)
                                    }
                                    type="time"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.jam_perbaikan}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="upaya_pengendalian" value="Upaya Pengendalian" />
                                <TextAreaInput
                                    id="upaya_pengendalian"
                                    readOnly={true}
                                    value={data.upaya_pengendalian}
                                    handleChange={(e) =>
                                        setData("upaya_pengendalian", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.upaya_pengendalian}
                                    className="mt-2"
                                />
                            </div>

                            <div className="col-span-12 mt-6">
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
