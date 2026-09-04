import AddModal from "@/Components/Modal/AddModal";
import EditModal from "@/Components/Modal/EditModal";
import Select from "@/Components/ui/Select";
import App from "@/Layouts/App";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowPathIcon,
    ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import Create from "./Create";
import Edit from "./Edit";

const gradingTypes = [
    {
        id: "klinis",
        label: "Klinis",
        nameKey: "name",
        colorKey: "warna_klinis",
    },
    {
        id: "nonklinis",
        label: "Non Klinis",
        nameKey: "name_nonklinis",
        colorKey: "warna_nonklinis",
    },
    {
        id: "klinis_pergub",
        label: "Klinis Pergub",
        nameKey: "name_klinis_pergub",
        colorKey: "warna_klinis_pergub",
    },
    {
        id: "nonklinis_pergub",
        label: "Non Klinis Pergub",
        nameKey: "name_nonklinis_pergub",
        colorKey: "warna_nonklinis_pergub",
    },
    {
        id: "klinis_bpkp",
        label: "Klinis BPKP",
        nameKey: "name_klinis_bpkp",
        colorKey: "warna_klinis_bpkp",
    },
    {
        id: "nonklinis_bpkp",
        label: "Non Klinis BPKP",
        nameKey: "name_nonklinis_bpkp",
        colorKey: "warna_nonklinis_bpkp",
    },
    {
        id: "ikp",
        label: "IKP",
        nameKey: "name_ikp",
        colorKey: "warna_ikp",
    },
];

const colorOptions = [
    { label: "Sangat Rendah", value: "#16a34a" },
    { label: "Rendah", value: "#38bdf8" },
    { label: "Sedang", value: "#facc15" },
    { label: "Tinggi", value: "#f97316" },
    { label: "Sangat Tinggi", value: "#dc2626" },
    { label: "Ekstrim", value: "#991b1b" },
];

const impactHeaders = [
    { value: "1", label: "Tidak Signifikan" },
    { value: "2", label: "Minor" },
    { value: "3", label: "Moderat" },
    { value: "4", label: "Mayor" },
    { value: "5", label: "Katastropik" },
];

const probabilityRows = [
    { value: "5", label: "Sangat sering terjadi" },
    { value: "4", label: "Sering terjadi" },
    { value: "3", label: "Mungkin terjadi" },
    { value: "2", label: "Jarang terjadi" },
    { value: "1", label: "Sangat jarang terjadi" },
];

const gradingValueFields = [
    "name",
    "warna_klinis",
    "name_nonklinis",
    "warna_nonklinis",
    "name_klinis_pergub",
    "warna_klinis_pergub",
    "name_nonklinis_pergub",
    "warna_nonklinis_pergub",
    "name_klinis_bpkp",
    "warna_klinis_bpkp",
    "name_nonklinis_bpkp",
    "warna_nonklinis_bpkp",
    "name_ikp",
    "warna_ikp",
    "name_bpkp",
    "warna_bpkp",
];

const defaultMatrixColor = (score) => {
    if (score >= 16) return colorOptions[5];
    if (score >= 10) return colorOptions[4];
    if (score >= 8) return colorOptions[3];
    if (score >= 5) return colorOptions[2];
    if (score >= 3) return colorOptions[1];

    return colorOptions[0];
};

const getReadableTextColor = (hexColor) => {
    const hex = String(hexColor || "").replace("#", "");
    const normalized =
        hex.length === 3
            ? hex
                  .split("")
                  .map((char) => `${char}${char}`)
                  .join("")
            : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return "text-slate-950";
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.62 ? "text-slate-950" : "text-white";
};

const buildInitialCellData = (year, kode, latestRiskGradings = {}) => {
    const score = Number(kode.charAt(0)) * Number(kode.charAt(1));
    const fallback = defaultMatrixColor(score);
    const latest = latestRiskGradings?.[kode] || {};
    const data = {
        tahun: year,
        dampak: kode.charAt(0),
        probabilitas: kode.charAt(1),
        kode,
        warna: latest.warna || "",
    };

    gradingValueFields.forEach((field) => {
        data[field] = latest[field] || "";
    });

    if (!data.name) data.name = fallback.label;
    if (!data.name_nonklinis) data.name_nonklinis = fallback.label;
    if (!data.name_klinis_pergub) data.name_klinis_pergub = fallback.label.toUpperCase();
    if (!data.name_nonklinis_pergub) data.name_nonklinis_pergub = fallback.label.toUpperCase();
    if (!data.name_klinis_bpkp) data.name_klinis_bpkp = fallback.label;
    if (!data.name_nonklinis_bpkp) data.name_nonklinis_bpkp = fallback.label;
    if (!data.name_ikp) data.name_ikp = fallback.label;
    if (!data.name_bpkp) data.name_bpkp = fallback.label;
    if (!data.warna_klinis) data.warna_klinis = fallback.value;
    if (!data.warna_nonklinis) data.warna_nonklinis = fallback.value;
    if (!data.warna_klinis_pergub) data.warna_klinis_pergub = fallback.value;
    if (!data.warna_nonklinis_pergub) data.warna_nonklinis_pergub = fallback.value;
    if (!data.warna_klinis_bpkp) data.warna_klinis_bpkp = fallback.value;
    if (!data.warna_nonklinis_bpkp) data.warna_nonklinis_bpkp = fallback.value;
    if (!data.warna_ikp) data.warna_ikp = fallback.value;
    if (!data.warna_bpkp) data.warna_bpkp = fallback.value;

    return data;
};

