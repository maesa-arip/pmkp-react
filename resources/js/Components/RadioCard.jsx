import { RadioGroup } from '@headlessui/react'

export default function RadioCard({ShouldMap, selected, onChange}) {
    return (
        <div className="w-full">
            <RadioGroup value={selected} onChange={onChange}>
                <RadioGroup.Label className="sr-only">Pilihan Status</RadioGroup.Label>
                <div className="grid grid-cols-1 gap-3 mt-1 sm:grid-cols-2">
                    {ShouldMap.map((item) => (
                        <RadioGroup.Option
                            key={item.id}
                            value={item}
                            className={({ active, checked }) => `
                                relative flex cursor-pointer rounded-xl px-4 py-3 border transition-all duration-200 outline-none
                                ${active ? 'ring-2 ring-gray-300/50 dark:ring-white/20' : ''}
                                ${checked && item.id === 1 
                                    ? 'bg-red-50/80 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 shadow-sm' // Warna Merah untuk Sedang Terjadi
                                    : checked && item.id !== 1
                                    ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 shadow-sm' // Warna Hijau untuk Tidak Sedang Terjadi
                                    : 'bg-white dark:bg-[#09090b] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                                }
                            `}
                        >
                            {({ active, checked }) => (
                                <>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <RadioGroup.Label
                                                    as="p"
                                                    className={`font-bold transition-colors ${
                                                        checked && item.id === 1 ? 'text-red-800 dark:text-red-300' : 
                                                        checked && item.id !== 1 ? 'text-emerald-800 dark:text-emerald-300' : 
                                                        'text-gray-900 dark:text-white'
                                                    }`}
                                                >
                                                    {item.name}
                                                </RadioGroup.Label>
                                                {item.description && (
                                                    <RadioGroup.Description
                                                        as="span"
                                                        className={`inline text-xs mt-1 block transition-colors ${
                                                            checked && item.id === 1 ? 'text-red-600/80 dark:text-red-400/80' : 
                                                            checked && item.id !== 1 ? 'text-emerald-600/80 dark:text-emerald-400/80' : 
                                                            'text-gray-500 dark:text-zinc-500'
                                                        }`}
                                                    >
                                                        {item.description}
                                                    </RadioGroup.Description>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className={`shrink-0 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}>
                                            <CheckIcon 
                                                className={`w-6 h-6 ${
                                                    item.id === 1 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                                                }`} 
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="currentColor" className="opacity-20" />
            <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}