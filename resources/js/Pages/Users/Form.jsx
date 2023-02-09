import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import MyToggle from "@/Components/MyToggle";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { set } from "lodash";
import React, { useEffect, useState } from "react";

export default function Form({
    errors,
    roles,
    submit,
    data,
    setData,
    model,
    closeButton,
}) {
    const onChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const [checkedState, setCheckedState] = useState(
        new Array(roles.length).fill(false)
    );
    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );
    }

    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
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
                    <div className="col-span-6 sm:col-span-3">
                        <InputLabel for="email" value="Email" />
                        <TextInput
                            id="email"
                            value={data.email}
                            handleChange={(e) =>
                                setData("email", e.target.value)
                            }
                            // handleChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    {/* {roles.map(({ role, i }, index) => { */}
                    {roles.map((role, i) => (
                              <div
                              key={
                                  role.id
                              }
                              className="flex items-center justify-between px-3 py-4 rounded-md shadow"
                          >
                              {role.name}
                              <label
                                  htmlFor={
                                      role.name
                                  }
                                  className="relative inline-flex items-center cursor-pointer"
                              >
                                  <input
                                      key={
                                          role.id
                                      }
                                      value={role.id}
                                      checked={checkedState[role.id]}
                                      onChange={() => handleOnChange(role.id)}
                                      type="checkbox"
                                      id={
                                          role.name
                                      }
                                      name={
                                          role.name
                                      }
                                      className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-600  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 peer-after:ring-indigo-500" />
                              </label>
                          </div>
))}

                    
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
