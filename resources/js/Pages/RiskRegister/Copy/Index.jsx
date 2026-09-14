import App from "@/Layouts/App";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ClipboardDocumentCheckIcon,
    DocumentDuplicateIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import ComboboxPage from "@/Components/ComboboxPage";
import DestroyModal from "@/Components/Modal/DestroyModal";

const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100";

const Field = ({ label, children }) => (
    <label className="block">
        <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {label}
        </span>
        {children}
    </label>
);

const withAllOption = (label, items = []) => [{ id: "", name: label }, ...items];

const SelectField = ({ label, value, onChange, options }) => {
    const normalizedOptions = options || [];
    const selected =
        normalizedOptions.find((item) => String(item.id) === String(value)) ||
        normalizedOptions[0] ||
        { id: "", name: "-" };

    return (
        <Field label={label}>
            <ComboboxPage
                ShouldMap={normalizedOptions}
                selected={selected}
                onChange={(item) => onChange(item?.id ?? "")}
            />
        </Field>
    );
};

const StatCard = ({ label, value, tone = "slate" }) => {
    const styles = {
        slate: "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-[#0f172a] dark:text-white",
        sky: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100",
        amber: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
        emerald:
            "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
    };

    return (
        <div className={`rounded-2xl border p-5 shadow-sm ${styles[tone]}`}>
            <div className="text-[11px] font-black uppercase tracking-widest opacity-60">
                {label}
            </div>
            <div className="mt-2 text-3xl font-black">{value ?? 0}</div>
        </div>
    );
};

