import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import MyToggle from "@/Components/MyToggle";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import TextInputCheckbox from "@/Components/TextInputCheckbox";
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
    // let rolesfromdb = model ? model.roles.map((a) => a.id) : [];
    // const [roless, setRoless] = useState(rolesfromdb);
    // const updateFieldChanged = (index) => (e) => {
    //     console.log(roless);
    //     if (e === true) {
    //         roless.push(index);
    //         setData({ ...data, roless });
    //     } else {
    //         const abc = roless.indexOf(index);
    //         if (abc > -1) {
    //             roless.splice(abc, 1);
    //             setData({ ...data, roless });
    //         }
    //     }
    // };
    // const [selectedValues, setSelectedValues] = useState([]);
    // useEffect(() => {
    //     const valuesFromDB = model ? model.roles : [];
    //     setSelectedValues(valuesFromDB);
    // }, []);

    const [checkboxes, setCheckboxes] = useState([
        { id: 1, label: 'Option 1', checked: false },
        { id: 2, label: 'Option 2', checked: false },
        { id: 3, label: 'Option 3', checked: false },
      ]);
    
      const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    console.log('before:', selectedIds);
    setCheckboxes(
        checkboxes.map((checkbox) => {
          if (checkbox.id === id) {
            return { ...checkbox, checked: !checkbox.checked };
          }
          return checkbox;
        })
      );

    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
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
                    {/* {roles.map((role, i) => (
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
                                
                            </div>
                        </div>
                    ))} */}
                    {checkboxes.map((checkbox) => (
        <label key={checkbox.id}>
          <input
            type="checkbox"
            checked={checkbox.checked}
            onChange={() => handleCheckboxChange(checkbox.id)}
          />
          {checkbox.label}
        </label>
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
