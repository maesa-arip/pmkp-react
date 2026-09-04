import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React from "react";

const colorOptions = [
    {
        label: "Sangat Rendah",
        shortLabel: "SR",
        value: "#16a34a",
        text: "text-white",
    },
    { label: "Rendah", shortLabel: "R", value: "#38bdf8", text: "text-slate-950" },
    { label: "Sedang", shortLabel: "S", value: "#facc15", text: "text-slate-950" },
    { label: "Tinggi", shortLabel: "T", value: "#f97316", text: "text-white" },
    {
        label: "Sangat Tinggi",
        shortLabel: "ST",
        value: "#dc2626",
        text: "text-white",
    },
    { label: "Ekstrim", shortLabel: "E", value: "#991b1b", text: "text-white" },
];

const gradingFields = [
    {
        id: "klinis",
        number: "1",
        title: "Klinis",
        nameId: "name",
        colorId: "warna_klinis",
        placeholder: "Contoh: Extreme",
    },
    {
        id: "nonklinis",
        number: "2",
        title: "Non Klinis",
        nameId: "name_nonklinis",
        colorId: "warna_nonklinis",
        placeholder: "Contoh: Ekstrim",
    },
    {
        id: "klinis_pergub",
        number: "3",
        title: "Klinis Pergub",
        nameId: "name_klinis_pergub",
        colorId: "warna_klinis_pergub",
        placeholder: "Contoh: EKSTRIM",
    },
    {
        id: "nonklinis_pergub",
        number: "4",
        title: "Non Klinis Pergub",
        nameId: "name_nonklinis_pergub",
        colorId: "warna_nonklinis_pergub",
        placeholder: "Contoh: EKSTRIM",
    },
    {
        id: "klinis_bpkp",
        number: "5",
        title: "Klinis BPKP",
        nameId: "name_klinis_bpkp",
        colorId: "warna_klinis_bpkp",
        placeholder: "Contoh: High",
    },
    {
        id: "nonklinis_bpkp",
        number: "6",
        title: "Non Klinis BPKP",
        nameId: "name_nonklinis_bpkp",
        colorId: "warna_nonklinis_bpkp",
        placeholder: "Contoh: High",
    },
    {
        id: "ikp",
        number: "7",
        title: "IKP",
        nameId: "name_ikp",
        colorId: "warna_ikp",
        placeholder: "Contoh: Ekstrim",
    },
];

const getCodeParts = (kode) => {
    const digits = String(kode || "").replace(/\D/g, "");

    return {
        dampak: digits.charAt(0) || "",
        probabilitas: digits.charAt(1) || "",
    };
};

const gradingValueFields = [
    "name",
    "warna_klinis",
    "name_nonklinis",
    "warna_nonklinis",
    "name_klinis_pergub",
    "warna_klinis_pergub",
    "name_nonklinis_pergub",
    "warna_nonklinis_pergub",
    "name_klinis_bpkp",
    "warna_klinis_bpkp",
    "name_nonklinis_bpkp",
    "warna_nonklinis_bpkp",
    "name_ikp",
    "warna_ikp",
    "name_bpkp",
    "warna_bpkp",
];

const impactHeaders = [
    { value: "1", label: "Tidak Signifikan" },
    { value: "2", label: "Minor" },
    { value: "3", label: "Moderat" },
    { value: "4", label: "Mayor" },
    { value: "5", label: "Katastropik" },
];

const probabilityRows = [
    { value: "5", label: "Sangat sering terjadi" },
    { value: "4", label: "Sering terjadi" },
    { value: "3", label: "Mungkin terjadi" },
    { value: "2", label: "Jarang terjadi" },
    { value: "1", label: "Sangat jarang terjadi" },
];

const defaultMatrixColor = (score) => {
    if (score >= 16) return colorOptions[5];
    if (score >= 10) return colorOptions[4];
    if (score >= 8) return colorOptions[3];
    if (score >= 5) return colorOptions[2];
    if (score >= 3) return colorOptions[1];

    return colorOptions[0];
};

const getReadableTextColor = (hexColor) => {
    const hex = String(hexColor || "").replace("#", "");
    const normalized =
        hex.length === 3
            ? hex
                  .split("")
                  .map((char) => `${char}${char}`)
                  .join("")
            : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return "text-slate-950";
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.62 ? "text-slate-950" : "text-white";
};

const getMatrixCellStyle = (kode, latestRiskGradings) => {
    const latest = latestRiskGradings?.[kode];
    const score = Number(kode.charAt(0)) * Number(kode.charAt(1));
    const color = latest?.warna_klinis || defaultMatrixColor(score).value;

    return {
        color,
        label: latest?.name || defaultMatrixColor(score).label,
    };
};

