import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function ListBoxPage({ ShouldMap, selected, onChange, name }) {
    return (
        <Listbox
            as={"div"}
            className="relative w-full"
            value={selected}
            onChange={onChange}
            name={name}
        >
            <Listbox.Button className="flex justify-between w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="inset-y-0 right-0 flex items-center justify-between pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400 icon icon-tabler icon-tabler-selector"
                        aria-hidden="true"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 9l4 -4l4 4" />
                        <path d="M16 15l-4 4l-4 -4" />
                    </svg>
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute z-10 w-full h-auto py-1 mt-1 overflow-hidden overflow-y-auto text-base bg-white rounded-md shadow-lg max-h-64 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                                ? "font-semibold"
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
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
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
