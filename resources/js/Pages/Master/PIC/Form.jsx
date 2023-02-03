import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ListBoxPage from "@/Components/ListBoxPage";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";

export default function Form({
    errors,
    submit,
    data,
    setData,
    ShouldMap,
    model,
    closeButton,
}) {
    const onChangeLocationId = (e) => {
        setData({ ...data, ["location_id"]: e.id });
    };
    const defaultValue = [{ name: "Pilih" }];
    const [selected, setSelected] = useState(() => {
        if (model) {
            return ShouldMap[model.location_id - 1];
        }
        return defaultValue[0];
    });
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <InputLabel for="name" value="Nama" />
                        <TextInput
                            id="name"
                            value={data.name}
                            handleChange={(e) =>
                                setData("name", e.target.value)
                            }
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="col-span-12">
                        <InputLabel for="location" value="Lokasi" />
                        <ListBoxPage
                            ShouldMap={ShouldMap}
                            selected={selected}
                            onChange={(e) => {
                                onChangeLocationId(e);
                                setSelected(e);
                            }}
                        />
                        <InputError
                            message={errors.location_id}
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
