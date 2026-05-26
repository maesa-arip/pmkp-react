import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

const ColorBadge = ({ value }) => {
    const color = value || "#94a3b8";

    return (
        <div className="flex items-center gap-3">
            <span
                className="inline-block w-9 h-9 border shadow-sm rounded-xl border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: color }}
            />
            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                {value || "Belum diatur"}
            </span>
        </div>
    );
};

const TextBadge = ({ value }) => (
    <span className="inline-flex items-center px-3 py-1 text-xs font-bold border rounded-full border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
        {value || "-"}
    </span>
);

const GradingBadge = ({ value, color }) => (
    <div className="space-y-2">
        <TextBadge value={value} />
        <ColorBadge value={color} />
    </div>
);

export default function Index(props) {
    const columns = [
        { key: "tahun", label: "Tahun", sortField: "tahun", className: "w-[120px]" },
        { key: "kode", label: "Kode", sortField: "kode", className: "w-[110px]" },
        {
            key: "name",
            label: "Klinis",
            sortField: "name",
            className: "min-w-[190px]",
            render: (row) => <GradingBadge value={row.name} color={row.warna_klinis} />,
        },
        {
            key: "name_nonklinis",
            label: "Non Klinis",
            sortField: "name_nonklinis",
            className: "min-w-[190px]",
            render: (row) => <GradingBadge value={row.name_nonklinis} color={row.warna_nonklinis} />,
        },
        {
            key: "name_nonklinis_pergub",
            label: "Non Klinis Pergub",
            sortField: "name_nonklinis_pergub",
            className: "min-w-[210px]",
            render: (row) => <GradingBadge value={row.name_nonklinis_pergub} color={row.warna_nonklinis_pergub} />,
        },
        {
            key: "name_ikp",
            label: "IKP",
            sortField: "name_ikp",
            className: "min-w-[190px]",
            render: (row) => <GradingBadge value={row.name_ikp} color={row.warna_ikp} />,
        },
        {
            key: "name_bpkp",
            label: "BPKP",
            sortField: "name_bpkp",
            className: "min-w-[190px]",
            render: (row) => <GradingBadge value={row.name_bpkp} color={row.warna_bpkp} />,
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
        />
    );
}

Index.layout = MasterDataIndex.layout;
