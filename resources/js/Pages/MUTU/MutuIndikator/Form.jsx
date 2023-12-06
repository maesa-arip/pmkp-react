import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";

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
    const [selectedIndikatorBaru, setSelectedIndikatorBaru] = useState(
        () => {
            if (model) {
                return ShouldMap.IndikatorBaru?.find(
                    (x) => x.id === model.IndikatorBaru
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedOperator, setSelectedOperator] = useState(
        () => {
            if (model) {
                return ShouldMap.Operator.find(
                    (x) => x.id === model.operator
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedIndikatorFitur4, setSelectedIndikatorFitur4] = useState(
        () => {
            if (model) {
                return ShouldMap.IndikatorFitur4.find(
                    (x) => x.id === model.indikator_fitur4_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedKategori, setSelectedKategori] = useState(() => {
        if (model) {
            return ShouldMap.MutuKategori.find(
                (x) => x.id === model.mutu_kategori_id
            );
        }
        return defaultValue[0];
    });
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                <div className="col-span-2">
                        <InputLabel for="IndikatorBaru" value="Indikator Baru ?" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.IndikatorBaru}
                            selected={selectedIndikatorBaru}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["IndikatorBaru"]: e.id,
                                });
                                setSelectedIndikatorBaru(e);
                            }}
                        />
                        <InputError
                            message={errors.IndikatorBaru}
                            className="mt-2"
                        />
                    </div>
                    {data.IndikatorBaru == 1 ? <div className="col-span-10">
                        <InputLabel for="indikator" value="Masukan Indikator Baru" />
                        <TextInput
                            id="indikator"
                            value={data.indikator}
                            handleChange={(e) =>
                                setData("indikator", e.target.value)
                            }
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.indikator} className="mt-2" />
                    </div> : <div className="col-span-10">
                        <InputLabel for="Indikator" value="Pilih Indikator" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.IndikatorFitur4}
                            selected={selectedIndikatorFitur4}
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
                    </div>}
                    
                    
                    
                    <div className="col-span-12">
                        <InputLabel for="Kategori" value="Kategori" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.MutuKategori}
                            selected={selectedKategori}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["mutu_kategori_id"]: e.id,
                                });
                                setSelectedKategori(e);
                            }}
                        />
                        <InputError
                            message={errors.mutu_kategori_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="num_name" value="NUM" />
                        <TextInput
                            id="num_name"
                            value={data.num_name}
                            handleChange={(e) =>
                                setData("num_name", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.num_name}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="denum_name" value="DENUM" />
                        <TextInput
                            id="denum_name"
                            value={data.denum_name}
                            handleChange={(e) =>
                                setData("denum_name", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.denum_name}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-2">
                        <InputLabel for="Operator" value="Pilih Operator" />
                        <ComboboxPage
                            ShouldMap={ShouldMap.Operator}
                            selected={selectedOperator}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["operator"]: e.id,
                                });
                                setSelectedOperator(e);
                            }}
                        />
                        <InputError
                            message={errors.operator}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-10">
                        <InputLabel for="standar" value="Standar" />
                        <TextInput
                            id="standar"
                            value={data.standar}
                            handleChange={(e) =>
                                setData("standar", e.target.value)
                            }
                            // onChange={onChange}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.standar} className="mt-2" />
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
