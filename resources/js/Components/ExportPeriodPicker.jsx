import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from "@/Components/InputLabel";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

// One export file covers one year, because the register sheets group rows without a year key.
const quarters = [
    { id: "setahun", label: "Setahun penuh", from: [0, 1], to: [11, 31] },
    { id: "tw1", label: "Triwulan I", from: [0, 1], to: [2, 31] },
    { id: "tw2", label: "Triwulan II", from: [3, 1], to: [5, 30] },
    { id: "tw3", label: "Triwulan III", from: [6, 1], to: [8, 30] },
    { id: "tw4", label: "Triwulan IV", from: [9, 1], to: [11, 31] },
];

const iso = (date) => new Date(date).toLocaleDateString("en-CA");
const inputClass =
    "w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900 dark:text-white transition-all shadow-sm outline-none placeholder:text-slate-400";

/** Years the picker offers, newest first. Registers may still be filtered by hand. */
export function exportYears(span = 6) {
    const current = new Date().getFullYear();
    return Array.from({ length: span }, (_, i) => current - i);
}

/** Reads a failed blob response so the server validation message reaches the user. */
export async function exportErrorMessage(error) {
    const data = error?.response?.data;
    try {
        const text = data instanceof Blob ? await data.text() : JSON.stringify(data);
        const parsed = JSON.parse(text);
        const errors = parsed?.errors ? Object.values(parsed.errors).flat() : [];
        return errors[0] || parsed?.message || "Export gagal. Periksa rentang tanggal lalu coba lagi.";
    } catch (e) {
        return "Export gagal. Periksa rentang tanggal lalu coba lagi.";
    }
}

/**
 * Mandatory single-year range picker. `value` is { startDate, endDate } as YYYY-MM-DD,
 * and both are empty until the user picks a period.
 */
export default function ExportPeriodPicker({ value, onChange, years = exportYears() }) {
    const [year, setYear] = useState(years[0]);
    const [preset, setPreset] = useState("");
    const toDate = (text) => (text ? new Date(text + "T00:00:00") : "");

    const applyPreset = (quarter) => {
        setPreset(quarter.id);
        onChange({
            startDate: iso(new Date(year, quarter.from[0], quarter.from[1])),
            endDate: iso(new Date(year, quarter.to[0], quarter.to[1])),
        });
    };
    const changeYear = (nextYear) => {
        setYear(nextYear);
        setPreset("");
        onChange({ startDate: "", endDate: "" });
    };
    const changeDate = (field, date) => {
        setPreset("");
        onChange({ ...value, [field]: date ? iso(date) : "" });
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3 p-4 text-sm font-medium border shadow-sm text-sky-700 bg-sky-50 border-sky-200 rounded-xl dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30">
                <InformationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Pilih tahun lalu tekan Setahun penuh atau salah satu Triwulan. Satu berkas hanya boleh memuat satu tahun, jadi rentang tanggal wajib diisi.</p>
            </div>

            <div className="flex flex-col gap-1.5">
                <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="export-year" value="Tahun" />
                <select id="export-year" className={inputClass} value={year} onChange={(e) => changeYear(Number(e.target.value))}>
                    {years.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" value="Periode" />
                <div className="flex flex-wrap gap-2">
                    {quarters.map((quarter) => (
                        <button
                            key={quarter.id}
                            type="button"
                            aria-pressed={preset === quarter.id}
                            onClick={() => applyPreset(quarter)}
                            className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                                preset === quarter.id
                                    ? "border-sky-600 bg-sky-600 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                        >
                            {quarter.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="startDate" value="Tanggal Mulai *" />
                    <DatePicker
                        dateFormat="dd-MM-yyyy"
                        selected={toDate(value.startDate)}
                        id="startDate"
                        name="startDate"
                        autoComplete="off"
                        placeholderText="Pilih Tanggal Mulai"
                        className={inputClass}
                        minDate={new Date(year, 0, 1)}
                        maxDate={new Date(year, 11, 31)}
                        onChange={(date) => changeDate("startDate", date)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="endDate" value="Tanggal Akhir *" />
                    <DatePicker
                        dateFormat="dd-MM-yyyy"
                        selected={toDate(value.endDate)}
                        id="endDate"
                        name="endDate"
                        autoComplete="off"
                        placeholderText="Pilih Tanggal Akhir"
                        className={inputClass}
                        minDate={value.startDate ? toDate(value.startDate) : new Date(year, 0, 1)}
                        maxDate={new Date(year, 11, 31)}
                        onChange={(date) => changeDate("endDate", date)}
                    />
                </div>
            </div>
        </div>
    );
}

/** True when the range is filled and stays inside one year. */
export function isSingleYearRange(value) {
    if (!value.startDate || !value.endDate) return false;
    return value.startDate.slice(0, 4) === value.endDate.slice(0, 4) && value.startDate <= value.endDate;
}
