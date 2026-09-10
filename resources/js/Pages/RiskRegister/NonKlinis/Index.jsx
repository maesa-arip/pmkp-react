import AnnualYearFilter from "@/Components/AnnualYearFilter";
import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import RiskOccurrenceModal from "@/Components/Modal/RiskOccurrenceModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { 
    XMarkIcon, 
    DocumentTextIcon, 
    ChartBarIcon, 
    UsersIcon, 
    ShieldCheckIcon, 
    DocumentCheckIcon, 
    PlusIcon, 
    MagnifyingGlassIcon,
    ClockIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";

import Create from "./Create";
import Edit from "./Edit";
import EditOSDResidual from "../KlinisOsd2/Edit";
import EditFormulirRCA from "../KlinisFormulirRCA/Edit";
import EditFGDInherent from "../KlinisFGDInherent/Edit";
import EditFGDResidual from "../KlinisFGDResidual/Edit";
import EditFGDTreated from "../KlinisFGDTreated/Edit";
import EditFGDActual from "../KlinisFGDActual/Edit";
import Pagination from "@/Components/Pagination";
import moment from "moment";

// Desain Badge Shadcn (Slate Theme)
const getGradingStyle = (gradingName, color) => {
    if (color) {
        return "text-slate-900 dark:text-white ring-1 ring-inset ring-slate-500/20 dark:ring-white/10";
    }

    switch (gradingName?.toUpperCase()) {
        case "EKSTRIM": 
        case "EXTREME": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-inset ring-red-500/20";
        case "TINGGI": 
        case "HIGH": return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 ring-1 ring-inset ring-orange-500/20";
        case "SEDANG": 
        case "MODERATE": return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 ring-1 ring-inset ring-yellow-500/20";
        case "RENDAH": 
        case "LOW": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20";
        default: return "bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20 dark:ring-white/10";
    }
};

const getGradingColorStyle = (color) => {
    if (!color) return {};

    const hex = String(color).replace("#", "");
    const normalized =
        hex.length === 3
            ? hex.split("").map((char) => `${char}${char}`).join("")
            : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return { backgroundColor: color };
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return { backgroundColor: color, color: luminance > 0.62 ? "#0f172a" : "#ffffff" };
};

