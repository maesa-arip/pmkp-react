import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import EditFormulirRCA from "../RiskRegister/KlinisFormulirRCA/Edit";
import Pagination from "@/Components/Pagination";
import moment from "moment";
import "moment/locale/id";
import { 
    MagnifyingGlassIcon,
    ShieldExclamationIcon,
    XMarkIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    DocumentMagnifyingGlassIcon,
    ClockIcon
} from "@heroicons/react/24/outline";

// Helper: Badge Grading Shadcn Theme
const getGradingStyle = (gradingName) => {
    switch (gradingName?.toUpperCase()) {
        case "EKSTRIM": 
        case "SANGAT TINGGI": 
        case "EXTREME": return { text: "text-rose-700 dark:text-rose-400", badge: "bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30" };
        case "TINGGI": 
        case "HIGH": return { text: "text-orange-700 dark:text-orange-400", badge: "bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30" };
        case "SEDANG": 
        case "MODERATE": return { text: "text-yellow-700 dark:text-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30" };
        case "RENDAH": 
        case "LOW": return { text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30" };
        default: return { text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10" };
    }
};

const UpIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
);
const DownIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
);

export default function RisikoPrioritas(props) {
    const {
        data: riskRegisterKlinis,
        meta,
        filtered,
        attributes,
    } = props.riskRegisterKlinis;
    const { auth } = usePage().props;
    const riskRegisterCount = props.riskRegisterCount;
    
    let ShouldMap = {
        riskCategories: props.riskCategories,
        identificationSources: props.identificationSources,
        locations: props.locations,
        riskVarieties: props.riskVarieties,
        riskTypes: props.riskTypes,
        jenisSebabs: props.jenisSebabs,
        opsiPengendalian: props.opsiPengendalian,
        pembiayaanRisiko: props.pembiayaanRisiko,
        efektif: props.efektif,
        jenisPengendalian: props.jenisPengendalian,
        waktuPengendalian: props.waktuPengendalian,
        waktuImplementasi: props.waktuImplementasi,
        pics: props.pics,
        impactValues: props.impactValues,
        probabilityValues: props.probabilityValues,
        controlValues: props.controlValues,
        indikatorFitur4s: props.indikatorFitur4s,
        proses: [
            { id: 1, name: "Mulai" }, { id: 2, name: "Dalam Proses" }, { id: 3, name: "Selesai" }, { id: 4, name: "Ditangani" }
        ],
        type: [
            { id: 1, name: "Klinis" }, { id: 2, name: "Non Klinis" }
        ],
        currently: [
            { id: 1, name: "Sedang Terjadi" }, { id: 2, name: "Tidak Sedang Terjadi" }
        ],
        pengawasan: [
            { id: 1, name: "Sudah dilaksanakan" }, { id: 2, name: "Belum dilaksanakan" }
        ],
        perluPenanganan: [
            { id: 1, name: "Ya" }, { id: 2, name: "Tidak" }
        ],
        realisasi: [
            { id: 1, name: "Sudah Tercapai" }, { id: 2, name: "Belum Tercapai" }
        ],
    };

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

    // States & Modals UI
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState([]);
    
    const [isOpenEditDialogFormulirRCA, setIsOpenEditDialogFormulirRCA] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id) => setOpenDropdownId(openDropdownId === id ? null : id);
    
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const selectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
            setShowDrawer(false);
        } else {
            setSelectedRow(index);
            setState(riskRegisterKlinis[index] || {});
            setShowDrawer(true);
        }
    };

    const openEditDialogFormulirRCA = (row) => { setState(row); setIsOpenEditDialogFormulirRCA(true); setShowDrawer(false); };
    const openDestroyDialog = (row) => { setState(row); setIsOpenDestroyDialog(true); setShowDrawer(false); };

    const destroyriskregisterklinis1 = () => {
        router.delete(route("riskRegisterKlinis.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Risiko Prioritas (RCA)" />
            
            {/* --- MODALS --- */}
            <EditModal isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} size="max-w-6xl" title="Formulir RCA (Root Cause Analysis)">
                <EditFormulirRCA model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} />
            </EditModal>
            
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-md" title="Hapus Data Risiko" warning="Yakin ingin menghapus data insiden prioritas ini secara permanen?">
                <DangerButton className="w-full ml-2" onClick={destroyriskregisterklinis1}>Hapus Permanen</DangerButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center px-2.5 py-1 mb-2 text-[10px] font-black tracking-widest uppercase rounded-md bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                                RISIKO PRIORITAS ({riskRegisterCount})
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Risiko Prioritas (RCA)</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Daftar insiden berisiko tinggi yang memerlukan analisis akar masalah (Root Cause Analysis).</p>
                        </div>

                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold lg:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Cari data insiden..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {riskRegisterKlinis.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <ShieldExclamationIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Risiko Prioritas</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Belum ada laporan insiden berisiko tinggi yang terdaftar saat ini."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 w-12 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest sticky left-0 z-20 bg-slate-50 dark:bg-[#09090b]">#</th>
                                        <th className="w-32 px-5 py-4 transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => sort("tgl_register")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Tgl Register
                                                {params.field == "tgl_register" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "tgl_register" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-36">
                                            Status & Grading
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors max-w-[300px]" onClick={() => sort("pernyataan_risiko")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Konteks Risiko
                                                {params.field == "pernyataan_risiko" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "pernyataan_risiko" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        {/* Kumpulan Data Evaluasi */}
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">OSD 1 (Awal)</th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">OSD 2 (Residu)</th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors max-w-[250px]" onClick={() => sort("pengendalian_risiko")}>
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Pengendalian & PIC
                                                {params.field == "pengendalian_risiko" && params.direction == "asc" && <UpIcon />}
                                                {params.field == "pengendalian_risiko" && params.direction == "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-20">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {riskRegisterKlinis.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const gradingName = item.riskgrading?.name_bpkp || "UNRATED";
                                        const style = getGradingStyle(gradingName);
                                        
                                        // Status Verifikasi (Jika ada)
                                        const verifikasiName = item.verificationpriorityadmin?.keterangan || 'Belum Verifikasi';
                                        
                                        return (
                                            <tr 
                                                key={index} 
                                                onClick={() => selectRow(index)} 
                                                className={`group transition-colors cursor-pointer ${isSelected ? "bg-rose-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}
                                            >
                                                <td className={`px-5 py-4 text-center border-r border-slate-100 dark:border-slate-800/80 align-middle sticky left-0 bg-clip-padding ${isSelected ? "bg-rose-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] z-10`}>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                        {meta.from + index}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 align-top border-r border-slate-100 dark:border-slate-800/80 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                        {moment(item.tgl_register).format("DD MMM YYYY")}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-center align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className={`inline-flex px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${style.badge} ${style.text}`}>
                                                            {gradingName}
                                                        </span>
                                                        <span className={`inline-flex px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${verifikasiName === 'Belum Verifikasi' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'}`}>
                                                            {verifikasiName}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 border-r border-slate-100 dark:border-slate-800/80 align-top whitespace-normal max-w-[300px]">
                                                    <div className="mb-2">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pernyataan</span>
                                                        <p className="text-[13px] font-medium leading-relaxed text-slate-800 break-words dark:text-slate-200 line-clamp-2">{item.pernyataan_risiko || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sebab & Tipe</span>
                                                        <p className="text-xs break-words text-slate-600 dark:text-slate-400 line-clamp-1">{item.sebab || '-'} ({item.risk_type?.name})</p>
                                                    </div>
                                                </td>

                                                {/* Kolom OSD 1 */}
                                                <td className="px-5 py-4 text-center align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex gap-2">
                                                            <span>D:{item.osd1_dampak || 0}</span>
                                                            <span>P:{item.osd1_probabilitas || 0}</span>
                                                            <span>C:{item.osd1_controllability || 0}</span>
                                                        </div>
                                                        <div className="px-3 py-1 text-sm font-black border rounded-md text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                            Skor: {item.osd1_inherent || 0}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Kolom OSD 2 */}
                                                <td className="px-5 py-4 text-center align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex gap-2">
                                                            <span>D:{item.osd2_dampak || 0}</span>
                                                            <span>P:{item.osd2_probabilitas || 0}</span>
                                                            <span>C:{item.osd2_controllability || 0}</span>
                                                        </div>
                                                        <div className="px-3 py-1 text-sm font-black border rounded-md text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                                            Skor: {item.osd2_inherent || 0}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 border-r border-slate-100 dark:border-slate-800/80 align-top whitespace-normal max-w-[250px]">
                                                    <div className="mb-2">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tindakan</span>
                                                        <p className="text-[12px] font-medium leading-relaxed text-slate-800 break-words dark:text-slate-300 line-clamp-2">{item.pengendalian_risiko || '-'}</p>
                                                    </div>
                                                    <div className="pt-2 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">PIC</span>
                                                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400">{item.user?.name || '-'}</span>
                                                    </div>
                                                </td>
                                                
                                                {/* ACTION DROPDOWN */}
                                                <td className="px-5 py-4 text-center align-top">
                                                    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => toggleDropdown(item.id)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        
                                                        {openDropdownId === item.id && (
                                                            <div className="absolute right-0 z-[100] w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                <div className="py-1">
                                                                    <button onClick={() => { openEditDialogFormulirRCA(item); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:text-rose-400 group">
                                                                        <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Formulir RCA
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button onClick={() => { openDestroyDialog(item); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group">
                                                                        <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Hapus Data
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

            {/* ----------------- FLOATING SIDE DRAWER (MASTER-DETAIL VIEW) ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Detail Risiko Prioritas</h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{state.kode_risiko || `ID: ${state.id}`}</p>
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            
                            <section className="p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-500"></div>
                                <label className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-widest block mb-2 pl-2">Konteks Pernyataan Risiko</label>
                                <p className="pl-2 text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">{state.pernyataan_risiko || '-'}</p>
                            </section>

                            <section className="p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest block mb-3 border-b border-slate-100 dark:border-slate-700/80 pb-2">Status & Pengendalian</label>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Upaya Pengendalian (PIC)</span>
                                        <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-300">
                                            {state.pengendalian_risiko || <span className="italic text-slate-400">Belum ada.</span>}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-700/80">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">PIC Terkait</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {state.user?.name || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        
                        <div className="flex flex-col gap-3 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => openEditDialogFormulirRCA(state)} className="flex items-center justify-center w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-rose-500/50">
                                <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" /> Isi Formulir RCA
                             </button>
                             <button onClick={() => openDestroyDialog(state)} className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-sm font-bold rounded-xl transition-colors shadow-sm dark:shadow-none">
                                <TrashIcon className="w-4 h-4 mr-2 opacity-70" /> Hapus Data
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

RisikoPrioritas.layout = (page) => <App children={page} />;