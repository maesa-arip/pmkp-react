import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { XMarkIcon, DocumentTextIcon, ChartBarIcon, UsersIcon, ShieldCheckIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

// Komponen Halaman (Modals & Views)
import Create from "./Create";
import Edit from "./Edit";
import EditOSDResidual from "../KlinisOsd2/Edit";
import EditFormulirRCA from "../KlinisFormulirRCA/Edit";
import EditFGDInherent from "../KlinisFGDInherent/Edit";
import EditFGDResidual from "../KlinisFGDResidual/Edit";
import EditFGDTreated from "../KlinisFGDTreated/Edit";
import EditFGDActual from "../KlinisFGDActual/Edit";
import Pagination from "@/Components/Pagination";

// ---------------------------------------------------------
// HELPERS & MINI COMPONENTS
// ---------------------------------------------------------

const getGradingStyle = (gradingName) => {
    switch (gradingName) {
        case "Extreme": return { text: "text-red-700 dark:text-red-400", border: "border-red-500", badge: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" };
        case "High": return { text: "text-orange-700 dark:text-orange-400", border: "border-orange-500", badge: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" };
        case "Moderate": return { text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30" };
        case "Low": return { text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500", badge: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30" };
        default: return { text: "text-gray-600 dark:text-zinc-400", border: "border-gray-300 dark:border-zinc-600", badge: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" };
    }
};

const SortIcon = ({ field, currentField, direction }) => {
    const isActive = field === currentField;
    return (
        <svg className={`w-3.5 h-3.5 ml-1 transition-colors ${isActive ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400 dark:text-zinc-600 group-hover:text-gray-600 dark:group-hover:text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isActive && direction === "desc" 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />}
        </svg>
    );
};

const MiniOSD = ({ d, p, c, total, label }) => (
    <div className="w-full min-w-[140px] bg-white dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-md overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-500 dark:text-zinc-500">
            <div className="flex-1 py-1 text-center border-r border-gray-200 dark:border-white/10"><span className="font-normal opacity-70">D:</span> <span className="text-gray-900 dark:text-zinc-200">{d || 0}</span></div>
            <div className="flex-1 py-1 text-center border-r border-gray-200 dark:border-white/10"><span className="font-normal opacity-70">P:</span> <span className="text-gray-900 dark:text-zinc-200">{p || 0}</span></div>
            <div className="flex-1 py-1 text-center"><span className="font-normal opacity-70">C:</span> <span className="text-gray-900 dark:text-zinc-200">{c || 0}</span></div>
        </div>
        <div className="px-2 py-1.5 flex justify-between items-center bg-gray-50 dark:bg-white/[0.02]">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{total || 0}</span>
        </div>
    </div>
);

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

    // States
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState({});

    // Modal States
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenEditDialogOSDResidual, setIsOpenEditDialogOSDResidual] = useState(false);
    const [isOpenEditDialogFormulirRCA, setIsOpenEditDialogFormulirRCA] = useState(false);
    const [isOpenEditDialogFGDInherent, setIsOpenEditDialogFGDInherent] = useState(false);
    const [isOpenEditDialogFGDResidual, setIsOpenEditDialogFGDResidual] = useState(false);
    const [isOpenEditDialogFGDTreated, setIsOpenEditDialogFGDTreated] = useState(false);
    const [isOpenEditDialogFGDActual, setIsOpenEditDialogFGDActual] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);

    const isModalOpen = isOpenAddDialog || isOpenEditDialog || isOpenEditDialogOSDResidual || 
                        isOpenEditDialogFormulirRCA || isOpenEditDialogFGDInherent || 
                        isOpenEditDialogFGDResidual || isOpenEditDialogFGDTreated || 
                        isOpenEditDialogFGDActual || isOpenDestroyDialog;

    // Effects & Handlers
    const reload = useCallback(
        debounce((query) => {
            router.get(route(route().current()), { ...pickBy(query), page: query.page }, { preserveState: true, preserveScroll: true });
        }, 150),
        []
    );

    useEffect(() => {
        if (!isInitialRender) { reload(params); } else { setIsInitialRender(false); }
    }, [params]);

    useEffect(() => {
        let numbers = [];
        for (let i = attributes.per_page; i < attributes.total / attributes.per_page; i = i + attributes.per_page) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, []);

    const onChange = (event) => {
        setParams({ ...params, [event.target.name]: event.target.value, page: 1 });
    };

    const sort = (item) => {
        setParams({ ...params, field: item, direction: params.direction === "asc" ? "desc" : "asc" });
    };

    const onSelectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
            setShowDrawer(false);
        } else {
            setSelectedRow(index);
            setShowDrawer(true);
            setState(riskRegisterKlinis[index] || {}); 
        }
    };

    const triggerModal = (setter) => {
        setShowDrawer(false); 
        setter(true);         
    };

    const destroyriskregisterklinis1 = () => {
        router.delete(route("riskRegisterKlinis.destroy", state.id), { onSuccess: () => setIsOpenDestroyDialog(false) });
    };

    // Data Menu Aksi Drawer
    const drawerActionMenus = [
        { title: "FGD Inherent", desc: "Penilaian awal risiko", icon: <UsersIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogFGDInherent) },
        { title: "FGD Residual", desc: "Penilaian pasca kontrol", icon: <UsersIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogFGDResidual) },
        { title: `OSD Residual (${riskRegisterOsd2Count})`, desc: "Observasi & Simulasi", icon: <ChartBarIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogOSDResidual) },
        { title: "FGD Treated", desc: "Penilaian setelah treat", icon: <ShieldCheckIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogFGDTreated) },
        { title: "FGD Actual", desc: "Penilaian kondisi aktual", icon: <DocumentCheckIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogFGDActual) },
        { title: "Formulir RCA", desc: "Root Cause Analysis", icon: <DocumentTextIcon className="w-5 h-5"/>, action: () => triggerModal(setIsOpenEditDialogFormulirRCA) },
    ];

    return (
        <div className="relative min-h-screen p-0 font-sans text-gray-900 bg-transparent dark:bg-transparent dark:text-zinc-100 sm:p-2">
            <Head title="Risk Register Klinis" />
            
            {/* ----------------- MODALS ----------------- */}
            <AddModal isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} size="max-w-6xl" title={`Tambah Risk Register Klinis ` + auth.user.name}>
                <Create ShouldMap={ShouldMap} isOpenAddDialog={isOpenAddDialog} setIsOpenAddDialog={setIsOpenAddDialog} />
            </AddModal>
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-6xl" title="Edit Risk Register Klinis">
                <Edit model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogOSDResidual} setIsOpenEditDialog={setIsOpenEditDialogOSDResidual} size="max-w-6xl" title="Edit OSD Residual Risk Register Klinis">
                <EditOSDResidual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogOSDResidual} setIsOpenEditDialog={setIsOpenEditDialogOSDResidual} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} size="max-w-6xl" title="Edit Formulir RCA Risk Register Klinis">
                <EditFormulirRCA model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFormulirRCA} setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDInherent} setIsOpenEditDialog={setIsOpenEditDialogFGDInherent} size="max-w-6xl" title="Edit FGD Inherent Risk Register Klinis">
                <EditFGDInherent model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDInherent} setIsOpenEditDialog={setIsOpenEditDialogFGDInherent} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDResidual} setIsOpenEditDialog={setIsOpenEditDialogFGDResidual} size="max-w-6xl" title="Edit FGD Residual Risk Register Klinis">
                <EditFGDResidual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDResidual} setIsOpenEditDialog={setIsOpenEditDialogFGDResidual} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDTreated} setIsOpenEditDialog={setIsOpenEditDialogFGDTreated} size="max-w-6xl" title="Edit FGD Treated Risk Register Klinis">
                <EditFGDTreated model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDTreated} setIsOpenEditDialog={setIsOpenEditDialogFGDTreated} />
            </EditModal>
            <EditModal isOpenEditDialog={isOpenEditDialogFGDActual} setIsOpenEditDialog={setIsOpenEditDialogFGDActual} size="max-w-6xl" title="Edit FGD Actual Risk Register Klinis">
                <EditFGDActual model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialogFGDActual} setIsOpenEditDialog={setIsOpenEditDialogFGDActual} />
            </EditModal>
            <DestroyModal isOpenDestroyDialog={isOpenDestroyDialog} setIsOpenDestroyDialog={setIsOpenDestroyDialog} size="max-w-2xl" title="Delete Risk Register Klinis" warning="Yakin hapus data ini ?">
                <DangerButton className="ml-2" onClick={destroyriskregisterklinis1}>Delete</DangerButton>
            </DestroyModal>

            {/* ----------------- MAIN LAYOUT ----------------- */}
            <div className="flex flex-col gap-4 mx-auto">
                <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Risk Register Klinis</h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Total <span className="font-medium text-gray-900 dark:text-zinc-200">{riskRegisterCount}</span> data tercatat dalam sistem.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center w-full gap-2 md:w-auto">
                                <div className="relative">
                                    <select name="load" onChange={onChange} value={params.load} className="py-2 pl-3 pr-8 text-sm text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-lg focus:bg-white dark:focus:bg-[#09090b] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none outline-none transition-colors">
                                        {pageNumber.map((page, index) => <option key={index} value={page}>{page} Baris</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 pointer-events-none dark:text-zinc-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                                    </div>
                                </div>
                                <div className="relative flex-1 md:w-64">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <input type="text" name="q" autoComplete="off" placeholder="Cari data..." onChange={onChange} value={params.q} className="w-full py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-zinc-200 transition-colors bg-gray-50 dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-lg focus:bg-white dark:focus:bg-[#09090b] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-zinc-500 outline-none" />
                                </div>
                            </div>
                            <button type="button" onClick={() => triggerModal(setIsOpenAddDialog)} className="inline-flex items-center px-4 py-2 text-sm font-bold text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Tambah Risiko
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden relative shadow-sm min-h-[400px]">
                    {riskRegisterKlinis.length === 0 ? (
                        /* EMPTY STATE UI */
                        <div className="flex flex-col items-center justify-center h-full px-4 py-24 text-center">
                            <div className="p-5 mb-4 border border-gray-100 rounded-full bg-gray-50 dark:bg-white/5 dark:border-white/5">
                                <svg className="w-12 h-12 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Belum Ada Data Risiko</h3>
                            <p className="max-w-sm mb-6 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok. Coba ubah kata kunci." : "Mulai tambahkan data risiko operasional klinis baru untuk memantau dan mengelola mitigasi di unit Anda."}
                            </p>
                            {!params.q && (
                                <button type="button" onClick={() => triggerModal(setIsOpenAddDialog)} className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white transition-colors bg-gray-900 dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-gray-800 focus:outline-none">
                                    Tambah Risiko Pertama
                                </button>
                            )}
                        </div>
                    ) : (
                        /* TABLE UI */
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-gray-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-5 py-4 sticky left-0 bg-gray-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-gray-200 dark:border-white/10 w-[260px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen ? 'z-0' : 'z-20'}`}>
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Identitas & Status</div>
                                        </th>
                                        <th className="px-5 py-4 min-w-[300px] max-w-[400px] border-b border-gray-200 dark:border-white/10">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest cursor-pointer group flex items-center hover:text-gray-800 dark:hover:text-zinc-300 transition-colors" onClick={() => sort("pernyataan_risiko")}>
                                                Konteks Risiko <SortIcon field="pernyataan_risiko" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 min-w-[200px] border-b border-gray-200 dark:border-white/10">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest cursor-pointer group flex items-center hover:text-gray-800 dark:hover:text-zinc-300 transition-colors" onClick={() => sort("risk_type_id")}>
                                                Klasifikasi <SortIcon field="risk_type_id" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-l border-gray-200 dark:border-white/10">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest text-center">Inherent</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-l border-gray-200 dark:border-white/10">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest text-center">Residual</div>
                                        </th>
                                        <th className="px-5 py-4 min-w-[280px] max-w-[340px] border-b border-l border-gray-200 dark:border-white/10">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest cursor-pointer group flex items-center hover:text-gray-800 dark:hover:text-zinc-300 transition-colors" onClick={() => sort("pengendalian_risiko")}>
                                                Pengendalian & PIC <SortIcon field="pengendalian_risiko" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskRegisterKlinis.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const style = getGradingStyle(item.riskgrading?.name);
                                        
                                        return (
                                            <tr key={index} onClick={() => onSelectRow(index)} className={`group align-top transition-colors duration-200 cursor-pointer ${isSelected ? "bg-blue-50/60 dark:bg-[#202024]" : "bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-[#1c1c1f]"}`}>
                                                <td className={`px-5 py-5 sticky left-0 bg-clip-padding border-b border-r border-gray-200 dark:border-white/10 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-blue-50 dark:bg-[#202024]" : "bg-white dark:bg-[#18181b] group-hover:bg-gray-50 dark:group-hover:bg-[#1c1c1f]"} ${isModalOpen ? 'z-0' : 'z-10'}`}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <span className="font-bold text-gray-900 dark:text-white">{item.kode_risiko}</span>
                                                        <span className="text-[10px] font-medium text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">#{meta.from + index}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${style.badge} ${style.text}`}>{item.riskgrading?.name || "Unrated"}</span>
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${item.is_risiko_lama == 1 ? 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-white/10' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'}`}>{item.is_risiko_lama == 1 ? 'Lama' : 'Baru'}</span>
                                                    </div>
                                                    <div className="text-[11px] font-medium text-gray-500 dark:text-zinc-500 flex items-center">
                                                        <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {item.tgl_register}
                                                    </div>
                                                    <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                                        <span className="inline-flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-2 py-1 rounded">Lihat detail & kelola <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 min-w-[300px] max-w-[400px] border-b border-gray-200 dark:border-white/10">
                                                    <div className="mb-4">
                                                        <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Pernyataan Risiko</span>
                                                        <p className="text-sm font-medium leading-relaxed text-gray-800 break-words whitespace-normal dark:text-zinc-200 line-clamp-2">{item.pernyataan_risiko || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Sebab Utama</span>
                                                        <p className="text-[13px] text-gray-600 dark:text-zinc-400 line-clamp-1 whitespace-normal break-words">{item.sebab || '-'}</p>
                                                    </div>
                                                </td>
                                                
                                                <td className="px-5 py-5 min-w-[200px] border-b border-gray-200 dark:border-white/10">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Jenis / Tipe</span>
                                                            <div className="text-sm font-semibold text-gray-800 break-words whitespace-normal dark:text-zinc-200">{item.risk_type?.name || '-'}</div>
                                                            <div className="text-[11px] font-medium text-gray-500 dark:text-zinc-500 mt-1 whitespace-normal break-words">{item.risk_variety?.name || '-'}</div>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Efek/Dampak</span>
                                                            <p className="text-[13px] text-gray-600 dark:text-zinc-400 line-clamp-2 whitespace-normal break-words">{item.dampak || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 align-middle border-b border-l border-gray-200 dark:border-white/10"><MiniOSD d={item.osd1_dampak} p={item.osd1_probabilitas} c={item.osd1_controllability} total={item.osd1_inherent} label="Inherent" /></td>
                                                <td className="px-5 py-5 align-middle border-b border-l border-gray-200 dark:border-white/10"><MiniOSD d={item.osd2_dampak} p={item.osd2_probabilitas} c={item.osd2_controllability} total={item.osd2_inherent} label="Residual" /></td>

                                                <td className="px-5 py-5 min-w-[280px] max-w-[340px] border-b border-l border-gray-200 dark:border-white/10">
                                                    <div className="mb-4">
                                                        <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Tindakan Pengendalian</span>
                                                        <p className="text-[13px] text-gray-700 dark:text-zinc-300 line-clamp-2 leading-relaxed whitespace-normal break-words">{item.pengendalian_risiko || '-'}</p>
                                                    </div>
                                                    <div className="flex items-center pt-4 mt-auto border-t border-gray-200 dark:border-white/10">
                                                        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#27272a] text-gray-600 dark:text-zinc-300 font-bold text-[11px] mr-3 border border-gray-200 dark:border-white/10">
                                                            {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div className="w-full break-words whitespace-normal">
                                                            <span className="block text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Pemilik Risiko (PIC)</span>
                                                            <span className="text-sm font-bold text-gray-800 dark:text-zinc-200">{item.user?.name || '-'}</span>
                                                        </div>
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
                
                <div className="flex justify-end pt-2 pb-10">
                    <Pagination meta={meta} />
                </div>
            </div>

            {/* ----------------- SIDE DRAWER (MASTER-DETAIL VIEW) ----------------- */}
            {showDrawer && state?.id && (
                <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[500px] bg-white dark:bg-[#18181b] shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] z-40 border-l border-gray-200 dark:border-white/10 animate-slide-in flex flex-col">
                    
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#09090b]/80 backdrop-blur-sm">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Risiko & Tindakan</h3>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mt-0.5">{state.kode_risiko}</p>
                        </div>
                        <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors bg-white border border-gray-200 rounded-full shadow-sm dark:bg-white/5 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none dark:shadow-none">
                            <XMarkIcon className="w-4 h-4 text-gray-600 dark:text-zinc-300" />
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-7 custom-scrollbar">
                        <section>
                            <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-widest block mb-2 border-b border-gray-100 dark:border-white/5 pb-2">Pernyataan Risiko</label>
                            <p className="text-gray-800 dark:text-zinc-200 leading-relaxed text-[13px] whitespace-pre-wrap">{state.pernyataan_risiko || '-'}</p>
                        </section>
                        <section>
                            <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-widest block mb-2 border-b border-gray-100 dark:border-white/5 pb-2">Sebab Utama</label>
                            <p className="text-gray-800 dark:text-zinc-200 leading-relaxed text-[13px] whitespace-pre-wrap">{state.sebab || '-'}</p>
                        </section>
                        <section>
                            <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-widest block mb-2 border-b border-gray-100 dark:border-white/5 pb-2">Efek / Dampak</label>
                            <p className="text-gray-800 dark:text-zinc-200 leading-relaxed text-[13px] whitespace-pre-wrap">{state.dampak || '-'}</p>
                        </section>
                        <section className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/10">
                            <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-widest block mb-2">Tindakan Pengendalian</label>
                            <p className="text-gray-800 dark:text-zinc-200 leading-relaxed text-[13px] whitespace-pre-wrap">{state.pengendalian_risiko || '-'}</p>
                        </section>

                        <section className="pt-4 border-t border-gray-200 dark:border-white/10">
                            <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-500 tracking-widest block mb-4">Aksi Lanjutan & Formulir</label>
                            
                            {/* MENU ACTION LIST - Desain Hirarki Visual UX */}
                            <div className="flex flex-col gap-2">
                                {drawerActionMenus.map((menu, idx) => (
                                    <button key={idx} onClick={menu.action} className="flex items-center justify-between w-full p-3 text-left transition-colors border border-transparent rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10 group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 text-blue-600 transition-colors rounded-lg bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20">
                                                {menu.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{menu.title}</h4>
                                                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{menu.desc}</p>
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 transition-colors dark:text-zinc-600 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                    
                    <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#09090b] grid grid-cols-2 gap-3 shrink-0">
                         <button onClick={() => triggerModal(setIsOpenEditDialog)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg transition-colors shadow-sm">
                            Edit General
                         </button>
                         <button onClick={() => triggerModal(setIsOpenDestroyDialog)} className="w-full py-2.5 bg-white dark:bg-transparent text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shadow-sm dark:shadow-none">
                            Hapus Data
                         </button>
                    </div>
                </div>
            )}

            {/* Overlay z-30 */}
            {showDrawer && (
                <div onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="fixed inset-0 bg-gray-900/20 dark:bg-black/40 z-30 backdrop-blur-[2px] animate-fade-in"></div>
            )}

            <style jsx>{`
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1); }
                .animate-fade-in { animation: fadeIn 0.2s ease-out; }
                
                .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
            `}</style>
        </div>
    );
}

Index.layout = (page) => <App children={page} />;