const selectRoute = (year, type) => {
    router.get(
        route("riskGradings.index"),
        { year, type },
        { preserveState: true, preserveScroll: true, replace: true },
    );
};

const MatrixCell = ({ kode, row, type, selectedYear, latestRiskGradings, onCreate, onEdit }) => {
    const score = Number(kode.charAt(0)) * Number(kode.charAt(1));
    const color = row?.[type.colorKey] || "#f8fafc";
    const label = row?.[type.nameKey] || (row ? "Belum diatur" : "Belum ada data");
    const isMissing = !row;

    return (
        <button
            type="button"
            onClick={() =>
                row
                    ? onEdit(row, type)
                    : onCreate(buildInitialCellData(selectedYear, kode, latestRiskGradings))
            }
            className={`relative flex min-h-[94px] flex-col items-center justify-center border-b border-r border-slate-300 px-2 text-center transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-slate-700 ${
                isMissing
                    ? "border-dashed bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                    : getReadableTextColor(color)
            }`}
            style={{ backgroundColor: color }}
            title={`${selectedYear} ${type.label} kode ${kode}`}
        >
            <span className="text-sm font-black leading-tight">{label}</span>
            <span className="mt-1 text-2xl font-black">{score}</span>
            <span className="text-[10px] font-bold opacity-80">Kode {kode}</span>
            {isMissing && (
                <span className="mt-1 rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-black uppercase dark:border-slate-700">
                    Tambah
                </span>
            )}
        </button>
    );
};

function CopyYearPanel({ selectedYear, selectedType, availableYears, yearCounts }) {
    const previousYear = selectedYear - 1;
    const yearOptions = availableYears.map((year) => ({
        value: year,
        label: `${year}${yearCounts?.[year] ? ` (${yearCounts[year]} data)` : " (kosong)"}`,
    }));
    const sourceYears = availableYears.filter((year) => Number(yearCounts?.[year] || 0) > 0);
    const defaultSourceYear = sourceYears.includes(previousYear)
        ? previousYear
        : sourceYears[0] || previousYear;
    const { data, setData, post, processing, errors } = useForm({
        source_year: defaultSourceYear,
        target_year: selectedYear,
    });
    const targetRowsCount = Number(yearCounts?.[data.target_year] || 0);
    const sourceRowsCount = Number(yearCounts?.[data.source_year] || 0);
    const isCopyBlocked =
        targetRowsCount > 0 ||
        sourceRowsCount === 0 ||
        String(data.source_year) === String(data.target_year);

    useEffect(() => {
        setData({
            ...data,
            target_year: selectedYear,
            source_year: sourceYears.includes(previousYear)
                ? previousYear
                : data.source_year || sourceYears[0] || previousYear,
        });
    }, [selectedYear]);

    const submit = (event) => {
        event.preventDefault();
        if (isCopyBlocked) return;
        post(route("riskGradings.copyYear"), {
            preserveScroll: true,
            onSuccess: () => selectRoute(data.target_year, selectedType),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0f172a] sm:grid-cols-[1fr_1fr_auto]"
        >
            <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Copy Dari Tahun
                </label>
                <Select
                    value={data.source_year}
                    onChange={(value) => setData("source_year", value)}
                    options={yearOptions.filter((option) => sourceYears.includes(option.value))}
                    placeholder="Pilih tahun sumber"
                />
                {errors.source_year && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.source_year}</p>
                )}
            </div>
            <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Paste Ke Tahun
                </label>
                <Select
                    value={data.target_year}
                    onChange={(value) => setData("target_year", value)}
                    options={yearOptions}
                    placeholder="Pilih tahun tujuan"
                />
                {targetRowsCount > 0 && (
                    <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Tahun tujuan sudah berisi {targetRowsCount} data. Copy dikunci agar tidak menimpa edit yang sudah ada.
                    </p>
                )}
                {errors.target_year && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{errors.target_year}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={processing || isCopyBlocked}
                className="inline-flex h-10 items-center justify-center self-end rounded-lg bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
                <ClipboardDocumentIcon className="mr-2 h-4 w-4" />
                Copy Paste
            </button>
        </form>
    );
}

