import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import { 
    CheckCircleIcon, 
    UserCircleIcon, 
    KeyIcon, 
    ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as SolidCheckIcon } from "@heroicons/react/24/solid";

export default function Form({
    errors,
    roles,
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

                        {/* FIELD PASSWORD: Wajib jika Create, Opsional jika Edit */}
                        <div className="relative flex flex-col col-span-12 md:col-span-6 z-[67]">
                            <label className={labelClass}>
                                {isCreate ? "Password Baru" : "Ganti Password (Opsional)"}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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