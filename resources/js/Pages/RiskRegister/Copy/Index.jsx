import App from "@/Layouts/App";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useMemo, useState } from "react";
import {
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    DocumentDuplicateIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";

const selectClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100";

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

const OptionList = ({ items }) =>
    items.map((item) => (
        <option key={item.id} value={item.id}>
            {item.name}
        </option>
    ));

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
    const { data, setData } = useForm({
        source_year: filters.source_year || 2025,
        target_year: filters.target_year || 2026,
        tipe_id: filters.tipe_id || "",
        currently_id: filters.currently_id || "",
        user_id: filters.user_id || "",
        pic_id: filters.pic_id || "",
        risk_category_id: filters.risk_category_id || "",
        risk_type_id: filters.risk_type_id || "",
        risk_variety_id: filters.risk_variety_id || "",
        identification_source_id: filters.identification_source_id || "",
        priority_scope: filters.priority_scope || "all",
    });

    const queryData = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== "" && value !== null),
            ),
        [data],
    );

    const refreshPreview = (event) => {
        event.preventDefault();
        router.get(route("riskRegisterCopy.index"), queryData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const executeCopy = () => {
        setIsExecuting(true);
        router.post(route("riskRegisterCopy.store"), queryData, {
            preserveScroll: true,
            onFinish: () => setIsExecuting(false),
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
                                Copy Risk Register Antar Tahun
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                Salin data tahun lama ke tahun baru tanpa menimpa data yang sudah ada.
                                Sistem melewati risiko yang sudah pernah disalin atau sudah punya padanan manual.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={executeCopy}
                            disabled={isExecuting || (preview?.eligible || 0) < 1}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                            {isExecuting ? "Menyalin..." : "Eksekusi Copy"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <StatCard label="Data Sumber" value={preview?.source_total} />
                    <StatCard label="Siap Dicopy" value={preview?.eligible} tone="emerald" />
                    <StatCard label="Sudah Pernah Dicopy" value={preview?.already_copied} tone="sky" />
                    <StatCard label="Padanan 2026 Manual" value={preview?.equivalent_target} tone="amber" />
                </div>

                <form
                    onSubmit={refreshPreview}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0f172a]"
                >
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="Tahun Sumber">
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.source_year}
                                onChange={(e) => setData("source_year", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Tahun Tujuan">
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.target_year}
                                onChange={(e) => setData("target_year", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Jenis Register">
                            <select
                                value={data.tipe_id}
                                onChange={(e) => setData("tipe_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua</option>
                                <option value="1">Klinis</option>
                                <option value="2">Non Klinis</option>
                            </select>
                        </Field>
                        <Field label="Status">
                            <select
                                value={data.currently_id}
                                onChange={(e) => setData("currently_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Sedang Terjadi Saja</option>
                                <option value="2">Tidak Sedang Terjadi Saja</option>
                            </select>
                        </Field>
                        <Field label="User Pembuat">
                            <select
                                value={data.user_id}
                                onChange={(e) => setData("user_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua User</option>
                                <OptionList items={options.users || []} />
                            </select>
                        </Field>
                        <Field label="Unit / PIC">
                            <select
                                value={data.pic_id}
                                onChange={(e) => setData("pic_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua Unit</option>
                                <OptionList items={options.pics || []} />
                            </select>
                        </Field>
                        <Field label="Kategori Risiko">
                            <select
                                value={data.risk_category_id}
                                onChange={(e) => setData("risk_category_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua Kategori</option>
                                <OptionList items={options.riskCategories || []} />
                            </select>
                        </Field>
                        <Field label="Tipe Risiko">
                            <select
                                value={data.risk_type_id}
                                onChange={(e) => setData("risk_type_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua Tipe</option>
                                <OptionList items={options.riskTypes || []} />
                            </select>
                        </Field>
                        <Field label="Jenis Risiko">
                            <select
                                value={data.risk_variety_id}
                                onChange={(e) => setData("risk_variety_id", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Semua Jenis</option>
                                <OptionList items={options.riskVarieties || []} />
                            </select>
                        </Field>
                        <Field label="Sumber Identifikasi">
                            <select
                                value={data.identification_source_id}
                                onChange={(e) =>
                                    setData("identification_source_id", e.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Semua Sumber</option>
                                <OptionList items={options.identificationSources || []} />
                            </select>
                        </Field>
                        <Field label="Prioritas">
                            <select
                                value={data.priority_scope}
                                onChange={(e) => setData("priority_scope", e.target.value)}
                                className={selectClass}
                            >
                                <option value="all">Semua Risiko</option>
                                <option value="priority">Risiko Prioritas</option>
                                <option value="bpkp">Prioritas BPKP</option>
                            </select>
                        </Field>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <ClipboardDocumentCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                            <span>
                                Preview wajib dicek sebelum eksekusi. Tombol eksekusi hanya akan
                                membuat data baru, bukan mengubah data target yang sudah ada.
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <ArrowPathIcon className="mr-2 h-4 w-4" />
                            Refresh Preview
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Index.layout = (page) => <App children={page} />;
