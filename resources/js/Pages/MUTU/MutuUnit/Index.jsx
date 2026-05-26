import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import ExportModal from "@/Components/Modal/ExportModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "@/Components/Pagination";
import moment from "moment";
import "moment/locale/id";
import EditFormulirPDSA from "../MutuPDSA/Edit";
import PDSA from "@/Pages/Export/PDSA";
import MutuIndikator from "@/Pages/Export/MutuIndikator";
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    InboxIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    TrashIcon,
    PrinterIcon,
    DocumentChartBarIcon,
    XMarkIcon,
    ChartPieIcon,
    MapPinIcon,
    ClockIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

const UpIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
);
const DownIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
);

export default function Index(props) {
    const { data: MutuUnit, meta, filtered, attributes } = props.MutuUnit;
    
    let ShouldMap = {
        MutuIndikator: props.MutuIndikator,
        IndikatorFitur4: props.IndikatorFitur4,
        IndikatorBaru: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
    };
    
    const { auth, permissionNames } = usePage().props;
    const permission_name = permissionNames ? permissionNames.map((p) => p.name) : [];
    
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const reload = useCallback(
        debounce((query) => {
            router.get(
                route(route().current()),
                { ...pickBy(query), page: query.page },
                { preserveState: true, preserveScroll: true }
            );
        }, 150),
        []
    );

    useEffect(() => {
        if (!isInitialRender) reload(params);
        else setIsInitialRender(false);
    }, [params]);

    useEffect(() => {
        let numbers = [];
        for (let i = attributes.per_page; i < attributes.total / attributes.per_page; i += attributes.per_page) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, []);

    const onChange = (event) => {
        setParams({ ...params, [event.target.name]: event.target.value, page: 1 });
    };

    const sort = (item) => {
        setParams({ ...params, field: item, direction: params.direction == "asc" ? "desc" : "asc" });
    };

    // Modals & States
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenEditDialogFormulirPDSA, setIsOpenEditDialogFormulirPDSA] = useState(false);
    const [isOpenExportDialogPDSA, setIsOpenExportDialogPDSA] = useState(false);
    const [isOpenExportDialogMutuIndikator, setIsOpenExportDialogMutuIndikator] = useState(false);
    const [state, setState] = useState({});
    
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id) => setOpenDropdownId(openDropdownId === id ? null : id);
    
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const isModalOpen = isOpenEditDialog || isOpenEditDialogFormulirPDSA;

    // Logic Baris Terpilih
    const onSelectRow = (index) => {
        if (selectedRow === index && showDrawer) {
            setSelectedRow(null);
            setShowDrawer(false);
        } else {
            setSelectedRow(index);
            setShowDrawer(true);
            setState(MutuUnit[index] || {});
        }
    };

    const triggerModal = (setter, row = state) => {
        setState(row);
        setShowDrawer(false);
        setSelectedRow(null);
        setter(true);
    };

    // Helper Boolean (Apakah Capaian Tercapai atau Perlu PDSA)
    const checkIsTercapai = (item) => {
        if (!item || !item.mutu_indikator) return false;
        const op = item.mutu_indikator.operator;
        const cap = parseFloat(item.capaian);
        const std = parseFloat(item.mutu_indikator.standar);
        
        if (op === "=") return cap === std;
        if (op === "≥") return cap >= std;
        if (op === "≤") return cap <= std;
        if (op === ">") return cap > std;
        if (op === "<") return cap < std;
        return false;
    };

    const stateIsTercapai = checkIsTercapai(state);

    // CRUD Actions
    const openAddDialog = () => setIsOpenAddDialog(true);
    const destroyMutuUnit = () => { router.delete(route("MutuUnit.destroy", state.id), { onSuccess: () => setIsOpenDestroyDialog(false) }); };
    
    const openExportDialogPDSA = () => setIsOpenExportDialogPDSA(true);
    const openExportDialogMutuIndikator = () => setIsOpenExportDialogMutuIndikator(true);

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Capaian Mutu Unit" />
            
            {/* --- MODALS --- */}
            <AddModal isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} size="max-w-4xl" title="Tambah Capaian Mutu Unit">
                <Create ShouldMap={ShouldMap} isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} />
            </AddModal>
            
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-4xl" title="Edit Capaian Mutu Unit">
                <Edit ShouldMap={ShouldMap} model={state} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>

            <EditModal isOpenEditDialog={isOpenEditDialogFormulirPDSA} setIsOpenEditDialog={setIsOpenEditDialogFormulirPDSA} size="max-w-6xl" title="Formulir PDSA Mutu Unit">
                <EditFormulirPDSA model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFormulirPDSA} setIsOpenEditDialog={setIsOpenEditDialogFormulirPDSA} />
            </EditModal>

            <ExportModal isOpenExportDialog={isOpenExportDialogPDSA} setIsOpenExportDialog={setIsOpenExportDialogPDSA} size="max-w-4xl" title={`Export PDSA - ${auth.user.name}`}>
                <PDSA setIsOpenAddDialog={setIsOpenExportDialogPDSA} />
            </ExportModal>

            <ExportModal isOpenExportDialog={isOpenExportDialogMutuIndikator} setIsOpenExportDialog={setIsOpenExportDialogMutuIndikator} size="max-w-4xl" title={`Export Indikator Mutu - ${auth.user.name}`}>
                <MutuIndikator setIsOpenAddDialog={setIsOpenExportDialogMutuIndikator} />
            </ExportModal>
            
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-md" title="Hapus Mutu Unit" warning="Yakin ingin menghapus data capaian mutu ini secara permanen?">
                <DangerButton className="w-full ml-2" onClick={destroyMutuUnit}>Hapus Permanen</DangerButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Capaian Mutu Unit</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pantau evaluasi indikator mutu bulanan dan laporan PDSA.</p>
                        </div>

                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto md:mr-2">
                                <button onClick={openExportDialogPDSA} className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-sky-600 dark:bg-[#1e293b] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400 transition-colors shadow-sm">
                                    <PrinterIcon className="w-4 h-4 mr-1.5" /> Print PDSA
                                </button>
                                <button onClick={openExportDialogMutuIndikator} className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 dark:bg-[#1e293b] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors shadow-sm">
                                    <DocumentChartBarIcon className="w-4 h-4 mr-1.5" /> Print Indikator
                                </button>
                            </div>

                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 sm:w-48 md:w-56">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Cari data..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                            <button onClick={openAddDialog} className="inline-flex items-center justify-center w-full h-10 px-5 text-sm font-bold text-white transition-colors shadow-sm shrink-0 sm:w-auto rounded-xl bg-sky-600 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50">
                                <PlusIcon className="w-4 h-4 mr-2" /> Tambah Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {MutuUnit.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <InboxIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Capaian Mutu</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Mulai input data capaian mutu unit Anda bulan ini."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-4 py-3.5 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-16 text-center shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'} align-top`}>
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">#</div>
                                        </th>
                                        <th className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-28">Bulan</th>
                                        <th className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-40" onClick={() => sort("mutu_kategori_id")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Kategori
                                                {params.field == "mutu_kategori_id" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "mutu_kategori_id" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors max-w-[300px]" onClick={() => sort("indikator_fitur4_id")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Indikator Mutu
                                                {params.field == "indikator_fitur4_id" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "indikator_fitur4_id" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th colSpan={3} className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                                            Numerator (N) & Denumerator (D)
                                        </th>
                                        <th className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-32" onClick={() => sort("standar")}>
                                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Target / Capaian
                                                {params.field == "standar" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "standar" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3.5 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-36" onClick={() => sort("location_id")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Unit
                                                {params.field == "location_id" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "location_id" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {MutuUnit.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const isTercapai = checkIsTercapai(item);

                                        return (
                                            <Fragment key={index}>
                                                {/* BARIS PERTAMA (Data Utama + Numerator) */}
                                                <tr onClick={() => onSelectRow(index)} className={`group transition-colors cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                    
                                                    <td rowSpan={2} className={`px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800/80 align-middle sticky left-0 bg-clip-padding ${isSelected ? "bg-sky-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-10'}`}>
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                            {meta.from + index}
                                                        </span>
                                                    </td>

                                                    <td rowSpan={2} className="px-4 py-4 text-center whitespace-normal align-middle border-b border-r border-slate-100 dark:border-slate-800/80">
                                                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                                            {moment(item.tanggal_mutu).locale("id").format("MMM YYYY")}
                                                        </span>
                                                    </td>
                                                    <td rowSpan={2} className="px-4 py-4 whitespace-normal align-middle border-b border-r border-slate-100 dark:border-slate-800/80">
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                                                            {item.mutu_indikator.kategori?.name || '-'}
                                                        </span>
                                                    </td>
                                                    <td rowSpan={2} className="px-4 py-4 border-b border-r border-slate-100 dark:border-slate-800/80 align-middle whitespace-normal max-w-[300px]">
                                                        <span className="text-[13px] font-medium leading-snug text-slate-900 dark:text-white block break-words">
                                                            {item.mutu_indikator.indikator_fitur4?.name || '-'}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Numerator */}
                                                    <td className="px-3 py-3 text-center border-b border-r border-slate-200 dark:border-slate-700/50 w-10 bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 text-[10px] font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 rounded-md ring-1 ring-sky-200 dark:ring-sky-500/30">N</span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-normal border-b border-r border-slate-200 dark:border-slate-700/50 max-w-[200px] bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="text-xs font-medium leading-relaxed break-words text-slate-700 dark:text-slate-300 line-clamp-2">{item.mutu_indikator.num_name || '-'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center border-b border-r border-slate-200 dark:border-slate-700/50 w-16 bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white shrink-0 bg-white dark:bg-[#1e293b] px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">{item.num}</span>
                                                    </td>

                                                    {/* Kolom Target & Evaluasi Capaian */}
                                                    <td rowSpan={2} className="px-4 py-4 text-center align-middle border-b border-r border-slate-100 dark:border-slate-800/80">
                                                        <div className="flex flex-col items-center gap-2.5">
                                                            <div className="flex flex-col items-center bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden w-full">
                                                                <div className="bg-slate-100 dark:bg-slate-800 w-full py-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">Aktual</div>
                                                                <div className="py-1.5 font-black text-sm text-slate-900 dark:text-white">{item.capaian} {item.mutu_indikator.penyebut}</div>
                                                                <div className="w-full border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e293b] py-1 px-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                                    Target: {item.mutu_indikator.operator == '=' ? '' : item.mutu_indikator.operator} {item.mutu_indikator.standar}{item.mutu_indikator.penyebut}
                                                                </div>
                                                            </div>

                                                            {/* Evaluasi Status (Badge) */}
                                                            {isTercapai ? (
                                                                <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 w-full justify-center">
                                                                    Tercapai
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {item.mutu_pdsa ? (
                                                                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 w-full justify-center">
                                                                            Sudah PDSA
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 w-full justify-center shadow-sm">
                                                                            Perlu PDSA
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td rowSpan={2} className="px-4 py-4 whitespace-normal align-middle border-b border-r border-slate-100 dark:border-slate-800/80">
                                                        <span className="block text-xs font-semibold break-words text-slate-700 dark:text-slate-300">
                                                            {item.mutu_indikator.location?.name || '-'}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* ACTION DROPDOWN */}
                                                    <td rowSpan={2} className="px-4 py-4 text-center align-middle border-b border-slate-100 dark:border-slate-800/80">
                                                        <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => toggleDropdown(item.id)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                                                                <EllipsisVerticalIcon className="w-5 h-5" />
                                                            </button>
                                                            
                                                            {openDropdownId === item.id && (
                                                                <div className="absolute right-0 z-[100] w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                    
                                                                    {/* PDSA Logic: Hanya muncul jika TIDAK Tercapai */}
                                                                    {!isTercapai && (
                                                                        <div className="py-1">
                                                                            <button onClick={() => triggerModal(setIsOpenEditDialogFormulirPDSA, item)} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:text-blue-400 group">
                                                                                <DocumentChartBarIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> 
                                                                                {item.mutu_pdsa ? "Edit PDSA" : "Buat Laporan PDSA"}
                                                                            </button>
                                                                            {item.mutu_pdsa && (
                                                                                <a href={`/print-pdsa/${item.code}`} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group">
                                                                                    <PrinterIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 text-slate-400 dark:text-slate-500" /> Print Laporan PDSA
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    <div className="py-1">
                                                                        <button onClick={() => triggerModal(setIsOpenEditDialog, item)} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group">
                                                                            <PencilSquareIcon className="w-4 h-4 mr-2 transition-transform text-sky-500 group-hover:scale-110 dark:text-sky-400" /> Edit Data Mutu
                                                                        </button>
                                                                    </div>
                                                                    <div className="py-1">
                                                                        <button onClick={() => triggerModal(setIsOpenDestroyDialog, item)} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group">
                                                                            <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Hapus Data
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* BARIS KEDUA (Denumerator) */}
                                                <tr onClick={() => onSelectRow(index)} className={`group transition-colors cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                    <td className="px-3 py-3 text-center border-b border-r border-slate-200 dark:border-slate-700/50 w-10 bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-md ring-1 ring-rose-200 dark:ring-rose-500/30">D</span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-normal border-b border-r border-slate-200 dark:border-slate-700/50 max-w-[200px] bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="text-xs font-medium leading-relaxed break-words text-slate-700 dark:text-slate-300 line-clamp-2">{item.mutu_indikator.denum_name || '-'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center border-b border-r border-slate-200 dark:border-slate-700/50 w-16 bg-slate-50/50 dark:bg-[#0f172a]/60 align-middle">
                                                        <span className="text-sm font-black text-slate-900 dark:text-white shrink-0 bg-white dark:bg-[#1e293b] px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">{item.denum}</span>
                                                    </td>
                                                </tr>
                                            </Fragment>
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
            
            {/* ----------------- SHADCN FLOATING DRAWER (SIDE PANEL) ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[450px] lg:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        {/* Header Panel */}
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a] shrink-0">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Detail Capaian Mutu</h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                    {moment(state.tanggal_mutu).locale("id").format("MMMM YYYY")}
                                </p>
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Panel */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            
                            {/* Indikator Info */}
                            <section className="p-5 border border-sky-100 dark:border-sky-500/20 rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500"></div>
                                <label className="flex items-center text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest mb-2 pl-2">
                                    <ChartPieIcon className="w-3.5 h-3.5 mr-1.5" /> Indikator Mutu
                                </label>
                                <p className="text-[13px] font-bold leading-relaxed text-slate-800 dark:text-slate-200 pl-2 mb-1">{state.mutu_indikator?.indikator_fitur4?.name || '-'}</p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-2">Kategori: {state.mutu_indikator?.kategori?.name || '-'}</p>
                                
                                <div className="w-full h-px mt-4 mb-4 ml-2 bg-slate-100 dark:bg-slate-700"></div>
                                
                                {/* Actual vs Target Visual */}
                                <div className="grid grid-cols-2 gap-3 pl-2 text-center">
                                    <div className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Capaian Aktual</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{state.capaian} {state.mutu_indikator?.penyebut}</p>
                                    </div>
                                    <div className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Target Mutu</p>
                                        <p className="text-xl font-black text-sky-600 dark:text-sky-400">
                                            {state.mutu_indikator?.operator == '=' ? '' : state.mutu_indikator?.operator} {state.mutu_indikator?.standar}{state.mutu_indikator?.penyebut}
                                        </p>
                                    </div>
                                </div>
                            </section>
                            
                            {/* Rincian Numerator Denumerator */}
                            <section className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Rincian Perhitungan</p>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">Numerator (N)</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{state.num}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{state.mutu_indikator?.num_name || '-'}</p>
                                    </div>
                                    <div className="w-full h-px bg-slate-100 dark:bg-slate-700"></div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">Denumerator (D)</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{state.denum}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{state.mutu_indikator?.denum_name || '-'}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 rounded-xl">
                                <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shrink-0">
                                    <MapPinIcon className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Unit Terkait</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{state.mutu_indikator?.location?.name || '-'}</p>
                                </div>
                            </section>

                        </div>
                        
                        {/* Footer Actions */}
                        <div className="flex flex-col gap-2.5 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             
                             {/* Tombol PDSA Hanya Muncul Jika Belum Tercapai (Perlu PDSA) */}
                             {!stateIsTercapai && (
                                <button onClick={() => triggerModal(setIsOpenEditDialogFormulirPDSA)} className="flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-blue-500/50">
                                    <DocumentChartBarIcon className="w-4 h-4 mr-2" /> {state.mutu_pdsa ? "Edit Laporan PDSA" : "Buat Laporan PDSA"}
                                </button>
                             )}

                             <div className="grid grid-cols-2 gap-2.5 mt-1">
                                 <button onClick={() => triggerModal(setIsOpenEditDialog)} className="flex items-center justify-center w-full py-2 text-sm font-bold transition-colors border shadow-sm bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30 rounded-xl focus:ring-2 focus:ring-sky-500/50">
                                    <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit Data Mutu
                                 </button>
                                 <button onClick={() => triggerModal(setIsOpenDestroyDialog)} className="flex items-center justify-center w-full py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-[13px] font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-rose-500/50">
                                    <TrashIcon className="w-4 h-4 mr-1.5 opacity-70" /> Hapus Data
                                 </button>
                             </div>

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