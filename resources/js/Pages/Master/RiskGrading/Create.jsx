import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

const emptyRiskGrading = {
    tahun: new Date().getFullYear(),
    dampak: "",
    probabilitas: "",
    kode: "",
    warna: "",
    name: "",
    warna_klinis: "",
    name_nonklinis: "",
    warna_nonklinis: "",
    name_klinis_pergub: "",
    warna_klinis_pergub: "",
    name_nonklinis_pergub: "",
    warna_nonklinis_pergub: "",
    name_klinis_bpkp: "",
    warna_klinis_bpkp: "",
    name_nonklinis_bpkp: "",
    warna_nonklinis_bpkp: "",
    name_ikp: "",
    warna_ikp: "",
    name_bpkp: "",
    warna_bpkp: "",
};

export default function Create({
    setIsOpenAddDialog,
    initialData = {},
    latestRiskGradings = {},
    latestRiskGradingYear = null,
}) {
    const { data, setData, post, reset, errors, transform } = useForm({
        ...emptyRiskGrading,
        ...initialData,
    });

    const closeButton = () => setIsOpenAddDialog(false);

    useEffect(() => {
        setData({
            ...emptyRiskGrading,
            ...initialData,
        });
    }, [initialData]);

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
