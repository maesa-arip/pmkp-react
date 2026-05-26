import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { clsx } from "clsx";

const animatedComponents = makeAnimated();

// Styling selaras dengan Tema Enterprise (Slate & Sky)
const controlStyles = {
    base: "min-h-[42px] border rounded-xl bg-slate-50 dark:bg-[#1e293b] hover:cursor-pointer transition-colors duration-200 shadow-sm",
    focus: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-500/50 dark:ring-sky-500/20",
    nonFocus: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
};
const placeholderStyles = "text-slate-400 dark:text-slate-500 pl-1 py-0.5 text-sm font-medium";
const selectInputStyles = "pl-1 py-0.5 text-sm text-slate-900 dark:text-white";
const valueContainerStyles = "p-1.5 gap-1.5";
const singleValueStyles = "leading-7 ml-1 text-sm text-slate-900 dark:text-white";

// Desain Pill (Badge) untuk item yang dipilih
const multiValueStyles = "bg-sky-50 dark:bg-sky-500/10 rounded-md items-center py-0.5 pl-2 pr-1 m-0.5 border border-sky-100 dark:border-sky-500/20";
const multiValueLabelStyles = "leading-6 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400";
const multiValueRemoveStyles = "ml-1.5 border border-transparent bg-transparent hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 text-sky-400/80 dark:text-sky-500/80 rounded transition-colors";

const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles = "text-slate-400 dark:text-slate-500 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors";
const indicatorSeparatorStyles = "bg-slate-200 dark:bg-slate-700/80";
const dropdownIndicatorStyles = "p-1 text-slate-400 dark:text-slate-500 rounded-md hover:text-slate-600 dark:hover:text-slate-300 transition-colors";

// Menu & Daftar Opsi
const menuStyles = "p-1.5 mt-1.5 border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl z-50";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest";
const optionStyles = {
    base: "hover:cursor-pointer px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 font-medium",
    focus: "bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white",
    selected: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold flex items-center justify-between",
};
const noOptionsMessageStyles = "text-slate-500 dark:text-slate-400 p-4 text-sm text-center font-medium";

export default function ComboboxMultiple({
    ShouldMap,
    name,
    onChange,
    defaultValues,
}) {
    const [options, setOptions] = useState([
        { value: "0", label: "SEMUA UNIT", isDisabled: false },
        ...ShouldMap.map((option) => ({
            value: option.id.toString(),
            label: option.name,
            isDisabled: false,
        })),
    ]);

    const handleOptionSelect = (selectedOptions) => {
        const updatedOptions = options.map((option) => {
            if (option.value === "0") {
                return { ...option, isDisabled: false };
            } else {
                return {
                    ...option,
                    isDisabled: selectedOptions.some((sel) => sel.value === "0"),
                };
            }
        });

        setOptions(updatedOptions);
        onChange(selectedOptions.map(option => option.value).join(','));
    };

    const initialSelectedOptions = defaultValues.map((value) =>
        options.find((option) => option.value === value)
    ).filter(Boolean); // Filter undefined just in case

    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            defaultValue={initialSelectedOptions}
            onChange={handleOptionSelect}
            name={name}
            unstyled
            placeholder="Pilih satu atau beberapa..."
            styles={{
                input: (base) => ({ ...base, "input:focus": { boxShadow: "none" } }),
                multiValueLabel: (base) => ({ ...base, textOverflow:"clip" }),
                control: (base) => ({ ...base, transition: "none" }),
                menuPortal: base => ({ ...base, zIndex: 9999 })
            }}
            classNames={{
                control: ({ isFocused }) => clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
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
                option: ({ isFocused, isSelected }) => clsx(isFocused && optionStyles.focus, isSelected && optionStyles.selected, optionStyles.base),
                noOptionsMessage: () => noOptionsMessageStyles,
            }}
            // Menempatkan portal dropdown agar tidak terpotong oleh overflow komponen induk
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
        />
    );
}