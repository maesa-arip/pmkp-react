import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ListBoxPage from "@/Components/ListBoxPage";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useState } from "react";

export default function Form({ errors, submit, data, setData, ShouldMap, closeButton }) {
    const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });
    const defaultValue = [{ name: "Pilih" }];
    const [selected, setSelected] = useState(defaultValue[0]);
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="name" value="Nama" />
                        <TextInput
                            id="name"
                            value={data.name}
                            handleChange={(e) =>
                                setData("name", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    {/* <div className="col-span-12 sm:col-span-12">
                        <InputLabel for="description" value="Keterangan" />
                        <TextAreaInput
                            id="description"
                            value={data.description}
                            handleChange={(e) =>
                                setData("description", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div> */}
                    <div className="col-span-6 sm:col-span-6 lg:col-span-5">
                        <InputLabel for="location" value="Lokasi" />
                        <ListBoxPage
                            ShouldMap={ShouldMap}
                            selected={selected}
                            // onChange={(e) => {
                            //     onChangePlanCategoryId(e);
                            //     setSelected(e);
                            // }}
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
                    Batal123
                </SecondaryButton>
            </div>
        </>
    );
}
