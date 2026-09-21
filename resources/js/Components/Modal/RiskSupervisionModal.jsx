import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import EditModal from "./EditModal";

// The two supervision levels share one form; each writes its own verification row.
const levels = [
    {
        id: "admin",
        label: "Admin Risiko",
        route: "riskregister.storeverificationadminpriority",
        relation: "verificationpriorityadmin",
    },
    {
        id: "management",
        label: "Level Manajemen",
        route: "riskregister.storeverificationmanagementpriority",
        relation: "verificationprioritymanagement",
    },
];

const formatSupervisionDate = (value) =>
    value && !Number.isNaN(Date.parse(value))
        ? new Date(value).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "Belum disupervisi";

export default function RiskSupervisionModal({ risk, onClose, onRecorded }) {
    const [level, setLevel] = useState(levels[0].id);
    const current = levels.find((item) => item.id === level) || levels[0];
    const existing = risk?.[current.relation] || null;
    const [keterangan, setKeterangan] = useState(existing?.keterangan || "");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const submitting = useRef(false);

    const changeLevel = (nextLevel) => {
        const next = levels.find((item) => item.id === nextLevel) || levels[0];
        setLevel(nextLevel);
        setKeterangan(risk?.[next.relation]?.keterangan || "");
        setError("");
    };

    const recordSupervision = () => {
        if (submitting.current) return;
        if (!keterangan.trim()) {
            setError("Keterangan supervisi wajib diisi.");
            return;
        }
        submitting.current = true;
        setProcessing(true);
        setError("");
        router.put(
            route(current.route),
            { id: risk.id, keterangan },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    onRecorded(page);
                    onClose();
                },
                onError: (errors) =>
                    setError(
                        Object.values(errors).flat().join(" ") ||
                            "Supervisi belum tersimpan. Silakan coba lagi.",
                    ),
                onFinish: () => {
                    submitting.current = false;
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <EditModal isOpenEditDialog={true} size="max-w-md" title="Catat Supervisi Risiko">
            <div className="min-w-0 text-sm leading-relaxed">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Risiko yang dipilih</p>
                <p className="mt-1 font-semibold break-words text-slate-900 dark:text-white">{risk.kode_risiko}</p>
                <p className="mt-2 break-words whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                    {risk.pernyataan_risiko || risk.resiko}
                </p>
            </div>

            <div className="p-4 mt-5 border-l-4 border-sky-500 bg-sky-50 dark:bg-sky-500/10">
                <h4 className="flex items-start gap-2 text-sm font-bold text-sky-800 dark:text-sky-300">
                    <ShieldCheckIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
                    Supervisi terakhir
                </h4>
                <dl className="mt-3 space-y-2 text-sm text-sky-900 dark:text-sky-200">
                    {levels.map((item) => (
                        <div key={item.id} className="flex flex-wrap items-baseline gap-x-2">
                            <dt className="text-xs font-bold uppercase tracking-wide">{item.label}</dt>
                            <dd className="min-w-0">
                                <time
                                    className="font-semibold break-words"
                                    dateTime={risk?.[item.relation]?.created_at || undefined}
                                >
                                    {formatSupervisionDate(risk?.[item.relation]?.created_at)}
                                </time>
                                {risk?.[item.relation]?.keterangan && (
                                    <p className="mt-0.5 text-xs leading-relaxed break-words whitespace-pre-wrap text-sky-800 dark:text-sky-300">
                                        {risk[item.relation].keterangan}
                                    </p>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <fieldset className="mt-5">
                <legend className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Supervisi Sebagai
                </legend>
                <div className="flex flex-wrap gap-2">
                    {levels.map((item) => (
                        <label
                            key={item.id}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                                level === item.id
                                    ? "border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-sky-400"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                            }`}
                        >
                            <input
                                type="radio"
                                name="supervision-level"
                                value={item.id}
                                checked={level === item.id}
                                onChange={(event) => changeLevel(event.target.value)}
                                className="text-sky-600 border-slate-300 focus:ring-sky-500/50 dark:border-slate-600 dark:bg-slate-900"
                            />
                            {item.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="mt-5">
                <label
                    htmlFor="supervisi-keterangan"
                    className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                >
                    Keterangan Supervisi
                </label>
                <textarea
                    id="supervisi-keterangan"
                    value={keterangan}
                    onChange={(event) => setKeterangan(event.target.value)}
                    rows={4}
                    className="block w-full rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100 dark:focus:bg-[#020817]"
                    placeholder="Tuliskan hasil supervisi atas pengendalian risiko ini..."
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Menyimpan akan menimpa supervisi {current.label} yang tercatat sebelumnya, dan tanggalnya
                    ikut diperbarui.
                </p>
            </div>

            {error && (
                <p role="alert" className="mt-4 text-sm break-words text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap justify-end gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    disabled={processing}
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                    Batal
                </button>
                <button
                    type="button"
                    disabled={processing}
                    onClick={recordSupervision}
                    className="px-4 py-2.5 text-sm font-bold text-white rounded-lg bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-wait"
                >
                    {processing ? "Menyimpan..." : "Simpan Supervisi"}
                </button>
            </div>
        </EditModal>
    );
}
