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

    const [roless, setRoless] = useState([]);
    const updateFieldChanged = (index) => (e) => {
        if (e === true) {
            roless.push(index);
            setData({ ...data, roless });
        } else {
            const abc = roless.indexOf(index);
            if (abc > -1) {
                roless.splice(abc, 1);
                setData({ ...data, roless });
            }
        }
    };

    const [rolessEdit, setRolessEdit] = useState(model ? model.roles : []);
    const updateFieldChangedEdit = (index) => (e) => {
        if (e === true) {
            rolessEdit.push(index);
            setData({ ...data, rolessEdit });
        } else {
            const abc = rolessEdit.indexOf(index);
            if (abc > -1) {
                rolessEdit.splice(abc, 1);
                setData({ ...data, rolessEdit });
            }
        }
    };
    

    const [selectedValues, setSelectedValues] = useState([]);
    useEffect(() => {
        const valuesFromDB = model ? model.roles : [];
        setSelectedValues(valuesFromDB);
    }, []);
    const handleChange = (value) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter((v) => v !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
    };

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
                    {model
                        ? roles.map((role, i) => (
                              <div
                                  className="flex justify-between col-span-2 px-3 py-4 border rounded-md"
                                  key={role.id}
                              >
                                  <InputLabel
                                      className={"uppercase"}
                                      for={role.name}
                                      value={role.name}
                                  />
                                  <div className="flex flex-col items-start">
                                      <input
                                          type="checkbox"
                                          name="roless[]"
                                          value={role.id}
                                          checked={selectedValues.find(
                                              (val) => val.id === role.id
                                          )}
                                          onChange={(event) =>
                                            handleChange(event.target.value)
                                            // console.log(event.target.value)
                                        }
                                      />
                                  </div>
                              </div>
                          ))
                        : roles.map((role, i) => (
                              <div
                                  className="flex justify-between col-span-2 px-3 py-4 border rounded-md"
                                  key={role.id}
                              >
                                  <InputLabel
                                      className={"uppercase"}
                                      for={role.name}
                                      value={role.name}
                                  />
                                  <div className="flex flex-col items-start">
                                      <MyToggle
                                          name="roles[]"
                                          value={role.id}
                                          checked={true}
                                          onChange={updateFieldChanged(role.id)}
                                      />
                                  </div>
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
