import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

const gradingTypes = [
    { label: "Klinis", nameKey: "name", colorKey: "warna_klinis" },
    { label: "Non Klinis", nameKey: "name_nonklinis", colorKey: "warna_nonklinis" },
    {
        label: "Non Klinis Pergub",
        nameKey: "name_nonklinis_pergub",
        colorKey: "warna_nonklinis_pergub",
    },
    { label: "IKP", nameKey: "name_ikp", colorKey: "warna_ikp" },
    { label: "BPKP", nameKey: "name_bpkp", colorKey: "warna_bpkp" },
];

const getKodeParts = (value) => {
    const digits = String(value || "").replace(/\D/g, "");

    return {
        dampak: digits.charAt(0) || "-",
        probabilitas: digits.charAt(1) || "-",
    };
};

const YearBadge = ({ value }) => (
    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-black text-slate-800 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
        {value || "-"}
    </span>
);

const MatrixCell = ({ value }) => {
    const { dampak, probabilitas } = getKodeParts(value);

    return (
        <div className="flex min-w-[260px] items-stretch gap-2">
            <div className="min-w-[72px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Dampak
                </div>
                <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {dampak}
                </div>
            </div>
            <div className="min-w-[94px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Probabilitas
                </div>
                <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {probabilitas}
                </div>
            </div>
            <div className="min-w-[72px] rounded-lg bg-slate-900 px-3 py-2 text-center shadow-sm dark:bg-white">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-500">
                    Kode
                </div>
                <div className="mt-1 text-xl font-black text-white dark:text-slate-900">
                    {value || "-"}
                </div>
            </div>
        </div>
    );
};

const ColorDot = ({ value }) => {
    const color = value || "#94a3b8";

    return (
        <div className="flex items-center gap-2">
            <span
                className="inline-block h-4 w-4 shrink-0 rounded-full border border-white shadow ring-1 ring-slate-200 dark:ring-slate-700"
                style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {value || "Belum diatur"}
            </span>
        </div>
    );
};

const GradingSummary = ({ row }) => (
    <div className="grid min-w-[760px] grid-cols-1 gap-2 whitespace-normal md:grid-cols-2 xl:grid-cols-5">
        {gradingTypes.map((type) => (
            <div
                key={type.nameKey}
                className="min-h-[86px] rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/70"
            >
                <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {type.label}
                </div>
                <div className="min-h-[22px] text-sm font-black leading-snug text-slate-900 dark:text-white">
                    {row[type.nameKey] || "-"}
                </div>
                <div className="mt-2">
                    <ColorDot value={row[type.colorKey]} />
                </div>
            </div>
        ))}
    </div>
);

export default function Index(props) {
    const columns = [
        {
            key: "tahun",
            label: "Tahun",
            sortField: "tahun",
            className: "w-[120px]",
            render: (row) => <YearBadge value={row.tahun} />,
        },
        {
            key: "kode",
            label: "Dampak / Probabilitas",
            sortField: "kode",
            className: "min-w-[300px]",
            render: (row) => <MatrixCell value={row.kode} />,
        },
        {
            key: "grading_summary",
            label: "Nama Grading dan Warna",
            className: "min-w-[800px]",
            cellClassName: "whitespace-normal",
            render: (row) => <GradingSummary row={row} />,
        },
    ];

    return (
        <MasterDataIndex
            resource={props.riskGradings}
            title="Aturan Grading Risiko"
            description="Kelola kode grading, label, dan warna per tahun agar aturan risiko bisa berubah tanpa menimpa tahun sebelumnya."
            addLabel="Tambah Grading"
            addTitle="Tambah Aturan Grading"
            editTitle="Edit Aturan Grading"
            deleteTitle="Hapus Aturan Grading"
            deleteWarning="Yakin ingin menghapus aturan grading ini? Data yang sudah dipakai transaksi pada tahun terkait akan ditolak oleh sistem."
            destroyRoute="riskGradings.destroy"
            searchPlaceholder="Cari tahun, kode, atau nama grading..."
            emptyTitle="Belum Ada Aturan Grading"
            emptyDescription="Aturan grading risiko belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{
                latestRiskGradings: props.latestRiskGradings || {},
                latestRiskGradingYear: props.latestRiskGradingYear,
            }}
        />
    );
}

Index.layout = MasterDataIndex.layout;
