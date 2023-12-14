import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import ThirdButton from "@/Components/ThirdButton";
import React, { useState } from "react";

function Inputs() {
    const [inputList, setInputList] = useState([]);
    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        const remove = list.filter(
            (_, indexFilter) => !(indexFilter === index)
        );
        // list.splice(index, 1);
        setInputList(remove);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { firstName: "", lastName: "" }]);
    };
    // console.log(inputList)
    return (
        <div className="grid grid-cols-12 gap-6">
            {inputList.map((x, i) => {
                return (
                    <>
                        <div className="col-span-2">
                            <InputLabel for="tanggal_insiden" value="Waktu" />
                            <input
                                id="tanggal_insiden"
                                name="firstName"
                                value={x.firstName}
                                onChange={(e) => handleInputChange(e, i)}
                                type="datetime-local"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="col-span-9">
                            <InputLabel
                                for="kronologi"
                                value="Kronologis Insiden"
                            />
                            <textarea
                                id="kronologi"
                                name="lastName"
                                value={x.lastName}
                                onChange={(e) => handleInputChange(e, i)}
                                rows={5}
                                type="text"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="col-span-1">
                            {inputList.length !== 1 && (
                                <ThirdButton
                                    color="red"
                                    className="mt-6"
                                    type="button"
                                    onClick={() => handleRemoveClick(i)}
                                >
                                    Remove
                                </ThirdButton>
                            )}
                            {inputList.length - 1 === i && (
                                <ThirdButton
                                    className="mt-6"
                                    type="button"
                                    onClick={handleAddClick}
                                >
                                    Add
                                </ThirdButton>
                            )}
                        </div>
                    </>
                );
            })}
            {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
        </div>
    );
}

export default Inputs;
