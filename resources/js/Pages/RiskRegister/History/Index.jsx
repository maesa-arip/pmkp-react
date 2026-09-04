import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import { 
    XMarkIcon, 
    ClockIcon, 
    PencilSquareIcon,
    MagnifyingGlassIcon,
    DocumentCheckIcon,
    EllipsisVerticalIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Import Komponen Detail/Edit
import Edit from "./Edit"; 
import EditStatus from "../RequestUpdateStatus/Edit"; 
import Pagination from "@/Components/Pagination";

// Helper: Badge Status Grading (Shadcn Theme)
const getGradingStyle = (gradingName) => {
    switch (gradingName?.toUpperCase()) {
        case "EKSTRIM": 
        case "EXTREME": return { text: "text-rose-700 dark:text-rose-400", badge: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30" };
        case "TINGGI": 
        case "HIGH": return { text: "text-orange-700 dark:text-orange-400", badge: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" };
        case "SEDANG": 
        case "MODERATE": return { text: "text-yellow-700 dark:text-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30" };
        case "RENDAH": 
        case "LOW": return { text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30" };
        default: return { text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" };
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
        proses: [{ id: 1, name: "Mulai" }, { id: 2, name: "Dalam Proses" }, { id: 3, name: "Selesai" }, { id: 4, name: "Ditangani" }],
        type: [{ id: 1, name: "Klinis" }, { id: 2, name: "Non Klinis" }],
        currently: [{ id: 1, name: "Sedang Terjadi" }, { id: 2, name: "Tidak Sedang Terjadi" }],
        pengawasan: [{ id: 1, name: "Sudah dilaksanakan" }, { id: 2, name: "Belum dilaksanakan" }],
    };

    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [state, setState] = useState({});

    // Modals & Dropdown
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false); 
    const [isOpenRequestUpdateStatus, setIsOpenRequestUpdateStatus] = useState(false); 
    
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id) => setOpenDropdownId(openDropdownId === id ? null : id);
    
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const isModalOpen = isOpenEditDialog || isOpenRequestUpdateStatus;

    const reload = useCallback(
        debounce((query) => {
            router.get(route("notifications"), { ...pickBy(query), page: query.page }, { preserveState: true, preserveScroll: true });
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

    const triggerModal = (setter, row = state) => {
        setState(row);
        setShowDrawer(false);
        setter(true);
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Riwayat & Notifikasi" />
            
            {/* --- MODALS --- */}
            <EditModal isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} size="max-w-4xl" title="Riwayat Penanganan Risiko">
                <Edit model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenEditDialog} setIsOpenEditDialog={setIsOpenEditDialog} />
            </EditModal>
            
            <EditModal isOpenEditDialog={isOpenRequestUpdateStatus} setIsOpenEditDialog={setIsOpenRequestUpdateStatus} size="max-w-6xl" title="Update Status Penanganan">
                <EditStatus model={state} ShouldMap={ShouldMap} isOpenEditDialog={isOpenRequestUpdateStatus} setIsOpenEditDialog={setIsOpenRequestUpdateStatus} />
            </EditModal>

            <div className="mx-auto flex flex-col gap-6 max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Riwayat & Notifikasi Risiko</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pantau linimasa riwayat dan pembaruan status penanganan risiko operasional.</p>
                        </div>
                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold sm:block text-slate-500">Tampilkan:</span>
                                <select name="load" onChange={onChange} value={params.load} className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm">
                                    {pageNumber.map((page, index) => <option key={index}>{page}</option>)}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-72">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input type="text" name="q" placeholder="Cari kode atau data..." onChange={onChange} value={params.q || ''} className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABLE DATA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {riskRegisterKlinis.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <DocumentCheckIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Belum Ada Riwayat</h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q ? "Pencarian Anda tidak menemukan hasil yang cocok." : "Belum ada notifikasi atau riwayat penanganan risiko yang terekam."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-[280px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? 'z-0' : 'z-20'} align-top`}>
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Identitas & Register</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 w-[180px] align-top">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status Perbaikan</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[300px] max-w-[400px] align-top">
                                            <div className="flex items-center cursor-pointer group hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" onClick={() => sort("pernyataan_risiko")}>
                                                Konteks Risiko <SortIcon field="pernyataan_risiko" currentField={params.field} direction={params.direction} />
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 min-w-[220px] align-top">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pihak Terkait</div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 w-[100px] align-top text-center">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Aksi</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {riskRegisterKlinis.map((item, index) => {
                                        const isSelected = selectedRow === index;
                                        const gradingName = item.riskgrading?.name_nonklinis_pergub || item.riskgrading?.name || "UNRATED";
                                        const style = getGradingStyle(gradingName);
                                        
                                        return (
                                            <tr key={index} onClick={() => onSelectRow(index)} className={`group transition-colors cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}>
                                                
                                                {/* Col 1 */}
                                                <td className={`px-5 py-5 sticky left-0 bg-clip-padding border-r border-slate-100 dark:border-slate-800/80 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isSelected ? "bg-sky-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} ${isModalOpen || showDrawer ? 'z-0' : 'z-10'} align-top`}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold tracking-tight text-slate-900 dark:text-white">{item.kode_risiko}</span>
                                                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-1.5 py-0.5 rounded">#{meta.from + index}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${style.badge} ${style.text}`}>
                                                                {gradingName}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex flex-col gap-1 mt-2">
                                                            <div className="flex items-center"><ClockIcon className="w-3.5 h-3.5 mr-1.5 opacity-70"/> Reg: {moment(item.created_at).format("DD MMM YYYY")}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Col 2 */}
                                                <td className="px-5 py-5 text-center align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    {item.requestupdate ? (
                                                        <div className="inline-flex flex-col items-center justify-center p-2 border rounded-xl border-emerald-200 bg-emerald-50/80 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                                            <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                                                                <ShieldCheckIcon className="w-3.5 h-3.5 mr-1" /> Selesai Diperbaiki
                                                            </span>
                                                            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded">{item.requestupdate.tgl_perbaikan}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 shadow-sm">
                                                            <ExclamationTriangleIcon className="w-3.5 h-3.5 mr-1.5" /> Belum Perbaikan
                                                        </div>
                                                    )}
                                                </td>
                                                
                                                {/* Col 3 */}
                                                <td className="px-5 py-5 whitespace-normal border-r min-w-[300px] max-w-[400px] border-slate-100 dark:border-slate-800/80 align-top">
                                                    <div className="pr-4 mb-4">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pernyataan Risiko</span>
                                                        <p className="text-[13px] font-medium leading-relaxed text-slate-800 break-words dark:text-slate-200 line-clamp-3">{item.pernyataan_risiko || '-'}</p>
                                                    </div>
                                                    <div className="pt-2 pr-4 border-t border-slate-50 dark:border-slate-800/50">
                                                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sebab Utama</span>
                                                        <p className="text-[12px] font-semibold text-slate-600 break-words dark:text-slate-400 line-clamp-2">{item.sebab || '-'}</p>
                                                    </div>
                                                </td>

                                                {/* Col 4 */}
                                                <td className="px-5 py-5 align-top border-r border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 text-[11px] font-bold text-slate-600 uppercase bg-slate-100 border border-slate-200 rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-slate-400 shrink-0">
                                                                {item.user?.name ? item.user.name.charAt(0) : '?'}
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Pelapor (Pembuat)</span>
                                                                <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{item.user?.name || '-'}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800/80"></div>

                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 text-[11px] font-bold text-sky-700 uppercase border border-sky-200 rounded-lg bg-sky-50 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 shrink-0">
                                                                {item.pic?.name ? item.pic.name.charAt(0) : '?'}
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-500">Penanggung Jawab (PIC)</span>
                                                                <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{item.pic?.name || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Action Dropdown */}
                                                <td className="px-5 py-4 text-center align-top">
                                                    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => toggleDropdown(item.id)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        
                                                        {openDropdownId === item.id && (
                                                            <div className="absolute right-0 z-[100] w-56 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                <div className="py-1">
                                                                    <button onClick={() => { triggerModal(setIsOpenEditDialog, item); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group">
                                                                        <ClockIcon className="w-4 h-4 mr-2 transition-transform text-slate-500 dark:text-slate-400 group-hover:scale-110" /> Lihat Riwayat (Timeline)
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button onClick={() => { triggerModal(setIsOpenRequestUpdateStatus, item); setOpenDropdownId(null); }} className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-sky-600 transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10 dark:text-sky-400 group">
                                                                        <PencilSquareIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" /> Update Status Perbaikan
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

            {/* ----------------- SHADCN FLOATING DRAWER ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => {setShowDrawer(false); setSelectedRow(null);}}></div>
                    
                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[450px] lg:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Status & Detail</h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">{state.kode_risiko}</p>
                            </div>
                            <button onClick={() => {setShowDrawer(false); setSelectedRow(null);}} className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            
                            <section className="p-5 border border-sky-100 dark:border-sky-500/20 rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500"></div>
                                <label className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block mb-2 pl-2">Pernyataan Risiko Terpilih</label>
                                <p className="text-[13px] font-medium leading-relaxed text-slate-800 dark:text-slate-200 pl-2">{state.pernyataan_risiko || '-'}</p>
                            </section>
                            
                            <section>
                                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Status Penanganan Terakhir</label>
                                {state.requestupdate ? (
                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 flex items-center">
                                                <ShieldCheckIcon className="w-3 h-3 mr-1" /> Selesai Diperbaiki
                                            </span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{state.requestupdate.tgl_perbaikan}</span>
                                        </div>
                                        <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-700/80">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Upaya Pengendalian Aktual:</span>
                                            <p className="text-[13px] font-medium leading-relaxed text-slate-800 dark:text-slate-300">
                                                {state.requestupdate.upaya_pengendalian || "-"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1e293b] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm">
                                        <div className="p-3 mb-3 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                                            <ExclamationTriangleIcon className="w-6 h-6" />
                                        </div>
                                        <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada laporan perbaikan untuk risiko ini.</p>
                                        <button onClick={() => triggerModal(setIsOpenRequestUpdateStatus)} className="inline-flex items-center px-4 py-2.5 text-xs font-bold transition-colors border rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20 border-sky-200 dark:border-sky-500/30 shadow-sm focus:ring-2 focus:ring-sky-500/50">
                                            Update Status Perbaikan
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>
                        
                        <div className="flex flex-col gap-3 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                             <button onClick={() => triggerModal(setIsOpenEditDialog)} className="flex items-center justify-center w-full py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-slate-500/50">
                                <ClockIcon className="w-4 h-4 mr-2 opacity-70" /> Lihat Riwayat (Timeline History)
                             </button>
                             <button onClick={() => triggerModal(setIsOpenRequestUpdateStatus)} className="flex items-center justify-center w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-sky-500/50">
                                <PencilSquareIcon className="w-4 h-4 mr-2" /> Update Status Perbaikan
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