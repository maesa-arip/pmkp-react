import MasterDataIndex from "@/Components/MasterDataIndex";
import Create from "./Create";
import Edit from "./Edit";

export default function Index({ celahPengendalians }) {
    const columns = [
        { key: "name", label: "Nama Celah Pengendalian", sortField: "name", cellClassName: "whitespace-normal min-w-[240px] max-w-md break-words" },
        { key: "description", label: "Keterangan", sortField: "description", cellClassName: "whitespace-normal max-w-md break-words" },
        { key: "is_active", label: "Status", sortField: "is_active", render: row => <span className={row.is_active ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>{row.is_active ? "Aktif" : "Nonaktif"}</span> },
    ];
    return <MasterDataIndex resource={celahPengendalians} title="Celah Pengendalian" description="Kelola pilihan celah pengendalian untuk Risk Register Klinis dan Non Klinis." addLabel="Tambah Celah Pengendalian" destroyRoute="celahPengendalians.destroy" deleteWarning="Data yang sudah digunakan tidak dapat dihapus. Nonaktifkan melalui Edit jika tidak digunakan lagi." searchPlaceholder="Cari celah pengendalian..." emptyTitle="Belum Ada Celah Pengendalian" emptyDescription="Tambahkan celah pengendalian agar dapat dipilih pada form risiko." columns={columns} Create={Create} Edit={Edit} />;
}

Index.layout = MasterDataIndex.layout;
