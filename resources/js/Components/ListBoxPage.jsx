import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

export default function ListBoxPage({ ShouldMap, selected, onChange }) {
    return (
        <Listbox
            as={"div"}
            className="relative z-10 w-full"
            value={selected}
            onChange={onChange}
        >
            <Listbox.Button className="flex justify-between w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="inset-y-0 right-0 flex items-center justify-between pointer-events-none">
                    {/* <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              /> */}
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute w-full h-64 py-1 mt-1 overflow-hidden overflow-y-auto text-base bg-white rounded-md shadow-lg max-h-max ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {ShouldMap.map((item) => (
                        <Listbox.Option
                            key={item.id}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                        ? "bg-amber-100 text-amber-900"
                                        : "text-gray-900"
                                }`
                            }
                            value={item}
                        >
                            {({ selected }) => (
                                <>
                                    <span
                                        className={`block truncate ${
                                            selected
                                                ? "font-medium"
                                                : "font-normal"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                    {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>

                                            {/* <CheckIcon className="w-5 h-5" aria-hidden="true" /> */}
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Transition>
        </Listbox>
    );
}
