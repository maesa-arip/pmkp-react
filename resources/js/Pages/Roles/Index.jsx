import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/Components/Pagination";
import { 
    XMarkIcon, 
    MagnifyingGlassIcon, 
    PlusIcon, 
    EllipsisVerticalIcon,
    PencilSquareIcon,
    TrashIcon,
    ShieldCheckIcon,
    KeyIcon
} from "@heroicons/react/24/outline";

import Create from "./Create";
import Edit from "./Edit";

const SortIcon = ({ field, currentField, direction }) => {
    const isActive = field === currentField;
    return (
        <svg className={`w-3.5 h-3.5 ml-1.5 transition-colors ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isActive && direction === "desc" 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />}
        </svg>
    );
};

export default function Index(props) {
    const { data: rolesData, meta, filtered, attributes } = props.roles;
    const permissions = props.permissions;
    
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    
    // States untuk UI Baru
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState({});

    // Modals
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);

    // Dropdown State
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id) => setOpenDropdownId(openDropdownId === id ? null : id);

    const isModalOpen = isOpenAddDialog || isOpenEditDialog || isOpenDestroyDialog;

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const reload = useCallback(
        debounce((query) => {
            router.get(route(route().current()), { ...pickBy(query), page: query.page }, { preserveState: true, preserveScroll: true });
        }, 150), []
    );

    useEffect(() => { if (!isInitialRender) reload(params); else setIsInitialRender(false); }, [params]);

    useEffect(() => {
        let numbers = [];
        for (let i = attributes.per_page; i < attributes.total / attributes.per_page; i += attributes.per_page) numbers.push(i);
        setPageNumber(numbers);
    }, []);

    const onChange = (event) => setParams({ ...params, [event.target.name]: event.target.value, page: 1 });
    const sort = (item) => setParams({ ...params, field: item, direction: params.direction === "asc" ? "desc" : "asc" });

    const onSelectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
            setShowDrawer(false);
        } else {
            setSelectedRow(index);
            setShowDrawer(true);
            setState(rolesData[index] || {});
        }
    };

    const triggerModal = (setter) => {
        setShowDrawer(false);
        setter(true);
    };

    const openEdit = (role) => { setState(role); setIsOpenEditDialog(true); setShowDrawer(false); };
    const openDestroy = (role) => { setState(role); setIsOpenDestroyDialog(true); setShowDrawer(false); };

    const destroyRole = () => {
        router.delete(route("roles.destroy", state.id), { onSuccess: () => setIsOpenDestroyDialog(false) });
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent text-slate-900 dark:bg-transparent dark:text-slate-100 sm:p-2">
            <Head title="Manajemen Peran (Roles)" />
            
            {/* --- MODALS --- */}
            <AddModal isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} size="max-w-4xl" title="Tambah Role Baru">
                <Create permissions={permissions} isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} />
            </AddModal>
            
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-4xl" title="Edit Role & Permissions">
                <Edit permissions={permissions} model={state} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>
            
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-md" title="Hapus Role" warning={`Yakin ingin menghapus peran "${state?.name}"? Pengguna yang terhubung dengan peran ini mungkin akan kehilangan hak aksesnya.`}>
                <DangerButton className="w-full ml-2" onClick={destroyRole}>Hapus Permanen</DangerButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Manajemen Peran (Roles)</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelola kelompok hak akses yang dapat diberikan kepada pengguna sistem.</p>
                        </div>
                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold lg:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Cari nama role..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                            <button onClick={() => triggerModal(setIsOpenAddDialog)} className="inline-flex items-center justify-center w-full h-10 px-5 text-sm font-bold text-white transition-colors bg-blue-600 shadow-sm shrink-0 sm:w-auto rounded-xl hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
                                <PlusIcon className="w-4 h-4 mr-2" /> Tambah Role
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {rolesData.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <ShieldCheckIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Data Role</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Sistem belum memiliki grup peran (role) yang terdaftar."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-[300px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'}`}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-max" onClick={() => sort("name")}>
                                                Identitas Role <SortIcon field="name" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[300px] max-w-[600px]">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Daftar Izin (Permissions) Terikat
                                            </div>
                                        </th>
                                        <th className="w-24 px-5 py-4 text-center border-b border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Aksi
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {rolesData.map((role, index) => {
                                        const isSelected = selectedRow === index;
                                        
                                        return (
                                            <tr key={index} onClick={() => onSelectRow(index)} className={`group transition-colors duration-200 cursor-pointer ${isSelected ? "bg-blue-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                
                                                <td className={`px-5 py-5 align-middle sticky left-0 bg-clip-padding border-r border-slate-100 dark:border-slate-800/80 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-blue-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} ${isModalOpen || showDrawer ? 'z-0' : 'z-10'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center justify-center w-10 h-10 text-blue-700 bg-blue-100 border border-blue-200 rounded-xl dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400 shrink-0">
                                                            <ShieldCheckIcon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-sm font-bold tracking-wide uppercase truncate text-slate-900 dark:text-white">{role.name}</span>
                                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">#{meta.from + index}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 align-middle border-r border-slate-100 dark:border-slate-800/80 whitespace-normal max-w-[600px]">
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions && role.permissions.length > 0 ? (
                                                            <>
                                                                {role.permissions.slice(0, 8).map((permission, idx) => (
                                                                    <span key={idx} className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-sky-700 bg-sky-50 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30 uppercase rounded-md shadow-sm">
                                                                        {permission.name}
                                                                    </span>
                                                                ))}
                                                                {role.permissions.length > 8 && (
                                                                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-slate-500 bg-slate-100 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10 uppercase rounded-md shadow-sm">
                                                                        +{role.permissions.length - 8} lainnya
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-xs italic text-slate-400">Tidak ada permission terikat</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-center align-middle">
                                                    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => toggleDropdown(role.id)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        
                                                        {openDropdownId === role.id && (
                                                            <div className="absolute right-0 z-[100] w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                <div className="py-1">
                                                                    <button onClick={() => { openEdit(role); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group">
                                                                        <PencilSquareIcon className="w-4 h-4 mr-2 text-blue-500 transition-transform dark:text-blue-400 group-hover:scale-110" /> Edit Role
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button onClick={() => { openDestroy(role); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group">
                                                                        <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Hapus Role
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end pb-10">
                    <Pagination meta={meta} />
                </div>
            </div>

            {/* ----------------- SIDE DRAWER (MASTER-DETAIL VIEW) ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[450px] lg:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Detail Role & Akses</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Sistem ID: {state.id}</p>
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-7 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            {/* Profile Info */}
                            <div className="flex flex-col items-center justify-center py-6 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>
                                <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-600 bg-blue-100 border-2 border-blue-200 shadow-sm rounded-2xl dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400">
                                    <ShieldCheckIcon className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black tracking-wide text-center uppercase text-slate-900 dark:text-white">{state.name}</h2>
                            </div>
                            
                            {/* All Permissions */}
                            <section>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-4">Daftar Hak Akses Lengkap ({state.permissions?.length || 0})</label>
                                <div className="flex flex-col gap-2">
                                    {state.permissions && state.permissions.length > 0 ? (
                                        state.permissions.map((permission, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                                                    <KeyIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="text-sm font-semibold uppercase text-slate-800 dark:text-slate-200">{permission.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-5 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                            <p className="text-sm italic text-slate-400">Belum ada hak akses diberikan untuk peran ini.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                        
                        {/* Drawer Footer Actions */}
                        <div className="flex flex-col gap-3 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => openEdit(state)} className="flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-blue-500/50">
                                <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit Peran & Akses
                             </button>
                             <button onClick={() => openDestroy(state)} className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-transparent text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-sm font-bold rounded-xl transition-colors shadow-sm dark:shadow-none">
                                <TrashIcon className="w-4 h-4 mr-2 opacity-70" /> Hapus Role
                             </button>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1); }
                .animate-fade-in { animation: fadeIn 0.2s ease-out; }
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

Index.layout = (page) => <App children={page} />;