import React, { useState } from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { clsx } from "clsx";

const animatedComponents = makeAnimated();

const controlStyles = {
    base: "border rounded-md bg-white hover:cursor-pointer",
    focus: "border-primary-600 ring-1 ring-primary-500",
    nonFocus: "border-gray-300 hover:border-gray-400",
};
const placeholderStyles = "text-gray-500 pl-1 py-0.5";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
    "bg-gray-200 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
    "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
    "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
const indicatorSeparatorStyles = "bg-gray-300";
const dropdownIndicatorStyles =
    "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
    base: "hover:cursor-pointer px-3 py-2 rounded",
    focus: "bg-yellow-100 active:bg-yellow-200",
    selected:
        "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500",
};
const noOptionsMessageStyles =
    "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

export default function ComboboxMultiple({ ShouldMap, name, onChange }) {
    const [options, setOptions] = useState([
        {
            value: "0",
            label: "SEMUA UNIT",
            isDisabled: false,
        },
        ...ShouldMap.map((option) => ({
            value: option.id,
            label: option.name,
            isDisabled: false,
        })),
    ]);
    

    const handleOptionSelect = (selectedOptions) => {
        const updatedOptions = options.map((option) => {
            if (option.value === 0 | option.value === "0") {
                return {
                    ...option,
                    isDisabled: false,
                };
            } else {
                return {
                    ...option,
                    isDisabled: selectedOptions.some(
                        (selectedOption) => (selectedOption.value === 0 | selectedOption.value === "0")
                    ),
                };
            }
        });

        
        

        setOptions(updatedOptions);

    const selectedIds = selectedOptions
        .filter((option) => option.value !== 0 | option.value !== "0")
        .map((option) => option.value);

    // Convert selectedIds to a comma-separated string
    const selectedIdsString = "[" + selectedIds.join(",") + "]";

    // Call the onChange prop with the comma-separated string of selected pic_id values
    onChange(selectedIdsString);
    };

    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={handleOptionSelect}
            name={name}
            unstyled
            styles={{
                input: (base) => ({
                    ...base,
                    "input:focus": {
                        boxShadow: "none",
                    },
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    whiteSpace: "normal",
                    overflow: "visible",
                }),
                control: (base) => ({
                    ...base,
                    transition: "none",
                }),
            }}
            classNames={{
                control: ({ isFocused }) =>
                    clsx(
                        isFocused
                            ? controlStyles.focus
                            : controlStyles.nonFocus,
                        controlStyles.base
                    ),
                placeholder: () => placeholderStyles,
                input: () => selectInputStyles,
                valueContainer: () => valueContainerStyles,
                singleValue: () => singleValueStyles,
                multiValue: () => multiValueStyles,
                multiValueLabel: () => multiValueLabelStyles,
                multiValueRemove: () => multiValueRemoveStyles,
                indicatorsContainer: () => indicatorsContainerStyles,
                clearIndicator: () => clearIndicatorStyles,
                indicatorSeparator: () => indicatorSeparatorStyles,
                menu: () => menuStyles,
                groupHeading: () => groupHeadingStyles,
                option: ({ isFocused, isSelected }) =>
                    clsx(
                        isFocused && optionStyles.focus,
                        isSelected && optionStyles.selected,
                        optionStyles.base
                    ),
                noOptionsMessage: () => noOptionsMessageStyles,
            }}
        />
    );
}
