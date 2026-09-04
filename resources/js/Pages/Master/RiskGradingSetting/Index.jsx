import Select from "@/Components/ui/Select";
import App from "@/Layouts/App";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

const groups = [
    {
        title: "Tabel Risk Register",
        items: [
            {
                key: "risk_register_klinis",
                title: "Risk Register Klinis",
                description: "Badge grading pada tabel klinis.",
                allowed: ["klinis", "klinis_pergub", "klinis_bpkp"],
            },
            {
                key: "risk_register_nonklinis",
                title: "Risk Register Non Klinis",
                description: "Badge grading pada tabel non klinis.",
                allowed: ["nonklinis", "nonklinis_pergub", "nonklinis_bpkp"],
            },
        ],
    },
    {
        title: "Export Sidebar",
        items: [
            {
                key: "export_lars_dhp_klinis",
                title: "LARS DHP Klinis",
                description: "Kolom grading untuk export LARS DHP Klinis.",
                allowed: ["klinis", "klinis_pergub", "klinis_bpkp"],
            },
            {
                key: "export_lars_dhp_nonklinis",
                title: "PERGUB Non Klinis",
                description: "Kolom grading untuk export LARS DHP Non Klinis.",
                allowed: ["nonklinis", "nonklinis_pergub", "nonklinis_bpkp"],
            },
            {
                key: "export_bpkp",
                title: "Report BPKP",
                description: "Kolom grading untuk export BPKP.",
                allowed: ["klinis_bpkp", "nonklinis_bpkp", "nonklinis", "nonklinis_pergub"],
            },
        ],
    },
];

export default function Index({ settings, options }) {
    const { data, setData, put, processing, errors, isDirty } = useForm(settings);

    const filteredOptions = (allowed) =>
        options.filter((option) => allowed.includes(option.value));

    const submit = (event) => {
        event.preventDefault();
        put(route("riskGradingSettings.update"), {
            preserveScroll: true,
        });
    };

    return (
        <App>
            <Head title="Aturan Grading" />

            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                            Aturan Grading
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
                            Pilih matriks grading yang dipakai oleh tabel Risk Register dan menu export.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={processing || !isDirty}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Simpan Aturan
                    </button>
                </div>

                {groups.map((group) => (
                    <section key={group.title} className="space-y-3">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {group.title}
                        </h2>
                        <div className="grid gap-3 lg:grid-cols-2">
                            {group.items.map((item) => (
                                <div
                                    key={item.key}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-sm font-black text-slate-950 dark:text-white">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Select
                                        value={data[item.key]}
                                        onChange={(value) => setData(item.key, value)}
                                        options={filteredOptions(item.allowed)}
                                    />
                                    {errors[item.key] && (
                                        <p className="mt-2 text-xs font-semibold text-rose-600">
                                            {errors[item.key]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </form>
        </App>
    );
}
