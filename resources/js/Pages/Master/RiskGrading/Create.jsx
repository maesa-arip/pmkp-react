import { useForm } from "@inertiajs/react";
import React from "react";
import Form from "./Form";

export default function Create({
    setIsOpenAddDialog,
    latestRiskGradings = {},
    latestRiskGradingYear = null,
}) {
    const { data, setData, post, reset, errors, transform } = useForm({
        tahun: new Date().getFullYear(),
        dampak: "",
        probabilitas: "",
        kode: "",
        warna: "",
        name: "",
        warna_klinis: "",
        name_nonklinis: "",
        warna_nonklinis: "",
        name_nonklinis_pergub: "",
        warna_nonklinis_pergub: "",
        name_ikp: "",
        warna_ikp: "",
        name_bpkp: "",
        warna_bpkp: "",
    });

    const closeButton = () => setIsOpenAddDialog(false);

    const onSubmit = (e) => {
        e.preventDefault();
        transform((data) => ({ ...data, kode: String(data.kode || "") }));
        post(route("riskGradings.store"), {
            onSuccess: () => {
                reset();
                setIsOpenAddDialog(false);
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <Form
                errors={errors}
                data={data}
                setData={setData}
                submit="Simpan"
                closeButton={closeButton}
                latestRiskGradings={latestRiskGradings}
                latestRiskGradingYear={latestRiskGradingYear}
            />
        </form>
    );
}
