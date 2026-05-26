import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "@/Components/Pagination";
import moment from "moment";
import SecondaryButton from "@/Components/SecondaryButton";
import EditHasilInvestigasi from "../HasilInvestigasi/Edit";
import {
    MagnifyingGlassIcon,
    PlusIcon,
    InboxIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    TrashIcon,
    PrinterIcon,
    DocumentMagnifyingGlassIcon,
    ClockIcon,
    XMarkIcon,
    UserCircleIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

const UpIcon = () => (
    <svg
        className="w-3.5 h-3.5 ml-1 text-sky-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 15l7-7 7 7"
        />
    </svg>
);
const DownIcon = () => (
    <svg
        className="w-3.5 h-3.5 ml-1 text-sky-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

// Helper Grading Style
const getGradingStyle = (gradingName) => {
    switch (gradingName?.toUpperCase()) {
        case "EKSTRIM":
        case "EXTREME":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30";
        case "TINGGI":
        case "HIGH":
            return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30";
        case "MODERAT":
        case "SEDANG":
        case "MODERATE":
            return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30";
        case "RENDAH":
        case "LOW":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30";
        default:
            return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10";
    }
};

export default function Index(props) {
    const { data: IkpPasien, meta, filtered, attributes } = props.IkpPasien;
    const { auth } = usePage().props;

    let ShouldMap = {
        IkpJenisInsiden: props.IkpJenisInsiden,
        IkpTipeInsiden: props.IkpTipeInsiden,
        IkpSpesialisasi: props.IkpSpesialisasi,
        IkpDampak: props.IkpDampak,
        IkpProbabilitas: props.IkpProbabilitas,
        IkpPelapor: props.IkpPelapor,
        IkpGrupLayanan: props.IkpGrupLayanan,
        IkpPenanggung: props.IkpPenanggung,
        IkpLokasi: props.IkpLokasi,
        IkpPenindak: props.IkpPenindak,
        pics: props.pics,
        IkpTerjadiTempatLain: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        JenisKelamin: [
            { id: 1, name: "Laki - Laki" },
            { id: 2, name: "Perempuan" },
            { id: 3, name: "-" },
        ],
        IkpVerifikasi: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        IkpInvestigasiLengkap: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        IkpInvestigasiLanjut: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
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
                { preserveState: true, preserveScroll: true },
            );
        }, 150),
        [],
    );

    useEffect(() => {
        if (!isInitialRender) reload(params);
        else setIsInitialRender(false);
    }, [params]);

    useEffect(() => {
        let numbers = [];
        for (
            let i = attributes.per_page;
            i < attributes.total / attributes.per_page;
            i += attributes.per_page
        ) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, []);

    const onChange = (event) =>
        setParams({
            ...params,
            [event.target.name]: event.target.value,
            page: 1,
        });
    const sort = (item) =>
        setParams({
            ...params,
            field: item,
            direction: params.direction == "asc" ? "desc" : "asc",
        });

    // Modals & States
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [
        isOpenEditDialogHasilInvestigasi,
        setIsOpenEditDialogHasilInvestigasi,
    ] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenPrintDialog, setIsOpenPrintDialog] = useState(false);
    const [isOpenPrintHasilDialog, setIsOpenPrintHasilDialog] = useState(false);
    const [state, setState] = useState({});

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id) =>
        setOpenDropdownId(openDropdownId === id ? null : id);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const isModalOpen = isOpenEditDialog || isOpenEditDialogHasilInvestigasi;

    const openAddDialog = () => setIsOpenAddDialog(true);
    console.log(state);
    const onSelectRow = (index) => {
        // Hanya lakukan deselect JIKA baris yang diklik adalah baris yang sama DAN drawer sedang terbuka
        if (selectedRow === index && showDrawer) {
            setSelectedRow(null);
            setShowDrawer(false);
        } else {
            // Jika klik baris lain, ATAU klik baris yang sama tapi drawer tertutup -> Buka Drawer
            setSelectedRow(index);
            setShowDrawer(true);
            setState(IkpPasien[index] || {});
        }
    };

    const triggerModal = (setter, row = state) => {
        setState(row);
        setShowDrawer(false);
        setSelectedRow(null); // <--- Tambahan agar seleksi baris tabel ikut kereset
        setter(true);
    };

    const destroyIkpPasien = () => {
        router.delete(route("IkpPasien.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const printIkpPasien = () => {
        window.open(route("export.printIkpForm", state.code));
        setIsOpenPrintDialog(false);
    };
    const printIkpHasilPasien = () => {
        window.open(route("export.printFormInvestigasiSederhana", state.code));
        setIsOpenPrintHasilDialog(false);
    };
    const downloadIkpHasilPasien = () => {
        window.open(`${route("export.printFormInvestigasiSederhana", state.code)}?download=1`);
        setIsOpenPrintHasilDialog(false);
    };
    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Form IKP Pasien" />

            {/* --- MODALS --- */}
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-7xl"
                title="Tambah Form IKP"
            >
                <Create
                    ShouldMap={ShouldMap}
                    isOpenAddDialog={isOpenAddDialog}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </AddModal>

            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-7xl"
                title="Edit Form IKP"
            >
                <Edit
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>

            <EditModal
                isOpenEditDialog={isOpenEditDialogHasilInvestigasi}
                setIsOpenEditDialog={setIsOpenEditDialogHasilInvestigasi}
                size="max-w-6xl"
                title="Input/Edit Hasil Investigasi"
            >
                <EditHasilInvestigasi
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogHasilInvestigasi}
                    setIsOpenEditDialog={setIsOpenEditDialogHasilInvestigasi}
                />
            </EditModal>

            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-md"
                title="Hapus Form IKP"
                warning="Yakin ingin menghapus data IKP ini secara permanen?"
            >
                <DangerButton
                    className="w-full ml-2"
                    onClick={destroyIkpPasien}
                >
                    Hapus Permanen
                </DangerButton>
            </DestroyModal>

            <DestroyModal
                isOpenDestroyDialog={isOpenPrintDialog}
                setIsOpenDestroyDialog={setIsOpenPrintDialog}
                size="max-w-md"
                title="Print Form IKP"
                warning="Anda akan membuka tab baru untuk mencetak Form IKP ini."
            >
                <SecondaryButton
                    className="w-full ml-2"
                    onClick={printIkpPasien}
                >
                    Lanjutkan Print
                </SecondaryButton>
            </DestroyModal>

            <DestroyModal
                isOpenDestroyDialog={isOpenPrintHasilDialog}
                setIsOpenDestroyDialog={setIsOpenPrintHasilDialog}
                size="max-w-md"
                title="Preview Hasil Investigasi"
                warning="Preview akan dibuka di tab baru. Jika sudah sesuai, dokumen bisa langsung di-download."
            >
                <SecondaryButton
                    className="w-full ml-2"
                    onClick={printIkpHasilPasien}
                >
                    Preview PDF
                </SecondaryButton>
                <SecondaryButton
                    className="w-full ml-2"
                    onClick={downloadIkpHasilPasien}
                >
                    Download PDF
                </SecondaryButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                                Laporan IKP Pasien
                            </h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Insiden Keselamatan Pasien (IKP) dan Hasil
                                Investigasi.
                            </p>
                        </div>

                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold lg:block text-slate-500">
                                    Tampilkan:
                                </span>
                                <select
                                    name="load"
                                    onChange={onChange}
                                    value={params.load}
                                    className="h-10 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
                                >
                                    {pageNumber.map((page, index) => (
                                        <option key={index}>
                                            {page}
                                        </option>
                                    ))}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Cari data..."
                                        onChange={onChange}
                                        value={params.q || ""}
                                        className="h-10 w-full pl-10 pr-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={openAddDialog}
                                className="inline-flex items-center justify-center w-full h-10 px-5 text-sm font-bold text-white transition-colors shadow-sm shrink-0 sm:w-auto rounded-xl bg-sky-600 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" /> Tambah IKP
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MAIN TABLE AREA --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {IkpPasien.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <InboxIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                Tidak Ada Data IKP
                            </h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q
                                    ? "Pencarian Anda tidak menemukan hasil yang cocok."
                                    : "Belum ada laporan IKP Pasien yang masuk."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th
                                            className={`px-5 py-4 sticky left-0 bg-slate-50 dark:bg-[#09090b] bg-clip-padding border-b border-r border-slate-200 dark:border-slate-800/80 w-16 text-center shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? "z-0" : "z-20"} align-top`}
                                        >
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                #
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() =>
                                                sort("tanggal_insiden")
                                            }
                                        >
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Tgl Kejadian
                                                {params.field ==
                                                    "tanggal_insiden" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field ==
                                                    "tanggal_insiden" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => sort("created_at")}
                                        >
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Tgl Lapor
                                                {params.field == "created_at" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "created_at" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => sort("lokasi_name")}
                                        >
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Unit / Lokasi
                                                {params.field ==
                                                    "lokasi_name" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field ==
                                                    "lokasi_name" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[200px] max-w-[300px]"
                                            onClick={() => sort("insiden")}
                                        >
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Jenis & Insiden
                                                {params.field == "insiden" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "insiden" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() =>
                                                sort("ikp_penanggung_id")
                                            }
                                        >
                                            <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Penanggung Biaya
                                                {params.field ==
                                                    "ikp_penanggung_id" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field ==
                                                    "ikp_penanggung_id" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-5 py-4 text-center transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800 w-36"
                                            onClick={() => sort("concatdp")}
                                        >
                                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Grading Awal
                                                {params.field == "concatdp" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "concatdp" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th
                                            className="w-40 px-5 py-4 text-center transition-colors border-b border-r cursor-pointer border-slate-200 dark:border-slate-800/80 group hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => sort("concatdp2")}
                                        >
                                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Grading Investigasi
                                                {params.field == "concatdp2" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "concatdp2" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </div>
                                        </th>
                                        <th className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-24">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {IkpPasien.map((item, index) => {
                                        const isSelected =
                                            selectedRow === index;
                                        const gradingAwalName =
                                            item.riskgrading?.name_ikp;
                                        const gradingAkhirName =
                                            item.hasil_grading
                                                ? item.hasil_grading?.name_ikp
                                                : item.ikp_hasil
                                                  ? "Investigasi"
                                                  : "Belum";
                                        const gradingAwalClass =
                                            getGradingStyle(gradingAwalName);
                                        const gradingAkhirClass =
                                            getGradingStyle(
                                                item.hasil_grading?.name_ikp,
                                            );

                                        return (
                                            <tr
                                                key={index}
                                                onClick={() =>
                                                    onSelectRow(index)
                                                }
                                                className={`group transition-colors cursor-pointer ${isSelected ? "bg-sky-50/50 dark:bg-white/[0.04]" : "bg-white dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"}`}
                                            >
                                                {/* Col 1 (Sticky) */}
                                                <td
                                                    className={`px-5 py-4 text-center border-r border-slate-100 dark:border-slate-800/80 align-middle sticky left-0 bg-clip-padding ${isSelected ? "bg-sky-50 dark:bg-[#1e293b]" : "bg-white dark:bg-[#0f172a] group-hover:bg-slate-50 dark:group-hover:bg-[#161f33]"} shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)] ${isModalOpen || showDrawer ? "z-0" : "z-10"}`}
                                                >
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                        {meta.from + index}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 align-middle border-r border-slate-100 dark:border-slate-800/80 whitespace-nowrap">
                                                    <div className="flex items-center text-sm font-bold text-slate-800 dark:text-slate-200">
                                                        <ClockIcon className="w-4 h-4 mr-1.5 text-sky-500" />
                                                        {moment(
                                                            item.tanggal_insiden,
                                                        ).format("DD-MM-YYYY")}
                                                    </div>
                                                    <div className="text-[11px] font-medium text-slate-500 ml-5 mt-0.5">
                                                        Jam:{" "}
                                                        {moment(
                                                            item.tanggal_insiden,
                                                        ).format("HH:mm")}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-middle border-r border-slate-100 dark:border-slate-800/80 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                        {moment(
                                                            item.created_at,
                                                        ).format("DD-MM-YYYY")}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 whitespace-normal align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <span className="block text-sm font-bold break-words text-slate-800 dark:text-slate-200">
                                                        {item.lokasi_name ||
                                                            "-"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 border-r border-slate-100 dark:border-slate-800/80 align-middle whitespace-normal min-w-[200px] max-w-[300px]">
                                                    <div className="mb-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                                                            Jenis:
                                                        </span>
                                                        <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                                                            {item.jenis_insiden
                                                                ?.name || "-"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                                                            Insiden:
                                                        </span>
                                                        <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                                                            {item.insiden ||
                                                                "-"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 whitespace-normal align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <span className="block text-xs font-semibold break-words text-slate-700 dark:text-slate-300">
                                                        {item.penanggung
                                                            ?.name || "-"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-center align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${gradingAwalClass}`}
                                                    >
                                                        {gradingAwalName ||
                                                            "UNRATED"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-center align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                    {item.hasil_grading ? (
                                                        <span
                                                            className={`inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${gradingAkhirClass}`}
                                                        >
                                                            {gradingAkhirName}
                                                        </span>
                                                    ) : item.ikp_hasil ? (
                                                        <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30">
                                                            Sdh Inv. (Blm
                                                            Grading)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
                                                            Belum Investigasi
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action Dropdown */}
                                                <td className="px-5 py-4 text-center align-middle">
                                                    <div
                                                        className="relative inline-block text-left"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                toggleDropdown(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                                        >
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>

                                                        {openDropdownId ===
                                                            item.id && (
                                                            <div className="absolute right-0 z-[100] w-56 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerModal(
                                                                                setIsOpenEditDialogHasilInvestigasi,
                                                                                item,
                                                                            );
                                                                            setOpenDropdownId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-teal-600 transition-colors hover:bg-teal-50 dark:hover:bg-teal-500/10 dark:text-teal-400 group"
                                                                    >
                                                                        <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />{" "}
                                                                        Input
                                                                        Hasil
                                                                        Investigasi
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerModal(
                                                                                setIsOpenEditDialog,
                                                                                item,
                                                                            );
                                                                            setOpenDropdownId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-sky-600 transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10 dark:text-sky-400 group"
                                                                    >
                                                                        <PencilSquareIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />{" "}
                                                                        Edit
                                                                        Form IKP
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerModal(
                                                                                setIsOpenPrintDialog,
                                                                                item,
                                                                            );
                                                                            setOpenDropdownId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group"
                                                                    >
                                                                        <PrinterIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />{" "}
                                                                        Print
                                                                        Form IKP
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerModal(
                                                                                setIsOpenPrintHasilDialog,
                                                                                item,
                                                                            );
                                                                            setOpenDropdownId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group"
                                                                    >
                                                                        <PrinterIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />{" "}
                                                                        Preview
                                                                        Investigasi
                                                                    </button>
                                                                </div>
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerModal(
                                                                                setIsOpenDestroyDialog,
                                                                                item,
                                                                            );
                                                                            setOpenDropdownId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />{" "}
                                                                        Hapus
                                                                        Data
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

            {/* ----------------- SHADCN FLOATING DRAWER (SIDE PANEL) ----------------- */}
            {showDrawer && state?.id && (
                <>
                    <div
                        className="fixed inset-0 z-40 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setShowDrawer(false);
                            setSelectedRow(null);
                        }}
                    ></div>

                    <div className="fixed inset-y-2 right-2 sm:right-4 z-50 w-[calc(100%-1rem)] sm:w-[450px] lg:w-[500px] bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col transition ease-in-out animate-slide-in overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-[#0f172a] shrink-0">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                    Detail IKP Pasien
                                </h2>
                                <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                    {state.code || "Kode Tidak Tersedia"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDrawer(false);
                                    setSelectedRow(null);
                                }}
                                className="p-2 transition-colors rounded-full bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-transparent">
                            {/* Insiden & Kronologi */}
                            <section className="p-5 border border-sky-100 dark:border-sky-500/20 rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500"></div>
                                <label className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block mb-2 pl-2">
                                    Insiden Terjadi
                                </label>
                                <p className="text-[13px] font-medium leading-relaxed text-slate-800 dark:text-slate-200 pl-2">
                                    {state.insiden || "-"}
                                </p>

                                <div className="w-full h-px mt-4 mb-3 ml-2 bg-slate-100 dark:bg-slate-700"></div>

                                <label className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest block mb-4 pl-2">
                                    Kronologi Kejadian
                                </label>

                                <div className="pl-3">
                                    {state.kronologis &&
                                    state.kronologis.length > 0 ? (
                                        <div className="space-y-5 border-l-2 border-slate-100 dark:border-slate-700/80 ml-1.5 pt-1">
                                            {state.kronologis.map(
                                                (krono, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative pl-5"
                                                    >
                                                        {/* Titik Timeline (Timeline Dot) */}
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-sky-500 -left-[6px] top-0.5 ring-4 ring-white dark:ring-[#1e293b]"></div>

                                                        {/* Waktu Kejadian */}
                                                        <div className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1">
                                                            <ClockIcon className="w-3 h-3 mr-1.5 text-sky-500/70" />
                                                            {krono.waktu ||
                                                                "Waktu tidak diketahui"}
                                                        </div>

                                                        {/* Teks Kronologi */}
                                                        <p className="text-[12px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                                                            {krono.kronologi ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-[12px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 italic border-l-2 border-transparent pl-2">
                                            Kronologi tidak disertakan.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Waktu & Lokasi */}
                            <section className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                                    <ClockIcon className="w-5 h-5 mb-2 text-slate-400" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                                        Waktu Kejadian
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {moment(state.tanggal_insiden).format(
                                            "DD MMM YYYY",
                                        )}
                                    </p>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                        {moment(state.tanggal_insiden).format(
                                            "HH:mm",
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                                    <MapPinIcon className="w-5 h-5 mb-2 text-slate-400" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                                        Unit / Lokasi
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {state.lokasi_name || "-"}
                                    </p>
                                </div>
                            </section>

                            {/* Pelapor */}
                            <section className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shrink-0">
                                    <UserCircleIcon className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
                                        Dilaporkan Oleh
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {state.pelapor.name || "-"}
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions (Diperbarui dengan kedua tombol Cetak) */}
                        <div className="flex flex-col gap-2.5 p-5 bg-white border-t shrink-0 border-slate-100 dark:border-slate-800 dark:bg-[#0f172a]">
                            <button
                                onClick={() =>
                                    triggerModal(
                                        setIsOpenEditDialogHasilInvestigasi,
                                    )
                                }
                                className="flex items-center justify-center w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-teal-500/50"
                            >
                                <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" />{" "}
                                Input Hasil Investigasi
                            </button>

                            <button
                                onClick={() =>
                                    triggerModal(setIsOpenEditDialog)
                                }
                                className="flex items-center justify-center w-full py-2 text-sm font-bold transition-colors border shadow-sm bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30 rounded-xl focus:ring-2 focus:ring-sky-500/50"
                            >
                                <PencilSquareIcon className="w-4 h-4 mr-2" />{" "}
                                Edit Form IKP
                            </button>

                            <div className="grid grid-cols-2 gap-2.5 mt-1">
                                <button
                                    onClick={() =>
                                        triggerModal(setIsOpenPrintDialog)
                                    }
                                    className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[13px] font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-slate-500/50"
                                >
                                    <PrinterIcon className="w-4 h-4 mr-1.5 opacity-70" />{" "}
                                    Cetak IKP
                                </button>
                                <button
                                    onClick={() =>
                                        triggerModal(setIsOpenPrintHasilDialog)
                                    }
                                    className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[13px] font-bold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-slate-500/50"
                                >
                                    <PrinterIcon className="w-4 h-4 mr-1.5 opacity-70" />{" "}
                                    Preview Hasil
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
                :global(.dark)
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}

Index.layout = (page) => <App children={page} />;
