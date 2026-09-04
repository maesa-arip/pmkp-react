import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React from "react";

export default function Form({ errors, submit, data, setData, closeButton }) {
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-8">
                        <InputLabel for="name" value="Nama Penyebut / Satuan" />
                        <TextInput
                            id="name"
                            value={data.name}
                            handleChange={(e) => setData("name", e.target.value)}
                            type="text"
                            className="block w-full mt-1"
                            placeholder="Contoh: menit, angka bulat, %, ‰"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                        <InputLabel for="multiplier" value="Pengali Hitung" />
                        <TextInput
                            id="multiplier"
                            value={data.multiplier}
                            handleChange={(e) => setData("multiplier", e.target.value)}
                            type="number"
                            className="block w-full mt-1"
                            step="0.01"
                            min="0"
                            placeholder="1"
                        />
                        <InputError message={errors.multiplier} className="mt-2" />
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
