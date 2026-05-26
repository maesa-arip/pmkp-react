import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import React from "react";

const colorOptions = [
    { label: "Merah", value: "#dc2626" },
    { label: "Oranye", value: "#f97316" },
    { label: "Kuning", value: "#facc15" },
    { label: "Hijau", value: "#16a34a" },
    { label: "Biru", value: "#2563eb" },
    { label: "Abu", value: "#64748b" },
];

export default function Form({ errors, submit, data, setData, closeButton }) {
    const update = (field, value) => setData(field, value);

    const ColorInput = ({ id, value, error }) => (
        <>
            <div className="flex items-center gap-2 mt-1">
                <input
                    id={id}
                    value={value || "#64748b"}
                    onChange={(e) => update(id, e.target.value)}
                    type="color"
                    className="w-12 h-10 p-1 bg-white border rounded-lg cursor-pointer border-slate-300 dark:bg-slate-900 dark:border-slate-700"
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
            <div className="flex flex-wrap gap-1.5 mt-2">
                {colorOptions.map((option) => (
                    <button
                        key={`${id}-${option.value}`}
                        type="button"
                        onClick={() => update(id, option.value)}
                        className={`h-7 w-7 rounded-lg border transition-transform hover:scale-105 ${
                            value === option.value
                                ? "border-slate-900 ring-2 ring-sky-500/40 dark:border-white"
                                : "border-slate-200 dark:border-slate-700"
                        }`}
                        style={{ backgroundColor: option.value }}
                        title={option.label}
                    />
                ))}
            </div>
            <InputError message={error} className="mt-2" />
        </>
    );

    const GradingInput = ({ nameId, colorId, label, className = "col-span-12 sm:col-span-6" }) => (
        <div className={className}>
            <InputLabel for={nameId} value={label} />
            <TextInput
                id={nameId}
                value={data[nameId]}
                handleChange={(e) => update(nameId, e.target.value)}
                type="text"
                className="block w-full mt-1"
            />
            <InputError message={errors[nameId]} className="mt-2" />

            <div className="mt-3">
                <InputLabel for={colorId} value={`Warna ${label.replace("Nama Grading ", "")}`} />
                <ColorInput id={colorId} value={data[colorId]} error={errors[colorId]} />
            </div>
        </div>
    );

    return (
        <>
            <div className="px-4 py-5 bg-white dark:bg-[#0f172a] sm:p-6">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 sm:col-span-4">
                        <InputLabel for="tahun" value="Tahun" />
                        <TextInput
                            id="tahun"
                            value={data.tahun}
                            handleChange={(e) => update("tahun", e.target.value)}
                            type="number"
                            min="2000"
                            max="2100"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.tahun} className="mt-2" />
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                        <InputLabel for="kode" value="Kode" />
                        <TextInput
                            id="kode"
                            value={data.kode}
                            handleChange={(e) => update("kode", e.target.value)}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.kode} className="mt-2" />
                    </div>

                    <GradingInput nameId="name" colorId="warna_klinis" label="Nama Grading Klinis" />
                    <GradingInput nameId="name_nonklinis" colorId="warna_nonklinis" label="Nama Grading Non Klinis" />
                    <GradingInput nameId="name_nonklinis_pergub" colorId="warna_nonklinis_pergub" label="Nama Grading Non Klinis Pergub" />
                    <GradingInput nameId="name_ikp" colorId="warna_ikp" label="Nama Grading IKP" />
                    <GradingInput nameId="name_bpkp" colorId="warna_bpkp" label="Nama Grading BPKP" />
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