export default function Index({ filters, preview, options }) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const hasMounted = useRef(false);
    const { data, setData } = useForm({
        copy_mode: filters.copy_mode || "year",
        source_year: filters.source_year || new Date().getFullYear() - 1,
        target_year: filters.target_year || new Date().getFullYear(),
        tipe_id: filters.tipe_id || "",
        currently_id: filters.currently_id || "",
        user_id: filters.user_id || "",
        pic_id: filters.pic_id || "",
        risk_category_id: filters.risk_category_id || "",
        risk_type_id: filters.risk_type_id || "",
        risk_variety_id: filters.risk_variety_id || "",
        identification_source_id: filters.identification_source_id || "",
        priority_scope: filters.priority_scope || "all",
        source_pic_id: filters.source_pic_id || "",
        target_pic_id: filters.target_pic_id || "",
        target_user_id: filters.target_user_id || "",
    });

    const targetUserOptions = useMemo(() => {
        if (!data.target_pic_id) return options.users || [];

        return (options.users || []).filter(
            (user) => String(user.pic_id) === String(data.target_pic_id),
        );
    }, [data.target_pic_id, options.users]);

    const queryData = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== "" && value !== null),
            ),
        [data],
    );

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(route("riskRegisterCopy.index"), queryData, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [queryData]);

    const updateFilter = (field, value) => {
        setData(field, value);
    };

    const updateCopyMode = (mode) => {
        setData((current) => ({
            ...current,
            copy_mode: mode,
            pic_id: mode === "unit" ? "" : current.pic_id,
            source_pic_id: mode === "year" ? "" : current.source_pic_id,
            target_pic_id: mode === "year" ? "" : current.target_pic_id,
            target_user_id: mode === "year" ? "" : current.target_user_id,
            target_year:
                mode === "unit" && !current.target_year
                    ? current.source_year
                    : current.target_year,
        }));
    };

    const executeCopy = () => {
        setIsExecuting(true);
        router.post(route("riskRegisterCopy.store"), queryData, {
            preserveScroll: true,
            onFinish: () => {
                setIsExecuting(false);
                setIsConfirmOpen(false);
            },
        });
    };

    return (
        <div className="min-h-screen p-0 text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Copy Risk Register" />

            <div className="mx-auto flex flex-col gap-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0f172a]">
                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                                Admin Tools
                            </div>
                            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Copy Risk Register
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                Salin data tahun lama ke tahun baru, atau salin risiko dari satu unit ke unit lain
                                tanpa menimpa data yang sudah ada.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={isExecuting || (preview?.eligible || 0) < 1}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                            {isExecuting ? "Menyalin..." : "Eksekusi Copy"}
                        </button>
                    </div>
                </div>

                <div className="space-y-2 rounded-xl border p-4 text-sm">
                    <p>Hasil copy memakai indikator tahun tujuan dan perlu review. Nilai evaluasi, realisasi, dan bukti tahun sebelumnya dikosongkan. Padanan teks hanya peringatan kemungkinan duplikat.</p>
                    {options.canManageIndicators && <a className="text-sky-600 underline" href={route('kinerja.index', { tahun: data.target_year })}>Kelola indikator dan pemetaan tahun tujuan</a>}
                    {preview.period_error && <p role="alert" className="text-red-600">{preview.period_error}</p>}
                    <p>Belum terpetakan: {preview.unmapped || 0}. Unit tidak sesuai: {preview.unit_mismatch || 0}.</p>
                    {(preview.blocked || []).length > 0 && <details><summary>Lihat risiko yang perlu penyesuaian (maks. 100)</summary><ul>{preview.blocked.map(x => <li key={x.id}>{x.kode || x.id} — indikator sumber #{x.indicator_id}: {x.reason}</li>)}</ul></details>}
                </div>
                <DestroyModal
                    title="Konfirmasi Copy Risk Register"
                    warning={
                        data.copy_mode === "unit"
                            ? `Eksekusi akan membuat ${preview?.eligible || 0} data baru dari unit sumber ke unit tujuan pada tahun ${data.target_year}. Data unit tujuan yang sudah ada tidak akan ditimpa.`
                            : `Eksekusi akan membuat ${preview?.eligible || 0} data baru dari tahun ${data.source_year} ke ${data.target_year}. Data tahun tujuan yang sudah ada tidak akan ditimpa.`
                    }
                    isOpenDestroyDialog={isConfirmOpen}
                    setIsOpenDestroyDialog={setIsConfirmOpen}
                    size="max-w-lg"
                >
                    <button
                        type="button"
                        onClick={executeCopy}
                        disabled={isExecuting || (preview?.eligible || 0) < 1}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                        {isExecuting ? "Menyalin..." : "Ya, Eksekusi Copy"}
                    </button>
                </DestroyModal>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <StatCard label="Data Sumber" value={preview?.source_total} />
                    <StatCard label="Siap Dicopy" value={preview?.eligible} tone="emerald" />
                    <StatCard label="Sudah Pernah Dicopy" value={preview?.already_copied} tone="sky" />
                    <StatCard
                        label={data.copy_mode === "unit" ? "Padanan Unit Tujuan" : `Padanan ${data.target_year} Manual`}
                        value={preview?.equivalent_target}
                        tone="amber"
                    />
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0f172a]">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <FunnelIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 dark:text-white">
                                Filter Copy
                            </h2>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Kosongkan filter untuk copy semua data yang sesuai tahun sumber.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[
                            {
                                id: "year",
                                title: "Copy Antar Tahun",
                                description: "Salin risiko dari tahun lama ke tahun baru.",
                            },
                            {
                                id: "unit",
                                title: "Copy Antar Unit",
                                description: "Salin risiko dari unit sumber ke unit tujuan.",
                            },
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                type="button"
                                onClick={() => updateCopyMode(mode.id)}
                                className={`rounded-2xl border p-4 text-left transition ${
                                    data.copy_mode === mode.id
                                        ? "border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-500/10 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200 dark:hover:border-sky-500/30"
                                }`}
                            >
                                <span className="block text-sm font-black">{mode.title}</span>
                                <span className="mt-1 block text-xs font-semibold opacity-70">
                                    {mode.description}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="Tahun Sumber">
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.source_year}
                                onChange={(e) => updateFilter("source_year", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Tahun Tujuan">
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.target_year}
                                onChange={(e) => updateFilter("target_year", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        {data.copy_mode === "unit" && (
                            <>
                                <SelectField
                                    label="Unit Sumber"
                                    value={data.source_pic_id}
                                    onChange={(value) => updateFilter("source_pic_id", value)}
                                    options={withAllOption("Pilih Unit Sumber", options.pics)}
                                />
                                <SelectField
                                    label="Unit Tujuan"
                                    value={data.target_pic_id}
                                    onChange={(value) => {
                                        setData((current) => ({
                                            ...current,
                                            target_pic_id: value,
                                            target_user_id:
                                                String(current.target_pic_id) === String(value)
                                                    ? current.target_user_id
                                                    : "",
                                        }));
                                    }}
                                    options={withAllOption("Pilih Unit Tujuan", options.pics)}
                                />
                                <SelectField
                                    label="User Tujuan"
                                    value={data.target_user_id}
                                    onChange={(value) => updateFilter("target_user_id", value)}
                                    options={withAllOption("Pilih User Tujuan", targetUserOptions)}
                                />
                            </>
                        )}
                        <SelectField
                            label="Jenis Register"
                            value={data.tipe_id}
                            onChange={(value) => updateFilter("tipe_id", value)}
                            options={[
                                { id: "", name: "Semua" },
                                { id: "1", name: "Klinis" },
                                { id: "2", name: "Non Klinis" },
                            ]}
                        />
                        <SelectField
                            label="Status"
                            value={data.currently_id}
                            onChange={(value) => updateFilter("currently_id", value)}
                            options={[
                                { id: "", name: "Semua Status" },
                                { id: "1", name: "Sedang Terjadi Saja" },
                                { id: "2", name: "Tidak Sedang Terjadi Saja" },
                            ]}
                        />
                        <SelectField
                            label="User Pembuat"
                            value={data.user_id}
                            onChange={(value) => updateFilter("user_id", value)}
                            options={withAllOption("Semua User", options.users)}
                        />
                        {data.copy_mode === "year" && (
                            <SelectField
                                label="Unit / PIC"
                                value={data.pic_id}
                                onChange={(value) => updateFilter("pic_id", value)}
                                options={withAllOption("Semua Unit", options.pics)}
                            />
                        )}
                        <SelectField
                            label="Kategori Risiko"
                            value={data.risk_category_id}
                            onChange={(value) => updateFilter("risk_category_id", value)}
                            options={withAllOption("Semua Kategori", options.riskCategories)}
                        />
                        <SelectField
                            label="Tipe Risiko"
                            value={data.risk_type_id}
                            onChange={(value) => updateFilter("risk_type_id", value)}
                            options={withAllOption("Semua Tipe", options.riskTypes)}
                        />
                        <SelectField
                            label="Jenis Risiko"
                            value={data.risk_variety_id}
                            onChange={(value) => updateFilter("risk_variety_id", value)}
                            options={withAllOption("Semua Jenis", options.riskVarieties)}
                        />
                        <SelectField
                            label="Sumber Identifikasi"
                            value={data.identification_source_id}
                            onChange={(value) =>
                                updateFilter("identification_source_id", value)
                            }
                            options={withAllOption(
                                "Semua Sumber",
                                options.identificationSources,
                            )}
                        />
                        <SelectField
                            label="Prioritas"
                            value={data.priority_scope}
                            onChange={(value) => updateFilter("priority_scope", value)}
                            options={[
                                { id: "all", name: "Semua Risiko" },
                                { id: "priority", name: "Risiko Prioritas" },
                                { id: "bpkp", name: "Prioritas BPKP" },
                            ]}
                        />
                    </div>

                    <div className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5 text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <ClipboardDocumentCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                        <div className="flex items-start gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                            Preview otomatis diperbarui setiap filter berubah. Tombol eksekusi
                            hanya membuat data baru, bukan mengubah data target yang sudah ada.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <App children={page} />;