export default function Index(props) {
    const selectedType =
        gradingTypes.find((type) => type.id === props.selectedType) || gradingTypes[0];
    const selectedYear = Number(props.selectedYear || new Date().getFullYear());
    const matrixRows = props.matrixRiskGradings || {};
    const availableYears = props.availableYears || [selectedYear];
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [editingType, setEditingType] = useState(selectedType);
    const [initialData, setInitialData] = useState({});

    const completeCells = useMemo(
        () => Object.keys(matrixRows).length,
        [matrixRows],
    );

    const openCreate = (data = {}) => {
        setInitialData(data);
        setIsOpenAddDialog(true);
    };

    const openEdit = (row, type) => {
        setSelectedRow(row);
        setEditingType(type);
        setIsOpenEditDialog(true);
    };

    return (
        <div className="relative min-h-screen bg-transparent p-0 font-sans text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Aturan Grading Risiko" />

            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-5xl"
                title="Tambah Aturan Grading"
            >
                <Create
                    key={`${initialData.tahun || "new"}-${initialData.kode || "blank"}`}
                    initialData={initialData}
                    latestRiskGradings={props.latestRiskGradings || {}}
                    latestRiskGradingYear={props.latestRiskGradingYear}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </AddModal>

            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-5xl"
                title={`Edit ${editingType?.label || selectedType.label} ${selectedRow?.tahun || ""} Kode ${selectedRow?.kode || ""}`}
            >
                <Edit
                    key={selectedRow?.id || "empty"}
                    model={selectedRow}
                    activeType={editingType}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>

            <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
                <section className="relative overflow-visible rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0f172a]">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                                Aturan Grading Risiko
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Matriks aktif berdasarkan tahun dan jenis grading. Klik kotak untuk edit data kode pada tahun tersebut.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Select
                                value={selectedYear}
                                onChange={(year) => selectRoute(year, selectedType.id)}
                                options={availableYears.map((year) => ({
                                    value: year,
                                    label: `${year}${props.yearCounts?.[year] ? ` (${props.yearCounts[year]} data)` : " (kosong)"}`,
                                }))}
                                className="w-full sm:w-44"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {gradingTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => selectRoute(selectedYear, type.id)}
                                className={`min-h-[38px] rounded-lg border px-4 text-xs font-black uppercase tracking-widest transition ${
                                    selectedType.id === type.id
                                        ? "border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300"
                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                            >
                                {selectedYear} {type.label}
                            </button>
                        ))}
                    </div>
                </section>

                <CopyYearPanel
                    selectedYear={selectedYear}
                    selectedType={selectedType.id}
                    availableYears={availableYears}
                    yearCounts={props.yearCounts || {}}
                />

                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center">
                        <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                                Matriks {selectedYear} {selectedType.label}
                            </div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Kolom = Dampak/Konsekuensi, baris = Frekuensi/Likelihood
                            </div>
                        </div>
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <ArrowPathIcon className="mr-2 h-4 w-4" />
                            {completeCells}/25 kode tersedia
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="min-w-[860px]">
                            <div className="grid grid-cols-[180px_repeat(5,minmax(120px,1fr))]">
                                <div className="flex min-h-[78px] items-center justify-center border-b border-r border-slate-300 bg-slate-100 px-3 text-center text-xs font-black uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    Frekuensi / Likelihood
                                </div>
                                {impactHeaders.map((impact) => (
                                    <div
                                        key={impact.value}
                                        className="flex min-h-[78px] flex-col items-center justify-center border-b border-r border-slate-300 bg-slate-50 px-3 text-center dark:border-slate-700 dark:bg-slate-900/80"
                                    >
                                        <span className="text-xs font-bold leading-tight text-slate-700 dark:text-slate-200">
                                            {impact.label}
                                        </span>
                                        <span className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                            {impact.value}
                                        </span>
                                    </div>
                                ))}

                                {probabilityRows.map((probability) => (
                                    <React.Fragment key={probability.value}>
                                        <div className="flex min-h-[94px] flex-col items-center justify-center border-b border-r border-slate-300 bg-slate-50 px-3 text-center dark:border-slate-700 dark:bg-slate-900/80">
                                            <span className="text-xs font-bold leading-tight text-slate-700 dark:text-slate-200">
                                                {probability.label}
                                            </span>
                                            <span className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                                {probability.value}
                                            </span>
                                        </div>
                                        {impactHeaders.map((impact) => {
                                            const kode = `${impact.value}${probability.value}`;

                                            return (
                                                <MatrixCell
                                                    key={kode}
                                                    kode={kode}
                                                    row={matrixRows[kode]}
                                                    type={selectedType}
                                                    selectedYear={selectedYear}
                                                    latestRiskGradings={props.latestRiskGradings || {}}
                                                    onCreate={openCreate}
                                                    onEdit={openEdit}
                                                />
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

Index.layout = (page) => <App children={page} />;