const ColorInput = ({ id, value, error, update }) => {
    const selectedOption = colorOptions.find((option) => option.value === value);
    const selectedColor = value || "#e2e8f0";

    return (
        <div>
            <div className="mt-1 flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900">
                <span
                    className="block h-8 w-8 shrink-0 rounded-md border border-white shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                />
                <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {selectedOption?.label || "Belum dipilih"}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {value || "Klik salah satu warna di bawah"}
                    </div>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {colorOptions.map((option) => (
                    <button
                        key={`${id}-${option.value}`}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => update(id, option.value)}
                        className={`flex min-h-[44px] items-center gap-2 rounded-md border px-3 text-left text-xs font-black transition ${
                            value === option.value
                                ? "border-slate-900 ring-2 ring-sky-500/40 dark:border-white"
                                : "border-slate-200 dark:border-slate-700"
                        } ${option.text}`}
                        style={{ backgroundColor: option.value }}
                    >
                        <span
                            className="flex h-6 w-8 shrink-0 items-center justify-center rounded border border-white/60 bg-white/20 text-[10px]"
                        >
                            {option.shortLabel}
                        </span>
                        <span className="leading-tight">{option.label}</span>
                    </button>
                ))}
            </div>

            <InputError message={error} className="mt-2" />
        </div>
    );
};

