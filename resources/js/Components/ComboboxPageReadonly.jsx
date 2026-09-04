import { Fragment } from 'react'
import { Combobox } from '@headlessui/react'

export default function ComboboxPageReadonly({ShouldMap, selected, tampilkanvalue = 'false', onChange, name}) {
    // Pada mode readonly, kita membuang fitur filter/query dan tombol panah dropdown
    return (
        <div className="w-full cursor-not-allowed opacity-80">
            <Combobox value={selected} onChange={onChange} name={name} disabled>
                <div className="relative mt-1">
                    <div className="relative w-full overflow-hidden text-left bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-lg shadow-sm cursor-not-allowed">
                        <Combobox.Input
                            className="w-full py-2.5 pl-3 pr-3 text-sm text-gray-500 dark:text-zinc-500 bg-transparent border-none focus:ring-0 cursor-not-allowed"
                            autoComplete="off"
                            displayValue={(item) => item?.value ? `(${item.value}) ${item.name}` : item?.name} 
                            readOnly
                        />
                        {/* Lock Icon penanda read-only */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                    </div>
                </div>
            </Combobox>
        </div>
    )
}