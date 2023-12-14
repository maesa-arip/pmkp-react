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
    // console.log(data)
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* <div className="col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ">
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
                    </div> */}

                    <div className="col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ">
                        <label
                            htmlFor=""
                            className="block mb-4 text-lg font-bold text-gray-700"
                        >
                            Formulir PDSA
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <InputLabel for="problem" value="Problem" />
                                <TextAreaInput
                                    id="problem"
                                    value={data.problem}
                                    handleChange={(e) =>
                                        setData("problem", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.problem}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="step" value="STEP" />
                                <TextAreaInput
                                    id="step"
                                    value={data.step}
                                    handleChange={(e) =>
                                        setData("step", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.step}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="plan_rencana" value="Rencana" />
                                <TextAreaInput
                                    id="plan_rencana"
                                    value={data.plan_rencana}
                                    handleChange={(e) =>
                                        setData("plan_rencana", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.plan_rencana}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="plan_harapan" value="Harapan" />
                                <TextAreaInput
                                    id="plan_harapan"
                                    value={data.plan_harapan}
                                    handleChange={(e) =>
                                        setData("plan_harapan", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.plan_harapan}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel for="do" value="Do" />
                                <TextAreaInput
                                    id="do"
                                    value={data.do}
                                    handleChange={(e) =>
                                        setData("do", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.do}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="study"
                                    value="Study"
                                />
                                <TextAreaInput
                                    id="study"
                                    value={data.study}
                                    handleChange={(e) =>
                                        setData("study", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.study}
                                    className="mt-2"
                                />
                            </div>
                            <div className="col-span-12">
                                <InputLabel
                                    for="action"
                                    value="Action"
                                />
                                <TextAreaInput
                                    id="action"
                                    value={data.action}
                                    handleChange={(e) =>
                                        setData("action", e.target.value)
                                    }
                                    type="text"
                                    className="block w-full mt-1"
                                />
                                <InputError
                                    message={errors.action}
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
