import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import ComboboxPage from "@/Components/ComboboxPage";
import React from "react";

const colorOptions = [
    { label: "Merah", value: "#dc2626", text: "text-white" },
    { label: "Oranye", value: "#f97316", text: "text-white" },
    { label: "Kuning", value: "#facc15", text: "text-slate-900" },
    { label: "Hijau", value: "#16a34a", text: "text-white" },
    { label: "Biru", value: "#2563eb", text: "text-white" },
    { label: "Abu", value: "#64748b", text: "text-white" },
];

const scoreOptions = [
    { id: "1", value: "1", name: "Nilai 1" },
    { id: "2", value: "2", name: "Nilai 2" },
    { id: "3", value: "3", name: "Nilai 3" },
    { id: "4", value: "4", name: "Nilai 4" },
    { id: "5", value: "5", name: "Nilai 5" },
];

const gradingFields = [
    {
        number: "1",
        title: "Klinis",
        nameId: "name",
        colorId: "warna_klinis",
        placeholder: "Contoh: Extreme",
    },
    {
        number: "2",
        title: "Non Klinis",
        nameId: "name_nonklinis",
        colorId: "warna_nonklinis",
        placeholder: "Contoh: Ekstrim",
    },
    {
        number: "3",
        title: "Non Klinis Pergub",
        nameId: "name_nonklinis_pergub",
        colorId: "warna_nonklinis_pergub",
        placeholder: "Contoh: EKSTRIM",
    },
    {
        number: "4",
        title: "IKP",
        nameId: "name_ikp",
        colorId: "warna_ikp",
        placeholder: "Contoh: Ekstrim",
    },
    {
        number: "5",
        title: "BPKP",
        nameId: "name_bpkp",
        colorId: "warna_bpkp",
        placeholder: "Contoh: High",
    },
];

const getCodeParts = (kode) => {
    const digits = String(kode || "").replace(/\D/g, "");

    return {
        dampak: digits.charAt(0) || "",
        probabilitas: digits.charAt(1) || "",
    };
};

const emptyScore = { id: "", value: "", name: "Pilih" };

const getSelectedScore = (value) =>
    scoreOptions.find((option) => option.id === String(value || "")) || emptyScore;

const gradingValueFields = [
    "name",
    "warna_klinis",
    "name_nonklinis",
    "warna_nonklinis",
    "name_nonklinis_pergub",
    "warna_nonklinis_pergub",
    "name_ikp",
    "warna_ikp",
    "name_bpkp",
    "warna_bpkp",
];

const ColorInput = ({ id, value, error, update }) => {
    const selectedColor = value || "#64748b";

    return (
        <div>
            <div className="grid grid-cols-12 gap-3 mt-1">
                <label
                    htmlFor={id}
                    className="col-span-12 sm:col-span-4 flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900"
                >
                    <span
                        className="block h-8 w-8 shrink-0 rounded-md border border-white shadow-sm"
                        style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {value || "Belum diatur"}
                    </span>
                </label>

                <div className="col-span-12 sm:col-span-8 flex items-center gap-2">
                    <input
                        id={id}
                        value={selectedColor}
                        onChange={(e) => update(id, e.target.value)}
                        type="color"
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
                    />
                    <TextInput
                        id={`${id}_text`}
                        value={value || ""}
                        handleChange={(e) => update(id, e.target.value)}
                        type="text"
                        placeholder="#dc2626"
                        className="block w-full"
                    />
                </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {colorOptions.map((option) => (
                    <button
                        key={`${id}-${option.value}`}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => update(id, option.value)}
                        className={`flex h-9 items-center justify-center rounded-md border px-2 text-xs font-bold transition ${
                            value === option.value
                                ? "border-slate-900 ring-2 ring-sky-500/40 dark:border-white"
                                : "border-slate-200 dark:border-slate-700"
                        } ${option.text}`}
                        style={{ backgroundColor: option.value }}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <InputError message={error} className="mt-2" />
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

const LockedScore = ({ label, value }) => (
    <div className="mt-1 flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {label} {value || "-"}
    </div>
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
}) {
    const update = (field, value) => setData(field, value);
    const codeParts = getCodeParts(data.kode);
    const dampak = data.dampak || codeParts.dampak;
    const probabilitas = data.probabilitas || codeParts.probabilitas;

    const updateCodePart = (field, value) => {
        const nextDampak = field === "dampak" ? value : dampak;
        const nextProbabilitas = field === "probabilitas" ? value : probabilitas;
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
                                {lockIdentity ? (
                                    <LockedScore label="Dampak" value={dampak} />
                                ) : (
                                    <ComboboxPage
                                        ShouldMap={scoreOptions}
                                        selected={getSelectedScore(dampak)}
                                        onChange={(option) => updateCodePart("dampak", option.id)}
                                    />
                                )}
                            </div>

                            <div className="col-span-12 sm:col-span-3">
                                <InputLabel for="probabilitas" value="Probabilitas" />
                                {lockIdentity ? (
                                    <LockedScore label="Probabilitas" value={probabilitas} />
                                ) : (
                                    <ComboboxPage
                                        ShouldMap={scoreOptions}
                                        selected={getSelectedScore(probabilitas)}
                                        onChange={(option) => updateCodePart("probabilitas", option.id)}
                                    />
                                )}
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
                                        Nama grading dan warna otomatis mengikuti data tahun terakhir ({latestRiskGradingYear}) jika kode tersedia.
                                    </p>
                                )}
                                {lockIdentity && (
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Tahun dan kode dikunci saat edit agar relasi transaksi tetap konsisten.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {gradingFields.map((field) => (
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
