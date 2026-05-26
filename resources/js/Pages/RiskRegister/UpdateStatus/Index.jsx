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
    ClockIcon, 
    CheckBadgeIcon, 
    InboxIcon, 
    MagnifyingGlassIcon,
    ExclamationCircleIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

import Edit from "./Edit"; 
import EditStatus from "../RequestUpdateStatus/Edit"; 
import Pagination from "@/Components/Pagination";
import moment from "moment";

// Helper: Badge Grading Shadcn Theme
const getGradingStyle = (gradingName) => {
    switch (gradingName?.toUpperCase()) {
        case "EKSTRIM": 
        case "EXTREME": return { text: "text-red-700 dark:text-red-400", badge: "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30" };
        case "TINGGI": 
        case "HIGH": return { text: "text-orange-700 dark:text-orange-400", badge: "bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30" };
        case "SEDANG": 
        case "MODERATE": return { text: "text-yellow-700 dark:text-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30" };
        case "RENDAH": 
        case "LOW": return { text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30" };
        default: return { text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10" };
    }
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

export default function Index(props) {
    const { data: riskRegisterKlinis, meta, filtered, attributes } = props.riskRegisterKlinis;
    const { auth } = usePage().props;
    
    let ShouldMap = { 
        riskCategories: props.riskCategories,
        identificationSources: props.identificationSources,
        locations: props.locations,
        riskVarieties: props.riskVarieties,
        riskTypes: props.riskTypes,
        pics: props.pics,
        impactValues: props.impactValues,
        probabilityValues: props.probabilityValues,
        controlValues: props.controlValues,
        indikatorFitur04s: props.indikatorFitur04s,
        currently: [{ id: 1, name: "Sedang Terjadi" }, { id: 2, name: "Tidak Sedang Terjadi" }],
    };

    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState({});

    // Modals
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false); 
    const [isOpenRequestUpdateStatus, setIsOpenRequestUpdateStatus] = useState(false); 

    const isModalOpen = isOpenEditDialog || isOpenRequestUpdateStatus;

    const reload = useCallback(
        debounce((query) => {
            router.get(route("requeststatus"), { ...pickBy(query), page: query.page }, { preserveState: true, preserveScroll: true });
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
            setState(riskRegisterKlinis[index] || {});
        }
    };

    const triggerModal = (setter) => {
        setShowDrawer(false);
        setter(true);
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Verifikasi Status Risiko" />
            
            {/* --- MODALS --- */}
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-4xl" title="Verifikasi Update Status">
                <Edit model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>
            
            <EditModal isOpenEditDialog={isOpenRequestUpdateStatus} setIsOpenEditDialog={setIsOpenRequestUpdateStatus} size="max-w-6xl" title="Detail Request Status">
                <EditStatus model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenRequestUpdateStatus} setIsOpenEditDialog={setIsOpenRequestUpdateStatus} />
            </EditModal>

            <div className="mx-auto flex flex-col gap-6 max-w-[1500px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Verifikasi Status Risiko</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pantau dan verifikasi laporan perbaikan dari penanggung jawab.</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center w-full gap-2 md:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold sm:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 md:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input 
                                        type="text" 
                                        name="q" 
                                        placeholder="Cari data..." 
                                        onChange={onChange} 
                                        value={params.q || ''} 
                                        className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    
                    {riskRegisterKlinis.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <InboxIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak Ada Data Verifikasi</h3>
                            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Belum ada risiko yang memerlukan verifikasi update status saat ini."}
                            </p>
                        </div>
                    ) : (
                        /* TABLE DATA */
                        <div className="relative z-10 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-[260px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'} align-top`}>
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Identitas & Status</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 min-w-[300px] max-w-[400px] align-top border-r">
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-max" onClick={() => sort("pernyataan_risiko")}>
                                                Konteks Risiko <SortIcon field="pernyataan_risiko" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 w-[200px] align-top border-r">
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status Verifikasi</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 min-w-[280px] max-w-[340px] align-top">
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-max" onClick={() => sort("pic_id")}>
                                                Laporan Perbaikan & PIC <SortIcon field="pic_id" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {riskRegisterKlinis.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const hasUpdate = !!item.requestupdate;
                                        const isApproved = hasUpdate && item.requestupdate.is_approved == 1;
                                        const gradingName = item.riskgrading?.name_nonklinis_pergub || item.riskgrading?.name || "UNRATED";
                                        const style = getGradingStyle(gradingName);
                                        
                                        return (
                                            <tr key={index} onClick={() => onSelectRow(index)} className={`group align-top transition-colors duration-200 cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                
                                                {/* KOLOM 1: IDENTITAS */}
                                                <td className={`px-5 py-5 sticky left-0 bg-clip-padding border-r border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-sky-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} ${isModalOpen || showDrawer ? 'z-0' : 'z-10'}`}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold tracking-tight text-slate-900 dark:text-white">{item.kode_risiko}</span>
                                                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-1.5 py-0.5 rounded">#{meta.from + index}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${style.badge} ${style.text}`}>
                                                                {gradingName}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.is_risiko_lama == 1 ? 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30'}`}>
                                                                {item.is_risiko_lama == 1 ? 'Lama' : 'Baru'}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center mt-2">
                                                            <ClockIcon className="w-3.5 h-3.5 mr-1 opacity-70" />
                                                            {moment(item.created_at).format("DD MMM YYYY")}
                                                        </div>
                                                        
                                                        <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                                            <span className="inline-flex items-center text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 px-2 py-1 rounded">
                                                                Tinjau Verifikasi <ArrowRightIcon className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* KOLOM 2: KONTEKS RISIKO */}
                                                <td className="px-5 py-5 max-w-[400px] whitespace-normal border-r border-slate-100 dark:border-slate-800/80 align-top">
                                                    <div className="pr-4 mb-4">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pernyataan Risiko</span>
                                                        <p className="text-[13px] font-medium leading-relaxed break-words text-slate-800 dark:text-slate-200 line-clamp-3">{item.pernyataan_risiko || '-'}</p>
                                                    </div>
                                                    <div className="pr-4">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Akar Masalah</span>
                                                        <p className="text-[12px] text-slate-600 dark:text-slate-400 line-clamp-2 break-words">{item.sebab || '-'}</p>
                                                    </div>
                                                </td>

                                                {/* KOLOM 3: STATUS VERIFIKASI */}
                                                <td className="px-5 py-5 text-center align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Status Akhir</span>
                                                            {isApproved ? (
                                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-black tracking-widest uppercase rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">Verifikasi Selesai</span>
                                                            ) : hasUpdate ? (
                                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-black tracking-widest uppercase rounded bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30">Perlu Verifikasi</span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-0.5 text-[10px] font-black tracking-widest uppercase rounded bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">Belum Ada Laporan</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Update Terakhir</span>
                                                            {isApproved ? (
                                                                <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{item.requestupdate.tgl_update_status}</span>
                                                            ) : (
                                                                <span className="text-[13px] italic text-slate-400 dark:text-slate-500">-</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* KOLOM 4: LAPORAN PERBAIKAN & PIC */}
                                                <td className="px-5 py-5 min-w-[280px] max-w-[340px] whitespace-normal flex flex-col h-full border-l border-slate-200 dark:border-slate-800/80">
                                                    <div className="pr-4 mb-4">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Upaya Perbaikan (Dari PIC)</span>
                                                        {hasUpdate ? (
                                                            <>
                                                                <p className="text-[13px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed break-words mb-1">
                                                                    {item.requestupdate.upaya_pengendalian}
                                                                </p>
                                                                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Tgl Lapor: {item.requestupdate.tgl_perbaikan}</span>
                                                            </>
                                                        ) : (
                                                            <p className="text-[13px] text-slate-400 dark:text-slate-500 italic">Belum ada laporan upaya perbaikan.</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                                                        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-[11px] mr-3 ring-1 ring-blue-200 dark:ring-blue-500/20 uppercase">
                                                            {item.pic?.name ? item.pic.name.charAt(0) : '?'}
                                                        </div>
                                                        <div className="w-full break-words whitespace-normal">
                                                            <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">Penanggung Jawab (PIC)</span>
                                                            <span className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-200">{item.pic?.name || '-'}</span>
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
                
                <div className="flex justify-end pb-10">
                    <Pagination meta={meta} />
                </div>
            </div>

            {/* ----------------- FLOATING SIDE DRAWER (MASTER-DETAIL VIEW) ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-30 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 w-[calc(100%-1rem)] sm:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl z-40 rounded-2xl border border-slate-200 dark:border-slate-800 animate-slide-in flex flex-col overflow-hidden">
                        
                        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Status & History</h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{state.kode_risiko}</p>
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors border border-transparent rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            
                            <section className="p-5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-500"></div>
                                <label className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block mb-2 pl-2">Konteks Pernyataan Risiko</label>
                                <p className="pl-2 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">{state.pernyataan_risiko || '-'}</p>
                                <div className="pt-3 mt-3 ml-2 text-xs border-t border-slate-100 dark:border-slate-700/80">
                                    <span className="font-bold text-slate-600 dark:text-slate-400">Sebab:</span> <span className="text-slate-800 dark:text-slate-200">{state.sebab || "-"}</span>
                                </div>
                            </section>
                            
                            <section>
                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-800 pb-2 px-1">Status Penanganan Terakhir</label>
                                {state.requestupdate ? (
                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Tgl Dilaporkan</span>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{state.requestupdate.tgl_perbaikan || "-"}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Jam Pengerjaan</span>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{state.requestupdate.jam_perbaikan || "-"}</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">Upaya Pengendalian Aktual</span>
                                            <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                                                {state.requestupdate.upaya_pengendalian || "-"}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 px-6 bg-white dark:bg-[#1e293b] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm text-center">
                                        <div className="flex items-center justify-center w-12 h-12 mb-3 border rounded-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                                            <ClockIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                        </div>
                                        <p className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Menunggu Laporan PIC</p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Penanggung jawab belum mengirimkan detail perbaikan.</p>
                                    </div>
                                )}
                            </section>
                        </div>
                        
                        <div className="flex flex-col gap-3 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => triggerModal(setIsOpenRequestUpdateStatus)} className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl transition-colors shadow-sm">
                                <ClockIcon className="w-4 h-4 mr-2 opacity-70" /> Lihat Detail Laporan
                             </button>
                             <button onClick={() => triggerModal(setIsOpenEditDialog)} className="flex items-center justify-center w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!state.requestupdate}>
                                <CheckBadgeIcon className="w-4 h-4 mr-2" /> Verifikasi Status Laporan
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