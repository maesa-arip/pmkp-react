import ComboboxPage from "@/Components/ComboboxPage";
import ComboboxPageIndikatorMutu from "@/Components/ComboboxPageIndikatorMutu";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";

export default function Form({
    errors,
    submit,
    data,
    setData,
    model,
    ShouldMap,
    closeButton,
}) {
    // console.log(ShouldMap)
    // const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });
    const defaultValue = [{ name: "" }];
    const [selectedIndikatorBaru, setSelectedIndikatorBaru] = useState(() => {
        if (model) {
            return ShouldMap.IndikatorBaru.find(
                (x) => x.id === model.IndikatorBaru
            );
        }
        return defaultValue[0];
    });

    const [selectedIndikator, setSelectedIndikator] = useState(() => {
        if (model) {
            return ShouldMap.MutuIndikator.find(
                (x) => x.id === model.mutu_indikator_id
            );
        }
        return defaultValue[0];
    });
    const formatDate = {
        year: 'numeric',
        month: 'long',
      };
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">

                    

                    <div className="col-span-12">
                        <InputLabel for="Indikator" value="Indikator" />
                        <ComboboxPageIndikatorMutu
                            ShouldMap={ShouldMap.MutuIndikator}
                            selected={selectedIndikator}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["mutu_indikator_id"]: e.id,
                                });
                                setSelectedIndikator(e);
                            }}
                        />
                        <InputError
                            message={errors.mutu_indikator_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Tanggal"
                            value="Bulan dan Tahun"
                        />
                        <ReactDatePicker
                            dateFormat="MMMM yyyy"
                            value={data.tanggal_mutu}
                            showMonthYearPicker
                            id="tanggal_mutu"
                            name="tanggal_mutu"
                            autoComplete="off"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(date) => {
                                const d = new Date(date).toLocaleDateString(
                                    "en-CA", formatDate
                                );
                                setData("tanggal_mutu", d);
                            }}
                        />
                        <InputError
                            message={errors.tanggal_mutu}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="num" value="NUM" />
                        <TextInput
                            id="num"
                            value={data.num}
                            handleChange={(e) =>
                                setData("num", e.target.value)
                            }
                            // onChange={onChange}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.num}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="denum" value="DENUM" />
                        <TextInput
                            id="denum"
                            value={data.denum}
                            handleChange={(e) =>
                                setData("denum", e.target.value)
                            }
                            // onChange={onChange}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.denum}
                            className="mt-2"
                        />
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
