import React from "react";

const gradingStyle = (color) => {
    if (!color) return {};
    const hex = color.replace("#", "");
    const normalized = hex.length === 3
        ? hex.split("").map((char) => char + char).join("")
        : hex;
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return { backgroundColor: color };
    const [r, g, b] = [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16));
    return {
        backgroundColor: color,
        color: (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#0f172a" : "#ffffff",
    };
};

export default function FgdGradingPreview({ dampak, probabilitas, matrix = {} }) {
    const validScore = (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5;
    const complete = validScore(dampak) && validScore(probabilitas);
    const grading = complete ? matrix[`${Number(dampak)}${Number(probabilitas)}`] : null;

    return (
        <div aria-label="Grading FGD" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 px-2 py-4 dark:border-slate-700">
            <div className="min-w-0 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Grading Risiko
                <span className="mt-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Dampak: {validScore(dampak) ? dampak : "-"} | Probabilitas: {validScore(probabilitas) ? probabilitas : "-"}
                </span>
            </div>
            <span style={gradingStyle(grading?.color)} className="max-w-full break-words rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-black/10 dark:bg-slate-800 dark:text-slate-200">
                {grading?.name || (complete ? "Grading belum tersedia" : "Belum dinilai")}
            </span>
        </div>
    );
}
