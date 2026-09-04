import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { 
    CheckCircleIcon, 
    BuildingOffice2Icon,
    ChevronUpDownIcon,
    CheckIcon,
    MapPinIcon,
    PlusCircleIcon,
    UserCircleIcon, 
    KeyIcon, 
    ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as SolidCheckIcon } from "@heroicons/react/24/solid";

function SearchCombobox({ items = [], value, onChange, placeholder, displayValue, disabled = false }) {
    const [query, setQuery] = useState("");
    const selected = useMemo(
        () => items.find((item) => String(item.id) === String(value)) || null,
        [items, value]
    );
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
    const filteredItems = normalizedQuery === ""
        ? items
        : items.filter((item) => {
            const searchable = [
                item.name,
                item.location?.name,
            ].filter(Boolean).join(" ").toLowerCase().replace(/\s+/g, "");

            return searchable.includes(normalizedQuery);
        });

    return (
        <Combobox value={selected} onChange={(item) => onChange(item?.id || "")} disabled={disabled} nullable>
            <div className="relative">
                <div className="relative w-full overflow-hidden text-left bg-white border border-slate-300 rounded-lg shadow-sm dark:bg-[#0f172a] dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Combobox.Input
                        className="w-full py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 bg-transparent border-none outline-none dark:text-slate-100 focus:ring-0 placeholder:text-slate-400"
                        displayValue={(item) => item ? displayValue(item) : ""}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        autoComplete="off"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                    </Combobox.Button>
                </div>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute z-[120] w-full py-1.5 mt-1 overflow-auto text-sm bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-64 focus:outline-none custom-scrollbar">
                        {filteredItems.length === 0 ? (
                            <div className="px-4 py-3 text-sm font-medium text-center text-slate-500 dark:text-slate-400">
                                Data tidak ditemukan.
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <Combobox.Option
                                    key={item.id}
                                    value={item}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 mx-1 rounded-lg transition-colors ${
                                            active ? "bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200" : "text-slate-700 dark:text-slate-300"
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? "font-bold text-blue-700 dark:text-blue-300" : "font-semibold"}`}>
                                                {displayValue(item)}
                                            </span>
                                            {item.location?.name && (
                                                <span className="block mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                    Lokasi: {item.location.name}
                                                </span>
                                            )}
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                                    <CheckIcon className="w-4 h-4" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}

export default function Form({
    errors,
    roles,
    pics = [],
    locations = [],
    submit,
    data,
    setData,
    model,
    closeButton,
    isCreate = false, // Membedakan mode tambah atau edit
}) {
    // Logika pemilihan peran/roles 100% sama dengan aslinya
    const optionsFromDB = roles || [];
    const userrole = model?.roles ? model.roles.map((obj) => obj.id) : [];
    
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const updatedOptions = optionsFromDB.map((option) => ({
            ...option,
            isSelected: userrole.includes(option.id),
        }));
        setOptions(updatedOptions);
    }, []);

    const handleToggleRole = (optionId) => {
        setOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.id === optionId ? { ...option, isSelected: !option.isSelected } : option
            )
        );
    };

    // Sinkronisasi isSelected ke data.roles untuk disubmit
    useEffect(() => {
        const selectedIds = options.filter(o => o.isSelected).map(o => o.id);
        setData("roles", selectedIds);
    }, [options]);

    // --- Styling helpers Shadcn Theme ---
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent rounded-t-2xl";
    const toggleCreatePic = () => setData({
        ...data,
        create_pic: !data.create_pic,
        pic_id: data.create_pic ? data.pic_id : "",
        new_pic_name: "",
        location_id: "",
        create_location: false,
        new_location_name: "",
    });
    const toggleCreateLocation = () => setData({
        ...data,
        create_location: !data.create_location,
        location_id: "",
        new_location_name: "",
    });

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- BENTO 1: DATA PENGGUNA --- */}
                <div className={`${sectionCardClass} relative z-[60]`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <UserCircleIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Dasar Pengguna</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Data identitas dan kredensial akses sistem.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
                        <div className="relative flex flex-col col-span-12 md:col-span-12 z-[69]">
                            <label className={labelClass}>Nama Lengkap</label>
                            <TextInput
                                id="name"
                                value={data.name}
                                handleChange={(e) => setData("name", e.target.value)}
                                type="text"
                                className={inputClass}
                                placeholder="Contoh: dr. John Doe"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[68]">
                            <label className={labelClass}>Alamat Email</label>
                            <TextInput
                                id="email"
                                value={data.email}
                                handleChange={(e) => setData("email", e.target.value)}
                                type="email"
                                className={inputClass}
                                placeholder="admin@rsud.com"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[68]">
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                                <label className={`${labelClass} mb-0`}>Unit / PIC</label>
                                <button
                                    type="button"
                                    onClick={toggleCreatePic}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    <PlusCircleIcon className="w-4 h-4" />
                                    {data.create_pic ? "Pilih PIC existing" : "Buat PIC baru"}
                                </button>
                            </div>

                            {!data.create_pic ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
                                        <BuildingOffice2Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <SearchCombobox
                                        items={pics}
                                        value={data.pic_id || ""}
                                        onChange={(value) => setData("pic_id", value)}
                                        placeholder="Cari nama PIC atau lokasi..."
                                        displayValue={(pic) => pic.location?.name ? `${pic.name} - ${pic.location.name}` : pic.name}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <BuildingOffice2Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            </div>
                                            <TextInput
                                                id="new_pic_name"
                                                value={data.new_pic_name || ""}
                                                handleChange={(e) => setData("new_pic_name", e.target.value)}
                                                type="text"
                                                className={`${inputClass} pl-10`}
                                                placeholder="Nama PIC baru"
                                            />
                                        </div>
                                        <InputError message={errors.new_pic_name} className="mt-1" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-1.5">
                                            <label className={`${labelClass} mb-0`}>Lokasi PIC</label>
                                            <button
                                                type="button"
                                                onClick={toggleCreateLocation}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                <PlusCircleIcon className="w-4 h-4" />
                                                {data.create_location ? "Pilih lokasi existing" : "Buat lokasi baru"}
                                            </button>
                                        </div>

                                        {!data.create_location ? (
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
                                                    <MapPinIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <SearchCombobox
                                                    items={locations}
                                                    value={data.location_id || ""}
                                                    onChange={(value) => setData("location_id", value)}
                                                    placeholder="Cari lokasi..."
                                                    displayValue={(location) => location.name}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <MapPinIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <TextInput
                                                    id="new_location_name"
                                                    value={data.new_location_name || ""}
                                                    handleChange={(e) => setData("new_location_name", e.target.value)}
                                                    type="text"
                                                    className={`${inputClass} pl-10`}
                                                    placeholder="Nama lokasi baru"
                                                />
                                            </div>
                                        )}
                                        <InputError message={errors.location_id || errors.new_location_name} className="mt-1" />
                                    </div>
                                </div>
                            )}
                            <InputError message={errors.pic_id} className="mt-1" />
                        </div>

                        {/* FIELD PASSWORD: Wajib jika Create, Opsional jika Edit */}
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[67]">
                            <label className={labelClass}>
                                {isCreate ? "Password Baru" : "Ganti Password (Opsional)"}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
                                    <KeyIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </div>
                                <TextInput
                                    id="password"
                                    value={data.password}
                                    handleChange={(e) => setData("password", e.target.value)}
                                    type="password"
                                    className={`${inputClass} pl-10`}
                                    placeholder={isCreate ? "Masukkan kata sandi..." : "Kosongkan jika tidak ingin diubah"}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- BENTO 2: HAK AKSES & PERAN (ROLES) --- */}
                <div className={`${sectionCardClass} relative z-[50] mb-4`}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Manajemen Peran Akses (Roles)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Pilih satu atau lebih hak akses yang diberikan kepada pengguna ini.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {options.map((option) => (
                                <div 
                                    key={option.id}
                                    onClick={() => handleToggleRole(option.id)}
                                    className={`
                                        relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none overflow-hidden group
                                        ${option.isSelected 
                                            ? "border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-500/10 shadow-sm" 
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-[#161f33]"}
                                    `}
                                >
                                    <span className={`text-xs font-bold uppercase tracking-wider line-clamp-2 pr-6 ${option.isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}>
                                        {option.name}
                                    </span>
                                    
                                    <div className={`absolute right-4 shrink-0 transition-all ${option.isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                                        <SolidCheckIcon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    {!option.isSelected && (
                                        <div className="absolute transition-opacity right-4 shrink-0 opacity-40 group-hover:opacity-100">
                                            <CheckCircleIcon className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-blue-300 dark:group-hover:text-blue-500/50" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length === 0 && (
                            <div className="p-10 text-center border border-dashed rounded-2xl border-slate-300 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data role/peran tidak tersedia dari sistem.</p>
                            </div>
                        )}
                        <InputError message={errors.roles} className="mt-3" />
                    </div>
                </div>

            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    {submit}
                </button>
                <button 
                    type="button" 
                    onClick={closeButton} 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"
                >
                    Batal
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>
        </div>
    );
}