const SortIcon = ({ field, currentField, direction }) => {
    const isActive = field === currentField;
    return (
        <svg className={`w-3.5 h-3.5 ml-1.5 transition-colors ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isActive && direction === "desc" 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />}
        </svg>
    );
};

const MiniOSD = ({ d, p, c, total, label }) => (
    <div className="w-full min-w-[140px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 rounded-lg overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 dark:border-slate-700/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex-1 py-1.5 border-r border-slate-200 dark:border-slate-700/80 text-center"><span className="font-medium opacity-70">D:</span> <span className="text-slate-900 dark:text-slate-200">{d || 0}</span></div>
            <div className="flex-1 py-1.5 border-r border-slate-200 dark:border-slate-700/80 text-center"><span className="font-medium opacity-70">P:</span> <span className="text-slate-900 dark:text-slate-200">{p || 0}</span></div>
            <div className="flex-1 py-1.5 text-center"><span className="font-medium opacity-70">C:</span> <span className="text-slate-900 dark:text-slate-200">{c || 0}</span></div>
        </div>
        <div className="px-3 py-2 flex justify-between items-center bg-white dark:bg-[#0f172a]">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{total || 0}</span>
        </div>
    </div>
);

const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
};

export default function Index(props) {
    const { data: riskRegisterKlinis, meta, filtered, attributes } = props.riskRegisterKlinis;
    const { auth } = usePage().props;
    const riskRegisterCount = props.riskRegisterCount;
    const riskRegisterOsd2Count = props.riskRegisterOsd2Count;

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
        proses: [{ id: 1, name: "Mulai" }, { id: 2, name: "Dalam Proses" }, { id: 3, name: "Selesai" }, { id: 4, name: "Ditangani" }],
        type: [{ id: 1, name: "Klinis" }, { id: 2, name: "Non Klinis" }],
        currently: [{ id: 1, name: "Sedang Terjadi" }, { id: 2, name: "Tidak Sedang Terjadi" }],
        pengawasan: [{ id: 1, name: "Sudah dilaksanakan" }, { id: 2, name: "Belum dilaksanakan" }],
        perluPenanganan: [{ id: 1, name: "Ya" }, { id: 2, name: "Tidak" }],
        realisasi: [{ id: 1, name: "Sudah Tercapai" }, { id: 2, name: "Belum Tercapai" }]
    };

    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState({});
    const tableScrollRef = useRef(null);

    // Modals
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenEditDialogOSDResidual, setIsOpenEditDialogOSDResidual] = useState(false);
    const [isOpenEditDialogFormulirRCA, setIsOpenEditDialogFormulirRCA] = useState(false);
    const [isOpenEditDialogFGDInherent, setIsOpenEditDialogFGDInherent] = useState(false);
    const [isOpenEditDialogFGDResidual, setIsOpenEditDialogFGDResidual] = useState(false);
    const [isOpenEditDialogFGDTreated, setIsOpenEditDialogFGDTreated] = useState(false);
    const [isOpenEditDialogFGDActual, setIsOpenEditDialogFGDActual] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenOccurrenceDialog, setIsOpenOccurrenceDialog] = useState(false);

    const isModalOpen = isOpenAddDialog || isOpenEditDialog || isOpenEditDialogOSDResidual || isOpenEditDialogFormulirRCA || isOpenEditDialogFGDInherent || isOpenEditDialogFGDResidual || isOpenEditDialogFGDTreated || isOpenEditDialogFGDActual || isOpenDestroyDialog || isOpenOccurrenceDialog;

    const reload = useCallback(debounce((query) => { router.get(route(route().current()), { ...pickBy(query), page: query.page }, { preserveState: true, preserveScroll: true }); }, 150), []);
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
            setSelectedRow(null); setShowDrawer(false);
        } else {
            setSelectedRow(index); setShowDrawer(true); setState(riskRegisterKlinis[index] || {}); 
        }
    };

    const triggerModal = (setter) => { 
        setShowDrawer(false); 
        setSelectedRow(null); 
        setter(true); 
    };

    const destroyriskregisterklinis1 = () => { router.delete(route("riskRegisterNonKlinis.destroy", state.id), { onSuccess: () => setIsOpenDestroyDialog(false) }); };
    const isRiskOccurring = (item) => Number(item?.currently_id) === 1;
    const statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30";
    const stopPropagation = (e) => e.stopPropagation();
    const scrollTable = (direction) => {
        tableScrollRef.current?.scrollBy({
            left: direction === "right" ? 420 : -420,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Data Risk Register Non Klinis" />
            <AnnualYearFilter value={params.tahun} onChange={tahun => setParams({ ...params, tahun, page: 1 })} />
            
            {/* --- Modals Configuration --- */}
            {isOpenOccurrenceDialog && (
                <RiskOccurrenceModal
                    risk={state}
                    updateRoute="riskRegisterNonKlinis.update"
                    onClose={() => setIsOpenOccurrenceDialog(false)}
                    onRecorded={(page) => setState((risk) =>
                        page.props.riskRegisterKlinis.data.find((item) => item.id === risk.id) || { ...risk, currently_id: 1 }
                    )}
                />
            )}
            <AddModal isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} size="max-w-6xl" title="Tambah Risk Register Non Klinis"><Create ShouldMap={ShouldMap} isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} /></AddModal>
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-6xl" title="Edit Risk Register Non Klinis"><Edit model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogOSDResidual} setIsOpenEditDialog={setIsOpenEditDialogOSDResidual} size="max-w-6xl" title="Edit OSD Residual"><EditOSDResidual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogOSDResidual} setIsOpenEditDialog={setIsOpenEditDialogOSDResidual} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} size="max-w-6xl" title="Edit Formulir RCA"><EditFormulirRCA model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDInherent} setIsOpenEditDialog={setIsOpenEditDialogFGDInherent} size="max-w-6xl" title="Edit FGD Inherent"><EditFGDInherent model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDInherent} setIsOpenEditDialog={setIsOpenEditDialogFGDInherent} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDResidual} setIsOpenEditDialog={setIsOpenEditDialogFGDResidual} size="max-w-6xl" title="Edit FGD Residual"><EditFGDResidual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDResidual} setIsOpenEditDialog={setIsOpenEditDialogFGDResidual} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDTreated} setIsOpenEditDialog={setIsOpenEditDialogFGDTreated} size="max-w-6xl" title="Edit FGD Treated"><EditFGDTreated model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDTreated} setIsOpenEditDialog={setIsOpenEditDialogFGDTreated} /></EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDActual} setIsOpenEditDialog={setIsOpenEditDialogFGDActual} size="max-w-6xl" title="Edit FGD Actual"><EditFGDActual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDActual} setIsOpenEditDialog={setIsOpenEditDialogFGDActual} /></EditModal>
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-md" title="Hapus Risk Register" warning="Tindakan ini tidak dapat dibatalkan."><DangerButton className="w-full ml-2" onClick={destroyriskregisterklinis1}>Hapus Permanen</DangerButton></DestroyModal>

            <div className="flex flex-col gap-6 mx-auto">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Register Non Klinis</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total <span className="font-bold text-slate-900 dark:text-slate-200">{riskRegisterCount}</span> data insiden operasional tercatat.</p>
                        </div>

                        <div className="flex flex-wrap items-center w-full gap-3 md:w-auto">
                            {/* GLOBAL SEARCH & ROWS */}
                            <div className="flex items-center w-full gap-2 md:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold sm:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index} value={page}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 md:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Pencarian Global..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                            <button onClick={() => triggerModal(setIsOpenAddDialog)} className="inline-flex items-center justify-center h-10 px-5 text-sm font-bold text-white transition-colors shadow-sm shrink-0 rounded-xl bg-sky-600 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50">
                                <PlusIcon className="w-4 h-4 mr-2" /> Tambah Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {riskRegisterKlinis.length === 0 && !params.q ? (
                        /* EMPTY STATE */
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <DocumentCheckIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak ada data tercatat</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Mulai tambahkan data risiko operasional non-klinis untuk unit Anda.
                            </p>
                        </div>
                    ) : (
                        /* TABLE DATA */
                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    Geser tabel
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollTable("left")}
                                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
                                    >
                                        <ArrowLeftIcon className="mr-1.5 h-4 w-4" />
                                        Kiri
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollTable("right")}
                                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
                                    >
                                        Kanan
                                        <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div ref={tableScrollRef} className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        {/* KOLOM 1: IDENTITAS (MULTI-SORT) */}
                                        <th className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-[260px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'} align-top`}>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    Identitas Risiko
                                                </span>
                                                <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] py-1 px-1.5 rounded-md border border-slate-200 dark:border-slate-700 w-max shadow-sm" onClick={stopPropagation}>
                                                    <button type="button" onClick={() => sort("kode_risiko")} className="flex items-center text-[9px] font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 px-1 transition-colors outline-none">
                                                        KODE <SortIcon field="kode_risiko" currentField={params.field} direction={params.direction} />
                                                    </button>
                                                    <div className="w-px h-3 bg-slate-200 dark:bg-slate-600"></div>
                                                    <button type="button" onClick={() => sort("tgl_register")} className="flex items-center text-[9px] font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 px-1 transition-colors outline-none">
                                                        TGL <SortIcon field="tgl_register" currentField={params.field} direction={params.direction} />
                                                    </button>
                                                    <div className="w-px h-3 bg-slate-200 dark:bg-slate-600"></div>
                                                    <button type="button" onClick={() => sort("osd1_inherent")} className="flex items-center text-[9px] font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 px-1 transition-colors outline-none">
                                                        GRADE <SortIcon field="osd1_inherent" currentField={params.field} direction={params.direction} />
                                                    </button>
                                                </div>
                                            </div>
                                        </th>

                                        {/* KOLOM 2: KONTEKS RISIKO (SORT) */}
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[300px] max-w-[400px] align-top">
                                            <div className="flex items-center justify-between cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" onClick={() => sort("pernyataan_risiko")}>
                                                <span>Konteks & Sebab Risiko</span>
                                                <SortIcon field="pernyataan_risiko" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>

                                        {/* KOLOM 3: KLASIFIKASI (SORT) */}
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[200px] align-top">
                                            <div className="flex items-center justify-between cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" onClick={() => sort("risk_type_id")}>
                                                <span>Klasifikasi & Efek</span>
                                                <SortIcon field="risk_type_id" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>

                                        {/* KOLOM 4 & 5: INHERENT & RESIDUAL */}
                                        <th className="px-5 py-4 align-top border-b border-r border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Inherent</div>
                                        </th>
                                        <th className="px-5 py-4 align-top border-b border-r border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Residual</div>
                                        </th>

                                        {/* KOLOM 6: PENGENDALIAN & PIC (SORT) */}
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 min-w-[280px] max-w-[340px] align-top">
                                            <div className="flex items-center justify-between cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" onClick={() => sort("pic_id")}>
                                                <span>Tindakan & PIC</span>
                                                <SortIcon field="pic_id" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {riskRegisterKlinis.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const gradingName = item.risk_grading_display_name || "UNRATED";
                                        const gradingStyle = getGradingStyle(gradingName, item.risk_grading_display_color);
                                        const picName = item.pic?.name || "Sistem";
                                        
                                        return (
                                            <tr key={index} onClick={() => onSelectRow(index)} className={`group transition-colors cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                
                                                {/* Col 1 */}
                                                <td className={`px-5 py-5 sticky left-0 bg-clip-padding border-r border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-sky-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} ${isModalOpen || showDrawer ? 'z-0' : 'z-10'} align-top`}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold tracking-tight text-slate-900 dark:text-white">{item.kode_risiko}</span>{item.needs_review && <span className="ml-2 text-xs text-amber-700">Perlu review tahun ini</span>}
                                                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-1.5 py-0.5 rounded">#{meta.from + index}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span style={getGradingColorStyle(item.risk_grading_display_color)} className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${gradingStyle}`}>
                                                                {gradingName}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.is_risiko_lama == 1 ? 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30'}`}>
                                                                {item.is_risiko_lama == 1 ? 'Lama' : 'Baru'}
                                                            </span>
                                                                {isRiskOccurring(item) && (
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusBadgeClass}`}>
                                                                        RISIKO SEDANG TERJADI
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center mt-2">
                                                            <ClockIcon className="w-3.5 h-3.5 mr-1 opacity-70" />
                                                            {moment(item.created_at).format("DD MMM YYYY")}
                                                        </div>
                                                        
                                                        <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                                            <span className="inline-flex items-center text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 px-2 py-1 rounded">
                                                                Kelola Risiko <ArrowRightIcon className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Col 2 */}
                                                <td className="px-5 py-5 whitespace-normal min-w-[300px] max-w-[400px] align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col gap-4 pr-4">
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pernyataan Risiko</span>
                                                            <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed break-words">{item.pernyataan_risiko || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sebab Utama</span>
                                                            <p className="text-[12px] text-slate-600 dark:text-slate-400 line-clamp-2 break-words">{item.sebab || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* Col 3 */}
                                                <td className="px-5 py-5 align-top whitespace-normal min-w-[200px] max-w-[250px] border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col gap-4 pr-4">
                                                        <div>
                                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Jenis / Tipe</span>
                                                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.risk_type?.name || '-'}</div>
                                                            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{item.risk_variety?.name || '-'}</div>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Efek / Dampak</span>
                                                            <p className="text-[12px] text-slate-600 dark:text-slate-400 line-clamp-2 break-words">{item.dampak || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Col 4 & 5 */}
                                                <td className="px-5 py-5 align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <MiniOSD d={item.osd1_dampak} p={item.osd1_probabilitas} c={item.osd1_controllability} total={item.osd1_inherent} label="Inherent" />
                                                </td>
                                                <td className="px-5 py-5 align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <MiniOSD d={item.osd2_dampak} p={item.osd2_probabilitas} c={item.osd2_controllability} total={item.osd2_inherent} label="Residual" />
                                                </td>

                                                {/* Col 6 */}
                                                <td className="px-5 py-5 whitespace-normal min-w-[280px] max-w-[340px] align-top">
                                                    <div className="flex flex-col h-full">
                                                        <div className="pr-4 mb-4">
                                                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Tindakan Pengendalian Eksisting</span>
                                                            <p className="text-[13px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed break-words">{item.pengendalian_risiko || '-'}</p>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                                                            <div className="flex items-center justify-center shrink-0 w-8 h-8 font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-500/10 text-[11px] text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-500/20">
                                                                {getInitials(picName)}
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">PIC / Unit</span>
                                                                <span className="text-xs font-semibold leading-tight truncate text-slate-800 dark:text-slate-200">{picName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end pb-10">
                    <Pagination meta={meta} />
                </div>
            </div>

            {/* ----------------- SHADCN FLOATING DRAWER ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Detail & Aksi Risiko</h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{state.kode_risiko}</p>{state.needs_review && <div className="my-2 rounded bg-amber-50 p-3 text-sm text-amber-900">Hasil copy belum direview. Isi penilaian inherent, lalu <button className="underline" onClick={() => router.post(route('riskRegisterCopy.review', state.id), {}, { onSuccess: () => setState({ ...state, needs_review: false }) })}>tandai sudah direview</button>.</div>}{state.copied_from_risk_register_id && <p className="text-xs">Sumber: register #{state.copied_from_risk_register_id}, tahun {state.copied_from_year}. Evaluasi tahun sumber tetap berada pada register sumber.</p>}
                                {isRiskOccurring(state) && (
                                    <span className={`mt-2 inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold ${statusBadgeClass}`}>
                                        RISIKO SEDANG TERJADI
                                    </span>
                                )}
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            
                            <div className="space-y-4">
                                <section className="p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                                    <label className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block mb-2">Pernyataan Risiko</label>
                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">{state.pernyataan_risiko || '-'}</p>
                                </section>

                                <div className="py-4 border-y border-slate-200 dark:border-slate-800">
                                    <button type="button" onClick={() => setIsOpenOccurrenceDialog(true)} className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-rose-700 transition-colors border border-rose-200 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                                        <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                                        Risiko Sedang Terjadi
                                    </button>
                                </div>

                                <section className="p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1.5">Sebab Utama</h4>
                                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">{state.sebab || '-'}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
                                            <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1.5">Dampak (Efek)</h4>
                                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">{state.dampak || '-'}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
                                            <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2">Tindakan Pengendalian Eksisting</h4>
                                            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0f172a] p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                                                {state.pengendalian_risiko || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="pt-2">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-3 px-1">Penilaian (Scoring) & Evaluasi Lanjutan</h4>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button onClick={() => triggerModal(setIsOpenEditDialogFGDInherent)} className="inline-flex items-center justify-between rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-sky-500/50 text-slate-700 dark:text-slate-300 p-3 shadow-sm">
                                        <span className="flex min-w-0 flex-col items-start gap-2 text-left">
                                            <span>FGD Inherent</span>
                                            <span
                                                style={getGradingColorStyle(state.risk_stage_gradings?.inherent?.color)}
                                                className={`inline-flex max-w-full rounded-md px-2 py-1 text-[10px] font-bold leading-snug break-words ${getGradingStyle(state.risk_stage_gradings?.inherent?.name, state.risk_stage_gradings?.inherent?.color)}`}
                                            >
                                                {state.risk_stage_gradings?.inherent?.name || "Belum dinilai"}
                                            </span>
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-50" />
                                    </button>
                                    <button onClick={() => triggerModal(setIsOpenEditDialogFGDResidual)} className="inline-flex items-center justify-between rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-sky-500/50 text-slate-700 dark:text-slate-300 p-3 shadow-sm">
                                        <span className="flex min-w-0 flex-col items-start gap-2 text-left">
                                            <span>FGD Residual</span>
                                            <span
                                                style={getGradingColorStyle(state.risk_stage_gradings?.residual?.color)}
                                                className={`inline-flex max-w-full rounded-md px-2 py-1 text-[10px] font-bold leading-snug break-words ${getGradingStyle(state.risk_stage_gradings?.residual?.name, state.risk_stage_gradings?.residual?.color)}`}
                                            >
                                                {state.risk_stage_gradings?.residual?.name || "Belum dinilai"}
                                            </span>
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-50" />
                                    </button>
                                    <button onClick={() => triggerModal(setIsOpenEditDialogOSDResidual)} className="inline-flex items-center justify-between rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-sky-500/50 text-slate-700 dark:text-slate-300 p-3 shadow-sm">
                                        <span className="flex min-w-0 flex-col items-start gap-2 text-left">
                                            <span>OSD Residual</span>
                                            <span
                                                style={getGradingColorStyle(state.risk_stage_gradings?.residual?.color)}
                                                className={`inline-flex max-w-full rounded-md px-2 py-1 text-[10px] font-bold leading-snug break-words ${getGradingStyle(state.risk_stage_gradings?.residual?.name, state.risk_stage_gradings?.residual?.color)}`}
                                            >
                                                {state.risk_stage_gradings?.residual?.name || "Belum dinilai"}
                                            </span>
                                        </span>
                                        <span className="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 px-1.5 py-0.5 rounded text-[10px] ml-2">{riskRegisterOsd2Count}</span>
                                    </button>
                                    <button onClick={() => triggerModal(setIsOpenEditDialogFGDTreated)} className="inline-flex items-center justify-between rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-sky-500/50 text-slate-700 dark:text-slate-300 p-3 shadow-sm">
                                        <span className="flex min-w-0 flex-col items-start gap-2 text-left">
                                            <span>FGD Treated</span>
                                            <span
                                                style={getGradingColorStyle(state.risk_stage_gradings?.treated?.color)}
                                                className={`inline-flex max-w-full rounded-md px-2 py-1 text-[10px] font-bold leading-snug break-words ${getGradingStyle(state.risk_stage_gradings?.treated?.name, state.risk_stage_gradings?.treated?.color)}`}
                                            >
                                                {state.risk_stage_gradings?.treated?.name || "Belum dinilai"}
                                            </span>
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-50" />
                                    </button>
                                    <button onClick={() => triggerModal(setIsOpenEditDialogFGDActual)} className="inline-flex items-center justify-between rounded-xl text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:bg-slate-50 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-sky-500/50 text-slate-700 dark:text-slate-300 p-3 shadow-sm">
                                        <span className="flex min-w-0 flex-col items-start gap-2 text-left">
                                            <span>FGD Actual</span>
                                            <span
                                                style={getGradingColorStyle(state.risk_stage_gradings?.actual?.color)}
                                                className={`inline-flex max-w-full rounded-md px-2 py-1 text-[10px] font-bold leading-snug break-words ${getGradingStyle(state.risk_stage_gradings?.actual?.name, state.risk_stage_gradings?.actual?.color)}`}
                                            >
                                                {state.risk_stage_gradings?.actual?.name || "Belum dinilai"}
                                            </span>
                                        </span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 opacity-50" />
                                    </button>
                                    <button onClick={() => triggerModal(setIsOpenEditDialogFormulirRCA)} className="inline-flex items-center justify-between p-3 text-xs font-bold transition-colors border shadow-sm rounded-xl border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400">
                                        Formulir RCA <DocumentTextIcon className="w-4 h-4 ml-2 opacity-70" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end shrink-0 gap-3 p-5 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => triggerModal(setIsOpenDestroyDialog)} className="inline-flex items-center justify-center flex-1 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors bg-white border border-red-200 rounded-xl dark:bg-transparent dark:border-red-500/30 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm dark:shadow-none">
                                Hapus
                             </button>
                             <button onClick={() => triggerModal(setIsOpenEditDialog)} className="inline-flex items-center justify-center flex-1 px-5 py-2.5 text-sm font-bold text-white transition-colors shadow-sm bg-sky-600 rounded-xl hover:bg-sky-700 focus:ring-2 focus:ring-sky-500/50 focus:outline-none">
                                Edit
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
