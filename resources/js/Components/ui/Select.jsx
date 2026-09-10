import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

const Select = ({
    value,
    onChange,
    options = [],
    className = "",
    buttonClassName = "",
    placeholder = "Pilih",
    disabled = false,
}) => {
    const selected = options.find((option) => String(option.value) === String(value));

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled}>
            <div className={`relative ${className}`}>
                <Listbox.Button
                    className={`relative h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-10 text-left text-sm font-bold text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${buttonClassName}`}
                >
                    <span className="block truncate">
                        {selected?.label || placeholder}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="h-4 w-4 text-slate-400" />
                    </span>
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-900">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={({ active, disabled }) =>
                                    `relative cursor-pointer select-none py-2 pl-9 pr-3 font-semibold ${
                                        active
                                            ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                                            : "text-slate-700 dark:text-slate-200"
                                    } ${disabled ? "cursor-not-allowed opacity-50" : ""}`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span className="block truncate">
                                            {option.label}
                                        </span>
                                        {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600 dark:text-sky-300">
                                                <CheckIcon className="h-4 w-4" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default Select;
