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
                            Formulir RCA
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel for="why1" value="Why 1" />
                                <TextAreaInput
                                    id="why1"
                                    value={data.why1}
                                    handleChange={(e) =>
                                        setData("why1", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.why1}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="why2" value="Why 2" />
                                <TextAreaInput
                                    id="why2"
                                    value={data.why2}
                                    handleChange={(e) =>
                                        setData("why2", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.why2}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="why3" value="Why 3" />
                                <TextAreaInput
                                    id="why3"
                                    value={data.why3}
                                    handleChange={(e) =>
                                        setData("why3", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.why3}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="why4" value="Why 4" />
                                <TextAreaInput
                                    id="why4"
                                    value={data.why4}
                                    handleChange={(e) =>
                                        setData("why4", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.why4}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="why5" value="Why 5" />
                                <TextAreaInput
                                    id="why5"
                                    value={data.why5}
                                    handleChange={(e) =>
                                        setData("why5", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.why5}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="akar_penyebab"
                                    value="Akar Penyebab"
                                />
                                <TextAreaInput
                                    id="akar_penyebab"
                                    value={data.akar_penyebab}
                                    handleChange={(e) =>
                                        setData("akar_penyebab", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.akar_penyebab}
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
