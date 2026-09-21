import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export default function ComboboxPage({ShouldMap, selected, tampilkanvalue = 'false', onChange, name, placeholder = '', inputId, invalid, describedBy, wrapOptions = false, emptyMessage = 'Belum ada pilihan tersedia.'}) {
    const [query, setQuery] = useState('')

    const squeeze = (text) => String(text ?? '').toLowerCase().replace(/\s+/g, '')
    // An option may carry a `badge`, shown as a chip and searchable along with the name.
    const filteredShouldMap = query === ''
        ? ShouldMap
        : ShouldMap.filter((item) => (squeeze(item.name) + squeeze(item.badge)).includes(squeeze(query)))

    return (
        <div className="w-full">
            <Combobox value={selected} onChange={onChange} name={name}>
                <div className="relative mt-1">
                    <div className="relative w-full overflow-hidden text-left bg-white dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                        <Combobox.Input
                            id={inputId}
                            aria-invalid={invalid || undefined}
                            aria-describedby={describedBy}
                            className="w-full py-2.5 pl-3 pr-10 text-sm text-gray-900 dark:text-zinc-100 bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            autoComplete="off"
                            placeholder={placeholder}
                            displayValue={(item) => item?.value ? `(${item.value}) ${item.name}` : (item?.name || '')}
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
                            {filteredShouldMap.length === 0 ? (
                                <div className="relative px-4 py-3 text-center text-gray-500 cursor-default select-none dark:text-zinc-500">
                                    {query !== '' ? 'Data tidak ditemukan.' : emptyMessage}
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
                                                <span className={`block ${wrapOptions ? 'whitespace-normal break-words' : 'truncate'} ${selected ? 'font-semibold text-blue-600 dark:text-blue-400' : 'font-medium'}`}>
                                                    {item.value ? `${item.value} - ` : ''} {item.name}
                                                </span>
                                                {item.badge ? (
                                                    <span className="mt-1.5 inline-flex max-w-full items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold leading-4 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                                                        <span className="whitespace-normal break-words">{item.badge}</span>
                                                    </span>
                                                ) : null}
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