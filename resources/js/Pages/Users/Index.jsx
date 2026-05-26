import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { 
    XMarkIcon, 
    MagnifyingGlassIcon, 
    PlusIcon, 
    EllipsisVerticalIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";

import Create from "./Create";
import Edit from "./Edit";
import Pagination from "@/Components/Pagination";

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
    const { data: people, meta, filtered, attributes } = props.users;
    const roles = props.roles;
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
    const [enabled, setEnabled] = useState(false);
    
    // Dropdown Action State
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (email) => setOpenDropdownId(openDropdownId === email ? null : email);
    
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const isModalOpen = isOpenAddDialog || isOpenEditDialog || isOpenDestroyDialog;

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
            setState(people[index] || {});
        }
    };

    const triggerModal = (setter) => {
        setShowDrawer(false);
        setter(true);
    };

    const openEdit = (user) => { setState(user); setIsOpenEditDialog(true); setShowDrawer(false); };
    const openDestroy = (user) => { setState(user); setIsOpenDestroyDialog(true); setShowDrawer(false); };

    const destroyUser = () => {
        router.delete(route("users.destroy", state.id), { onSuccess: () => setIsOpenDestroyDialog(false) });
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent text-slate-900 dark:bg-transparent dark:text-slate-100 sm:p-2">
            <Head title="Manajemen Pengguna" />
            
            {/* --- MODALS --- */}
            <AddModal isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} size="max-w-4xl" title="Tambah Pengguna Baru">
                <Create roles={roles} enabled={enabled} setEnabled={setEnabled} isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} />
            </AddModal>
            
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-4xl" title="Edit Pengguna">
                <Edit roles={roles} model={state} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>
            
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-md" title="Hapus Pengguna" warning={`Yakin ingin menghapus akses untuk ${state?.name} secara permanen?`}>
                <DangerButton className="w-full ml-2" onClick={destroyUser}>Hapus Permanen</DangerButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Manajemen Pengguna</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelola akses, peran, dan kredensial pengguna sistem.</p>
                        </div>

                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold lg:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Cari nama atau email..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                            <button onClick={() => triggerModal(setIsOpenAddDialog)} className="inline-flex items-center justify-center w-full h-10 px-5 text-sm font-bold text-white transition-colors bg-blue-600 shadow-sm shrink-0 sm:w-auto rounded-xl hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
                                <PlusIcon className="w-4 h-4 mr-2" /> Tambah User
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {people.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <UserGroupIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Pengguna</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Belum ada data pengguna dalam sistem."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-[300px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'}`}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-max" onClick={() => sort("name")}>
                                                Identitas Pengguna <SortIcon field="name" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 w-[250px]">
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-max" onClick={() => sort("email")}>
                                                Kontak (Email) <SortIcon field="email" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[300px]">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Peran (Roles)
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 w-[150px] text-center">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Bergabung
                                            </div>
                                        </th>
                                        <th className="w-20 px-5 py-4 text-center border-b border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Aksi
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {people.map((person, index) => {
                                        const isSelected = selectedRow === index;
                                        
                                        return (
                                            <tr key={person.email} onClick={() => onSelectRow(index)} className={`group transition-colors duration-200 cursor-pointer ${isSelected ? "bg-blue-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                
                                                {/* IDENTITAS */}
                                                <td className={`px-5 py-4 align-middle sticky left-0 bg-clip-padding border-r border-slate-100 dark:border-slate-800/80 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-blue-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} ${isModalOpen || showDrawer ? 'z-0' : 'z-10'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-blue-700 uppercase bg-blue-100 border border-blue-200 rounded-full dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400 shrink-0">
                                                            {person.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{person.name}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 tracking-wide">ID: #{meta.from + index}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{person.email}</span>
                                                </td>

                                                <td className="px-5 py-4 whitespace-normal align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-wrap gap-2">
                                                        {person.roles && person.roles.length > 0 ? (
                                                            person.roles.map((role, idx) => (
                                                                <span key={idx} className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 uppercase rounded-md shadow-sm">
                                                                    {role.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[11px] italic text-slate-400">Tidak ada peran</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-center align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                        {person.joined}
                                                    </span>
                                                </td>
                                                
                                                {/* ACTION DROPDOWN */}
                                                <td className="px-5 py-4 text-center align-middle">
                                                    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => toggleDropdown(person.email)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        
                                                        {openDropdownId === person.email && (
                                                            <div className="absolute right-0 z-[100] w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                <div className="py-1">
                                                                    <button onClick={() => { openEdit(person); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group">
                                                                        <PencilSquareIcon className="w-4 h-4 mr-2 text-blue-500 transition-transform dark:text-blue-400 group-hover:scale-110" /> Edit Pengguna
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button onClick={() => { openDestroy(person); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group">
                                                                        <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Hapus Pengguna
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
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[420px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Detail Pengguna</h3>
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
                                <div className="flex items-center justify-center w-24 h-24 mb-4 text-4xl font-black text-blue-700 uppercase bg-blue-100 border-4 border-white shadow-md rounded-full dark:bg-blue-500/20 dark:border-[#1e293b] dark:text-blue-400">
                                    {state.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-black text-center text-slate-900 dark:text-white">{state.name}</h2>
                                <p className="mt-1 text-sm font-medium text-center text-slate-500 dark:text-slate-400">{state.email}</p>
                            </div>
                            
                            {/* Roles */}
                            <section>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Peran Akses (Roles)</label>
                                <div className="flex flex-wrap gap-2">
                                    {state.roles && state.roles.length > 0 ? (
                                        state.roles.map((role, idx) => (
                                            <span key={idx} className="px-3 py-1.5 text-xs font-bold tracking-widest text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 uppercase rounded-lg shadow-sm">
                                                {role.name}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="w-full p-4 text-center border border-dashed rounded-xl border-slate-300 dark:border-slate-700">
                                            <p className="text-xs italic text-slate-400">Belum ada hak akses diberikan.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Tanggal Bergabung</label>
                                <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-slate-800 dark:text-slate-200">
                                    {state.joined}
                                </div>
                            </section>
                        </div>
                        
                        {/* Drawer Footer Actions */}
                        <div className="flex flex-col gap-3 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => openEdit(state)} className="flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-blue-500/50">
                                <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit Pengguna
                             </button>
                             <button onClick={() => openDestroy(state)} className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-transparent text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shadow-sm dark:shadow-none">
                                <TrashIcon className="w-4 h-4 mr-2 opacity-70" /> Hapus Akses
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