import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export default function ComboboxPage({ShouldMap, selected, tampilkanvalue = 'false', onChange, name}) {
    const [query, setQuery] = useState('')

    const filteredShouldMap = query === ''
        ? ShouldMap
        : ShouldMap.filter((item) =>
            item.name.toLowerCase().replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

    return (
        <div className="w-full">
            <Combobox value={selected} onChange={onChange} name={name}>
                <div className="relative mt-1">
                    <div className="relative w-full overflow-hidden text-left bg-white dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                        <Combobox.Input
                            className="w-full py-2.5 pl-3 pr-10 text-sm text-gray-900 dark:text-zinc-100 bg-transparent border-none outline-none focus:ring-0"
                            autoComplete="off"
                            displayValue={(item) => item?.value ? `(${item.value}) ${item.name}` : item?.name} 
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute z-50 w-full py-1.5 mt-1 overflow-auto text-sm bg-white dark:bg-[#18181b] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg max-h-60 focus:outline-none custom-scrollbar">
                            {filteredShouldMap.length === 0 && query !== '' ? (
                                <div className="relative px-4 py-3 text-center text-gray-500 cursor-default select-none dark:text-zinc-500">
                                    Data tidak ditemukan.
                                </div>
                            ) : (
                                filteredShouldMap.map((item) => (
                                    <Combobox.Option
                                        key={item.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2.5 pl-10 pr-4 mx-1 rounded-lg transition-colors ${
                                                active ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-zinc-300'
                                            }`
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-semibold text-blue-600 dark:text-blue-400' : 'font-medium'}`}>
                                                    {item.value ? `${item.value} - ` : ''} {item.name}
                                                </span>
                                                {selected ? (
                                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500'}`}>
                                                        <CheckIcon className="w-4 h-4" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}