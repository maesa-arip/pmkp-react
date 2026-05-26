import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, KeyIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as SolidCheckIcon } from "@heroicons/react/24/solid";

export default function Form({
    errors,
    permissions,
    submit,
    data,
    setData,
    model,
    closeButton,
}) {
    // Handle sinkronisasi permissions array
    const [selectedPermissions, setSelectedPermissions] = useState(() => {
        return model?.permissions ? model.permissions.map((p) => p.id) : [];
    });

    const handleTogglePermission = (id) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Sinkronisasikan state lokal dengan useForm Inertia
    useEffect(() => {
        setData("permissions", selectedPermissions);
    }, [selectedPermissions]);

    // Reusable styling classes
    const inputClass = "block w-full text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg dark:text-slate-100 dark:bg-[#0f172a] dark:border-slate-700 focus:bg-white dark:focus:bg-[#020817] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block";
    const sectionCardClass = "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col shadow-sm relative overflow-hidden";
    const sectionHeaderClass = "px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent";

    return (
        <div className="relative flex flex-col w-full h-full bg-slate-50/30 dark:bg-transparent">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
                
                {/* --- INFORMASI ROLE --- */}
                <div className={sectionCardClass}>
                    <div className={sectionHeaderClass}>
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Identitas Peran (Role)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Berikan nama identitas yang jelas untuk peran ini (contoh: Admin, Superuser).</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex flex-col md:w-1/2">
                            <label htmlFor="name" className={labelClass}>Nama Role</label>
                            <TextInput
                                id="name"
                                value={data.name}
                                handleChange={(e) => setData("name", e.target.value)}
                                type="text"
                                className={inputClass}
                                placeholder="Contoh: Administrator"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* --- DAFTAR PERMISSIONS (GRID CARDS) --- */}
                <div className={`${sectionCardClass} mb-4`}>
                    <div className={`${sectionHeaderClass} flex items-center justify-between`}>
                        <div className="flex items-center">
                            <KeyIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Hak Akses (Permissions)</h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Pilih izin operasional (permission) yang akan diikat pada role ini.</p>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 text-xs font-black text-indigo-700 border border-indigo-200 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30">
                            {selectedPermissions.length} Terpilih
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {permissions && permissions.map((permission) => {
                                const isSelected = selectedPermissions.includes(permission.id);
                                
                                return (
                                    <div 
                                        key={permission.id}
                                        onClick={() => handleTogglePermission(permission.id)}
                                        className={`
                                            relative flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none group
                                            ${isSelected 
                                                ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-500/50 dark:bg-indigo-500/10 shadow-sm" 
                                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-[#161f33]"}
                                        `}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors ${isSelected ? "bg-indigo-200 dark:bg-indigo-500/30" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10"}`}>
                                                <KeyIcon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-400"}`} />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider truncate ${isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>
                                                {permission.name}
                                            </span>
                                        </div>
                                        
                                        <div className={`shrink-0 ml-2 transition-all ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                                            <SolidCheckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {(!permissions || permissions.length === 0) && (
                            <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data permission belum tersedia.</p>
                            </div>
                        )}
                        <InputError message={errors.permissions} className="mt-4" />
                    </div>
                </div>

            </div>

            {/* --- ACTION FOOTER STICKY --- */}
            <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row-reverse justify-start gap-3 mt-auto z-[90] rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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