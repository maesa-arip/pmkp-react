import DangerButton from "@/Components/DangerButton";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import Pagination from "@/Components/Pagination";
import App from "@/Layouts/App";
import { Head, router } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    CircleStackIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

const SortIcon = ({ field, currentField, direction }) => {
    const isActive = field === currentField;

    return (
        <svg
            className={`ml-1.5 h-3.5 w-3.5 transition-colors ${isActive ? "text-sky-500 dark:text-sky-400" : "text-slate-300 group-hover:text-slate-400 dark:text-slate-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {isActive && direction === "desc" ? (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                />
            ) : (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 15l7-7 7 7"
                />
            )}
        </svg>
    );
};

const getValue = (item, accessor) => {
    if (typeof accessor === "function") return accessor(item);
    return accessor.split(".").reduce((value, key) => value?.[key], item);
};

function MasterDataIndex({
    resource,
    title,
    description,
    addLabel,
    addTitle,
    editTitle,
    deleteTitle,
    deleteWarning,
    emptyTitle,
    emptyDescription,
    searchPlaceholder = "Cari data master...",
    destroyRoute,
    columns,
    Create,
    Edit,
    createProps = {},
    editProps = {},
}) {
    const { data: rows = [], meta, filtered = {}, attributes = {} } = resource;
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [state, setState] = useState({});
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);

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
        const currentLoad = Number(filtered.load || attributes.per_page || 10);
        const total = Number(attributes.total || currentLoad);
        const options = [10, 25, 50, 100]
            .filter((value) => value <= Math.max(total, currentLoad))
            .concat(currentLoad)
            .filter((value, index, array) => array.indexOf(value) === index)
            .sort((a, b) => a - b);

        setPageNumber(options);
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const visibleColumns = useMemo(
        () => columns.filter((column) => !column.hidden),
        [columns],
    );

    const onChange = (event) => {
        setParams({
            ...params,
            [event.target.name]: event.target.value,
            page: 1,
        });
    };

    const sort = (field) => {
        if (!field) return;

        setParams({
            ...params,
            field,
            direction: params.direction === "asc" ? "desc" : "asc",
        });
    };

    const openEditDialog = (row) => {
        setState(row);
        setIsOpenEditDialog(true);
        setOpenDropdownId(null);
    };

    const openDestroyDialog = (row) => {
        setState(row);
        setIsOpenDestroyDialog(true);
        setOpenDropdownId(null);
    };

    const destroyData = () => {
        router.delete(route(destroyRoute, state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent text-slate-900 dark:bg-transparent dark:text-slate-100 sm:p-2">
            <Head title={title} />

            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-4xl"
                title={addTitle || `Tambah ${title}`}
            >
                <Create
                    {...createProps}
                    isOpenAddDialog={isOpenAddDialog}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </AddModal>

            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-4xl"
                title={editTitle || `Edit ${title}`}
            >
                <Edit
                    {...editProps}
                    model={state}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>

            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-md"
                title={deleteTitle || `Hapus ${title}`}
                warning={
                    deleteWarning ||
                    `Yakin ingin menghapus "${state?.name || "data ini"}"?`
                }
            >
                <DangerButton className="w-full ml-2" onClick={destroyData}>
                    Hapus Permanen
                </DangerButton>
            </DestroyModal>

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                <div className="relative overflow-hidden bg-white border shadow-sm dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-500" />
                    <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                                {title}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-col items-center w-full gap-3 sm:flex-row md:w-auto">
                            <div className="flex items-center w-full gap-2 sm:w-auto">
                                <span className="hidden mr-1 text-xs font-semibold text-slate-500 lg:block">
                                    Tampilkan:
                                </span>
                                <select
                                    name="load"
                                    onChange={onChange}
                                    value={params.load}
                                    className="h-10 px-4 text-sm font-semibold transition-all border shadow-sm outline-none cursor-pointer appearance-none text-slate-700 bg-slate-50 border-slate-200 rounded-xl dark:bg-[#1e293b] dark:text-slate-200 dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                >
                                    {pageNumber.map((page, index) => (
                                        <option key={index}>{page}</option>
                                    ))}
                                </select>
                                <div className="relative flex-1 sm:w-56 md:w-72">
                                    <MagnifyingGlassIcon className="absolute w-4 h-4 left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        name="q"
                                        onChange={onChange}
                                        value={params.q || ""}
                                        placeholder={searchPlaceholder}
                                        className="w-full h-10 pl-10 pr-4 text-sm font-medium transition-all border shadow-sm outline-none text-slate-900 bg-slate-50 border-slate-200 rounded-xl dark:text-slate-100 dark:bg-[#1e293b] dark:border-slate-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpenAddDialog(true)}
                                className="inline-flex items-center justify-center w-full h-10 px-5 text-sm font-bold text-white transition-colors bg-sky-600 shadow-sm shrink-0 sm:w-auto rounded-xl hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {addLabel || "Tambah Data"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
                    {rows.length === 0 ? (
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="flex items-center justify-center w-20 h-20 mb-5 border rounded-full shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
                                <CircleStackIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                {emptyTitle || "Belum Ada Data"}
                            </h3>
                            <p className="max-w-sm mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {params.q
                                    ? "Pencarian Anda tidak menemukan hasil yang cocok."
                                    : emptyDescription || "Data master belum tersedia."}
                            </p>
                        </div>
                    ) : (
                        <div className="relative z-10 pb-32 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-slate-50 dark:bg-[#09090b]">
                                    <tr>
                                        <th className="px-5 py-4 border-b border-r w-24 border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                #
                                            </div>
                                        </th>
                                        {visibleColumns.map((column) => (
                                            <th
                                                key={column.key}
                                                className={`px-5 py-4 border-b border-r border-slate-200 dark:border-slate-800/80 ${column.className || "min-w-[220px]"}`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => sort(column.sortField)}
                                                    className={`flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors group ${column.sortField ? "cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" : "cursor-default"}`}
                                                >
                                                    {column.label}
                                                    {column.sortField && (
                                                        <SortIcon
                                                            field={column.sortField}
                                                            currentField={params.field}
                                                            direction={params.direction}
                                                        />
                                                    )}
                                                </button>
                                            </th>
                                        ))}
                                        <th className="w-24 px-5 py-4 text-center border-b border-slate-200 dark:border-slate-800/80">
                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                Aksi
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {rows.map((row, index) => (
                                        <tr
                                            key={row.id || index}
                                            className="transition-colors duration-200 bg-white group dark:bg-[#0f172a] hover:bg-slate-50/80 dark:hover:bg-[#161f33]"
                                        >
                                            <td className="px-5 py-4 align-middle border-r border-slate-100 dark:border-slate-800/80">
                                                <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                                    {meta?.from + index}
                                                </span>
                                            </td>
                                            {visibleColumns.map((column) => (
                                                <td
                                                    key={column.key}
                                                    className={`px-5 py-4 align-middle border-r border-slate-100 dark:border-slate-800/80 ${column.cellClassName || ""}`}
                                                >
                                                    {column.render ? (
                                                        column.render(row)
                                                    ) : (
                                                        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                                            {getValue(row, column.accessor || column.key) || "-"}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-5 py-4 text-center align-middle">
                                                <div
                                                    className="relative inline-block text-left"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            setOpenDropdownId(
                                                                openDropdownId === (row.id || index)
                                                                    ? null
                                                                    : row.id || index,
                                                            )
                                                        }
                                                        className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                                    >
                                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                                    </button>

                                                    {openDropdownId === (row.id || index) && (
                                                        <div className="absolute right-0 z-[100] w-48 mt-2 origin-top-right bg-white border shadow-lg border-slate-200 rounded-xl dark:bg-[#1e293b] dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-700/80">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => openEditDialog(row)}
                                                                    className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300 group"
                                                                >
                                                                    <PencilSquareIcon className="w-4 h-4 mr-2 transition-transform text-sky-500 dark:text-sky-400 group-hover:scale-110" />
                                                                    Edit Data
                                                                </button>
                                                            </div>
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => openDestroyDialog(row)}
                                                                    className="flex items-center w-full px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 group"
                                                                >
                                                                    <TrashIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                                                                    Hapus Data
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pb-10">
                    <Pagination meta={meta} />
                </div>
            </div>
        </div>
    );
}

MasterDataIndex.layout = (page) => <App children={page} />;

export default MasterDataIndex;
