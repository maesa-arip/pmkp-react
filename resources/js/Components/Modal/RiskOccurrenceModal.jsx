import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import EditModal from "./EditModal";

export default function RiskOccurrenceModal({ risk, updateRoute, onClose, onRecorded }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [dampakKejadian, setDampakKejadian] = useState(risk.dampak || "");
    const submitting = useRef(false);
    const occurring = Number(risk.currently_id) === 1;
    const statusHistory = (risk.risk_register_histories || [])
        .filter((history) => !history.event_type || history.event_type === "status_changed")
        .sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0)
            || Number(a.id) - Number(b.id));
    // A resolved status closes all preceding occurrences in the register.
    const unresolvedOccurrences = occurring ? statusHistory.reduce((open, history) => {
        if (Number(history.currently_id) === 2) return [];
        if (Number(history.currently_id) === 1) open.push(history);
        return open;
    }, []) : [];
    const formatOccurrenceDate = (value) => value && !Number.isNaN(Date.parse(value))
        ? new Date(value).toLocaleString("id-ID", {
            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
        })
        : "Tanggal belum tersedia";

    const recordOccurrence = () => {
        if (submitting.current) return;
        submitting.current = true;
        setProcessing(true);
        setError("");
        router.put(route(updateRoute, risk.id), { ...risk, currently_id: 1, dampak_kejadian: dampakKejadian }, {
            preserveScroll: true,
            onSuccess: (page) => {
                onRecorded(page);
                onClose();
            },
            onError: (errors) => setError(Object.values(errors).flat().join(" ") || "Kejadian belum tersimpan. Silakan coba lagi."),
            onFinish: () => {
                submitting.current = false;
                setProcessing(false);
            },
        });
    };

    return (
        <EditModal isOpenEditDialog={true} size="max-w-md" title="Catat Kejadian Risiko">
            <div className="min-w-0 text-sm leading-relaxed">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Risiko yang dipilih</p>
                <p className="mt-1 font-semibold break-words text-slate-900 dark:text-white">{risk.kode_risiko}</p>
                <p className="mt-2 break-words whitespace-pre-wrap text-slate-600 dark:text-slate-400">{risk.pernyataan_risiko || risk.resiko}</p>
            </div>
            <div role="note" className="p-4 mt-5 border-l-4 border-rose-500 bg-rose-50 dark:bg-rose-500/10">
                <h4 className="flex items-start gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
                    <ExclamationTriangleIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
                    {occurring ? "RISIKO INI MASIH SEDANG TERJADI" : "KONFIRMASI PENCATATAN KEJADIAN"}
                </h4>
                <div className="mt-4 text-sm text-rose-900 dark:text-rose-200">
                    <h5 className="font-bold">
                        Kejadian yang belum selesai{unresolvedOccurrences.length > 0 ? ` (${unresolvedOccurrences.length})` : ""}
                    </h5>
                    {unresolvedOccurrences.length > 0 ? (
                        <>
                            <p className="mt-1 text-xs">Tanggal dan waktu pencatatan</p>
                            <ol aria-label="Kejadian yang belum selesai" className="max-h-48 mt-2 overflow-y-auto divide-y divide-rose-200 dark:divide-rose-500/30">
                                {unresolvedOccurrences.map((history, index) => (
                                    <li key={history.id || index} className="flex items-start gap-2 py-2">
                                        <span className="shrink-0">{index + 1}.</span>
                                        <div className="min-w-0">
                                            <time className="font-semibold break-words" dateTime={history.created_at || undefined}>
                                                {formatOccurrenceDate(history.created_at)}
                                            </time>
                                            {history.snapshot?.dampak_kejadian && (
                                                <p className="mt-1 text-xs leading-relaxed break-words whitespace-pre-wrap text-rose-800 dark:text-rose-300">
                                                    {history.snapshot.dampak_kejadian}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </>
                    ) : (
                        <p className="mt-1">{occurring
                            ? "Rincian kejadian yang belum selesai belum tersedia."
                            : "Tidak ada kejadian yang belum selesai."}</p>
                    )}
                </div>
                <p className="pt-4 mt-4 text-base font-bold leading-relaxed border-t border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200">
                    {occurring
                        ? "Apakah Anda yakin ingin mencatat risiko sedang terjadi lagi?"
                        : "Apakah Anda yakin risiko ini sedang terjadi?"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-rose-800 dark:text-rose-300">
                    {occurring
                        ? "Konfirmasi ini akan menambah kejadian baru. Kejadian sebelumnya tetap tersimpan."
                        : "Konfirmasi ini akan mencatat kejadian baru dan mengubah status risiko menjadi sedang terjadi."}
                </p>
            </div>
            <div className="mt-5">
                <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Dampak dari Kejadian Tersebut
                </label>
                <textarea
                    value={dampakKejadian}
                    onChange={(event) => setDampakKejadian(event.target.value)}
                    rows={4}
                    className="block w-full rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100 dark:focus:bg-[#020817]"
                    placeholder="Tuliskan dampak dari kejadian yang sedang terjadi..."
                />
            </div>
            {error && <p role="alert" className="mt-4 text-sm break-words text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex flex-wrap justify-end gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                <button type="button" disabled={processing} onClick={onClose} className="px-4 py-2.5 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Batal</button>
                <button type="button" disabled={processing} onClick={recordOccurrence} className="px-4 py-2.5 text-sm font-bold text-white rounded-lg bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-wait">
                    {processing ? "Menyimpan..." : occurring ? "Ya, Catat Lagi" : "Ya, Catat Kejadian"}
                </button>
            </div>
        </EditModal>
    );
}