const RiskMatrixPicker = ({
    dampak,
    probabilitas,
    latestRiskGradings,
    lockIdentity,
    onPick,
}) => {
    const selectedKode = dampak && probabilitas ? `${dampak}${probabilitas}` : "";

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-900/70">
                <div className="text-sm font-black text-slate-900 dark:text-white">
                    Matriks Analisa Risiko
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Kolom = Dampak/Konsekuensi, baris = Frekuensi/Likelihood
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[780px]">
                    <div className="grid grid-cols-[160px_repeat(5,minmax(110px,1fr))]">
                        <div className="flex min-h-[76px] items-center justify-center border-b border-r border-slate-300 bg-slate-100 px-3 text-center text-xs font-black uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Frekuensi / Likelihood
                        </div>
                        {impactHeaders.map((impact) => (
                            <div
                                key={impact.value}
                                className="flex min-h-[76px] flex-col items-center justify-center border-b border-r border-slate-300 bg-slate-50 px-3 text-center dark:border-slate-700 dark:bg-slate-900/80"
                            >
                                <span className="text-xs font-bold leading-tight text-slate-700 dark:text-slate-200">
                                    {impact.label}
                                </span>
                                <span className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                    {impact.value}
                                </span>
                            </div>
                        ))}

                        {probabilityRows.map((probability) => (
                            <React.Fragment key={probability.value}>
                                <div className="flex min-h-[86px] flex-col items-center justify-center border-b border-r border-slate-300 bg-slate-50 px-3 text-center dark:border-slate-700 dark:bg-slate-900/80">
                                    <span className="text-xs font-bold leading-tight text-slate-700 dark:text-slate-200">
                                        {probability.label}
                                    </span>
                                    <span className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                        {probability.value}
                                    </span>
                                </div>
                                {impactHeaders.map((impact) => {
                                    const kode = `${impact.value}${probability.value}`;
                                    const score = Number(impact.value) * Number(probability.value);
                                    const cell = getMatrixCellStyle(kode, latestRiskGradings);
                                    const isSelected = kode === selectedKode;

                                    return (
                                        <button
                                            key={kode}
                                            type="button"
                                            disabled={lockIdentity}
                                            onClick={() => onPick(impact.value, probability.value)}
                                            className={`relative flex min-h-[86px] flex-col items-center justify-center border-b border-r border-slate-300 px-2 text-center transition dark:border-slate-700 ${
                                                lockIdentity
                                                    ? "cursor-not-allowed"
                                                    : "hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                            } ${
                                                isSelected
                                                    ? "z-10 ring-4 ring-sky-500 ring-offset-2"
                                                    : ""
                                            } ${getReadableTextColor(cell.color)}`}
                                            style={{ backgroundColor: cell.color }}
                                        >
                                            <span className="text-sm font-black leading-tight">
                                                {cell.label}
                                            </span>
                                            <span className="mt-1 text-2xl font-black">{score}</span>
                                            <span className="text-[10px] font-bold opacity-80">
                                                Kode {kode}
                                            </span>
                                        </button>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GradingInput = ({ field, data, errors, update }) => (
    <section className="col-span-12 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                {field.number}
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {field.title}
            </h3>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12 lg:col-span-5">
                <InputLabel for={field.nameId} value="Nama Grading" />
                <TextInput
                    id={field.nameId}
                    value={data[field.nameId]}
                    handleChange={(e) => update(field.nameId, e.target.value)}
                    type="text"
                    placeholder={field.placeholder}
                    className="block w-full mt-1"
                />
                <InputError message={errors[field.nameId]} className="mt-2" />
            </div>

            <div className="col-span-12 lg:col-span-7">
                <InputLabel for={field.colorId} value="Warna" />
                <ColorInput
                    id={field.colorId}
                    value={data[field.colorId]}
                    error={errors[field.colorId]}
                    update={update}
                />
            </div>
        </div>
    </section>
);

export default function Form({
    errors,
    submit,
    data,
    setData,
    closeButton,
    lockIdentity = false,
    latestRiskGradings = {},
    latestRiskGradingYear = null,
    activeType = null,
}) {
    const update = (field, value) => setData(field, value);
    const codeParts = getCodeParts(data.kode);
    const dampak = data.dampak || codeParts.dampak;
    const probabilitas = data.probabilitas || codeParts.probabilitas;
    const visibleGradingFields =
        lockIdentity && activeType?.id
            ? gradingFields.filter((field) => field.id === activeType.id)
            : gradingFields;

    const updateMatrixCell = (nextDampak, nextProbabilitas) => {
        const nextKode = nextDampak && nextProbabilitas ? `${nextDampak}${nextProbabilitas}` : "";
        const latest = nextKode ? latestRiskGradings[nextKode] : null;
        const nextData = {
            ...data,
            dampak: nextDampak,
            probabilitas: nextProbabilitas,
            kode: nextKode,
        };

        if (!lockIdentity && latest) {
            gradingValueFields.forEach((name) => {
                nextData[name] = latest[name] || "";
            });
        }

        setData(nextData);
    };

    return (
        <>
            <div className="px-4 py-5 bg-white dark:bg-[#0f172a] sm:p-6">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 sm:col-span-3">
                                <InputLabel for="tahun" value="Tahun" />
                                <TextInput
                                    id="tahun"
                                    value={data.tahun}
                                    handleChange={(e) => update("tahun", e.target.value)}
                                    type="number"
                                    min="2000"
                                    max="2100"
                                    readOnly={lockIdentity}
                                    className={`block w-full mt-1 bg-white dark:bg-slate-900 ${
                                        lockIdentity ? "cursor-not-allowed text-slate-500" : ""
                                    }`}
                                />
                                <InputError message={errors.tahun} className="mt-2" />
                            </div>

                            <div className="col-span-12 sm:col-span-3">
                                <InputLabel for="dampak" value="Dampak" />
                                <div className="mt-1 flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-white px-3 text-lg font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                    {dampak || "-"}
                                </div>
                            </div>

                            <div className="col-span-12 sm:col-span-3">
                                <InputLabel for="probabilitas" value="Probabilitas" />
                                <div className="mt-1 flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-white px-3 text-lg font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                    {probabilitas || "-"}
                                </div>
                            </div>

                            <div className="col-span-12 sm:col-span-3">
                                <InputLabel for="kode" value="Kode Otomatis" />
                                <TextInput
                                    id="kode"
                                    value={data.kode}
                                    handleChange={() => {}}
                                    type="text"
                                    readOnly
                                    className="block w-full mt-1 cursor-not-allowed bg-slate-100 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Kode = Dampak + Probabilitas
                                </p>
                            </div>

                            <div className="col-span-12">
                                <InputError message={errors.kode} className="mt-1" />
                                {!lockIdentity && latestRiskGradingYear && (
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Klik kotak pada matriks. Nama grading dan warna otomatis mengikuti data tahun terakhir ({latestRiskGradingYear}) jika kode tersedia.
                                    </p>
                                )}
                                {lockIdentity && (
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Tahun dan kode dikunci saat edit agar relasi transaksi tetap konsisten.
                                    </p>
                                )}
                            </div>

                            {!lockIdentity && (
                                <div className="col-span-12">
                                    <RiskMatrixPicker
                                        dampak={dampak}
                                        probabilitas={probabilitas}
                                        latestRiskGradings={latestRiskGradings}
                                        lockIdentity={lockIdentity}
                                        onPick={updateMatrixCell}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {lockIdentity && activeType?.label && (
                        <div className="col-span-12 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">
                            Mode edit: hanya mengubah {activeType.label} untuk tahun {data.tahun} kode {data.kode}.
                        </div>
                    )}

                    {visibleGradingFields.map((field) => (
                        <GradingInput
                            key={field.nameId}
                            field={field}
                            data={data}
                            errors={errors}
                            update={update}
                        />
                    ))}
                </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 sm:px-6 sm:flex sm:flex-row-reverse">
                <PrimaryButton>{submit}</PrimaryButton>
                <SecondaryButton type="button" className="mx-2" onClick={closeButton}>
                    Batal
                </SecondaryButton>
            </div>
        </>
    );
}
