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
    const [dampakMode, setDampakMode] = useState("");
    const [probabilitasMode, setProbabilitasMode] = useState("");

    // Watch for changes in dampak_responden values and compute the mode
    
    useEffect(() => {
        const dampakValues = [
            data.dampak_responden1,
            data.dampak_responden2,
            data.dampak_responden3,
            data.dampak_responden4,
            data.dampak_responden5,
            data.dampak_responden6,
            data.dampak_responden7,
            data.dampak_responden8,
        ];
        const nonEmptyDampakValues = dampakValues.filter(
            (value) => value !== ""
        );
        const frequencyMap = {};
        let maxFrequency = 0;
        let modeValue = "";

        nonEmptyDampakValues.forEach((value) => {
            if (!isNaN(value)) {
                if (!frequencyMap[value]) {
                    frequencyMap[value] = 1;
                } else {
                    frequencyMap[value]++;
                }

                if (frequencyMap[value] > maxFrequency) {
                    maxFrequency = frequencyMap[value];
                    modeValue = value;
                }
            }
        });
        setDampakMode(modeValue);
        setData({
            ...data,
            ["osd1_dampak"]: modeValue
        });
    }, [
        data.dampak_responden1,
        data.dampak_responden2,
        data.dampak_responden3,
        data.dampak_responden4,
        data.dampak_responden5,
        data.dampak_responden6,
        data.dampak_responden7,
        data.dampak_responden8,
    ]);

    // Watch for changes in probabilitas_responden values and compute the mode
    useEffect(() => {
        const probabilitasValues = [
            data.probabilitas_responden1,
            data.probabilitas_responden2,
            data.probabilitas_responden3,
            data.probabilitas_responden4,
            data.probabilitas_responden5,
            data.probabilitas_responden6,
            data.probabilitas_responden7,
            data.probabilitas_responden8,
        ];
        const nonEmptyProbabilitasValues = probabilitasValues.filter(
            (value) => value !== ""
        );
        const frequencyMap = {};
        let maxFrequency = 0;
        let modeValue = "";

        nonEmptyProbabilitasValues.forEach((value) => {
            if (!isNaN(value)) {
                if (!frequencyMap[value]) {
                    frequencyMap[value] = 1;
                } else {
                    frequencyMap[value]++;
                }
                if (frequencyMap[value] > maxFrequency) {
                    maxFrequency = frequencyMap[value];
                    modeValue = value;
                }
            }
        });
        setProbabilitasMode(modeValue);
        setData({
            ...data,
            ["osd1_probabilitas"]: modeValue
        });
    }, [
        data.probabilitas_responden1,
        data.probabilitas_responden2,
        data.probabilitas_responden3,
        data.probabilitas_responden4,
        data.probabilitas_responden5,
        data.probabilitas_responden6,
        data.probabilitas_responden7,
        data.probabilitas_responden8,
    ]);
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
                            FGD Treated
                        </label>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-6 p-6 my-6 border-4 rounded-lg">
                                <label
                                    htmlFor=""
                                    className="block mb-4 text-lg font-bold text-gray-700"
                                >
                                    Dampak
                                </label>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="dampak_responden1" value="Responden 1" />
                                    <TextInput
                                        id="dampak_responden1"
                                        value={data.dampak_responden1}
                                        handleChange={(e) =>
                                            setData("dampak_responden1", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.dampak_responden1}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="dampak_responden2" value="Responden 2" />
                                    <TextInput
                                        id="dampak_responden2"
                                        value={data.dampak_responden2}
                                        handleChange={(e) =>
                                            setData("dampak_responden2", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.dampak_responden2}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 3"
                                        type="number"
                                        id="dampak_responden3"
                                        name="dampak_responden3"
                                        value={data.dampak_responden3}
                                        handleChange={(e) =>
                                            setData(
                                                "dampak_responden3",
                                                e.target.value
                                            )
                                        }
                                        message={errors.dampak_responden3}
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="dampak_responden4" value="Responden 4" />
                                    <TextInput
                                        id="dampak_responden4"
                                        value={data.dampak_responden4}
                                        handleChange={(e) =>
                                            setData("dampak_responden4", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.dampak_responden4}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="dampak_responden5" value="Responden 5" />
                                    <TextInput
                                        id="dampak_responden5"
                                        value={data.dampak_responden5}
                                        handleChange={(e) =>
                                            setData("dampak_responden5", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.dampak_responden5}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 6"
                                        type="number"
                                        id="dampak_responden6"
                                        name="dampak_responden6"
                                        value={data.dampak_responden6}
                                        handleChange={(e) =>
                                            setData(
                                                "dampak_responden6",
                                                e.target.value
                                            )
                                        }
                                        message={errors.dampak_responden6}
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="dampak_responden7" value="Responden 7" />
                                    <TextInput
                                        id="dampak_responden7"
                                        value={data.dampak_responden7}
                                        handleChange={(e) =>
                                            setData("dampak_responden7", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.dampak_responden7}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 8"
                                        type="number"
                                        id="dampak_responden8"
                                        name="dampak_responden8"
                                        value={data.dampak_responden8}
                                        handleChange={(e) =>
                                            setData(
                                                "dampak_responden8",
                                                e.target.value
                                            )
                                        }
                                        message={errors.dampak_responden8}
                                    />
                                </div>
                            </div>
                            <div className="col-span-6 p-6 my-6 border-4 rounded-lg">
                                <label
                                    htmlFor=""
                                    className="block mb-4 text-lg font-bold text-gray-700"
                                >
                                    Probabilitas
                                </label>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="probabilitas_responden1" value="Responden 1" />
                                    <TextInput
                                        id="probabilitas_responden1"
                                        value={data.probabilitas_responden1}
                                        handleChange={(e) =>
                                            setData("probabilitas_responden1", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.probabilitas_responden1}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="probabilitas_responden2" value="Responden 2" />
                                    <TextInput
                                        id="probabilitas_responden2"
                                        value={data.probabilitas_responden2}
                                        handleChange={(e) =>
                                            setData("probabilitas_responden2", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.probabilitas_responden2}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 3"
                                        type="number"
                                        id="probabilitas_responden3"
                                        name="probabilitas_responden3"
                                        value={data.probabilitas_responden3}
                                        handleChange={(e) =>
                                            setData(
                                                "probabilitas_responden3",
                                                e.target.value
                                            )
                                        }
                                        message={errors.probabilitas_responden3}
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="probabilitas_responden4" value="Responden 4" />
                                    <TextInput
                                        id="probabilitas_responden4"
                                        value={data.probabilitas_responden4}
                                        handleChange={(e) =>
                                            setData("probabilitas_responden4", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.probabilitas_responden4}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="probabilitas_responden5" value="Responden 5" />
                                    <TextInput
                                        id="probabilitas_responden5"
                                        value={data.probabilitas_responden5}
                                        handleChange={(e) =>
                                            setData("probabilitas_responden5", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.probabilitas_responden5}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 6"
                                        type="number"
                                        id="probabilitas_responden6"
                                        name="probabilitas_responden6"
                                        value={data.probabilitas_responden6}
                                        handleChange={(e) =>
                                            setData(
                                                "probabilitas_responden6",
                                                e.target.value
                                            )
                                        }
                                        message={errors.probabilitas_responden6}
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <InputLabel for="probabilitas_responden7" value="Responden 7" />
                                    <TextInput
                                        id="probabilitas_responden7"
                                        value={data.probabilitas_responden7}
                                        handleChange={(e) =>
                                            setData("probabilitas_responden7", e.target.value)
                                        }
                                        readOnly={false}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.probabilitas_responden7}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-6 py-2">
                                    <TextInputWithError
                                        label="Responden 8"
                                        type="number"
                                        id="probabilitas_responden8"
                                        name="probabilitas_responden8"
                                        value={data.probabilitas_responden8}
                                        handleChange={(e) =>
                                            setData(
                                                "probabilitas_responden8",
                                                e.target.value
                                            )
                                        }
                                        message={errors.probabilitas_responden8}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 p-6 my-6 border-4 rounded-lg">
                                <label
                                    htmlFor=""
                                    className="block mb-4 text-lg font-bold text-gray-700"
                                >
                                    Modus Dampak
                                </label>
                                <div className="col-span-6 py-2">
                                    <InputLabel
                                        for="osd1_dampak"
                                        value="Modus Dampak"
                                    />
                                    <TextInput
                                        id="osd1_dampak"
                                        value={dampakMode}
                                        
                                        readOnly={true}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.osd1_dampak}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="col-span-6 p-6 my-6 border-4 rounded-lg">
                                <label
                                    htmlFor=""
                                    className="block mb-4 text-lg font-bold text-gray-700"
                                >
                                    Modus Probabilitas
                                </label>
                                <div className="col-span-6 py-2">
                                    <InputLabel
                                        for="osd1_probabilitas"
                                        value="Modus Probabilitas"
                                    />
                                    <TextInput
                                        id="osd1_probabilitas"
                                        value={probabilitasMode}
                                        readOnly={true}
                                        type="number"
                                        className="block w-full mt-1"
                                    />
                                    <InputError
                                        message={errors.osd1_probabilitas}
                                        className="mt-2"
                                    />
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
