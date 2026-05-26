import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model }) {
    const { data, setData, put, reset, errors, transform } = useForm({
        tahun: model.tahun || "",
        kode: model.kode ? String(model.kode) : "",
        warna: model.warna || "",
        name: model.name || "",
        warna_klinis: model.warna_klinis || "",
        name_nonklinis: model.name_nonklinis || "",
        warna_nonklinis: model.warna_nonklinis || "",
        name_nonklinis_pergub: model.name_nonklinis_pergub || "",
        warna_nonklinis_pergub: model.warna_nonklinis_pergub || "",
        name_ikp: model.name_ikp || "",
        warna_ikp: model.warna_ikp || "",
        name_bpkp: model.name_bpkp || "",
        warna_bpkp: model.warna_bpkp || "",
    });

    const closeButton = () => setIsOpenEditDialog(false);

    const onSubmit = (e) => {
        e.preventDefault();
        transform((data) => ({ ...data, kode: String(data.kode || "") }));
        put(route("riskGradings.update", model.id), {
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        setData({
            tahun: model.tahun || "",
            kode: model.kode ? String(model.kode) : "",
            warna: model.warna || "",
            name: model.name || "",
            warna_klinis: model.warna_klinis || "",
            name_nonklinis: model.name_nonklinis || "",
            warna_nonklinis: model.warna_nonklinis || "",
            name_nonklinis_pergub: model.name_nonklinis_pergub || "",
            warna_nonklinis_pergub: model.warna_nonklinis_pergub || "",
            name_ikp: model.name_ikp || "",
            warna_ikp: model.warna_ikp || "",
            name_bpkp: model.name_bpkp || "",
            warna_bpkp: model.warna_bpkp || "",
        });
    }, [model]);

    return (
        <form onSubmit={onSubmit}>
            <Form
                errors={errors}
                data={data}
                setData={setData}
                submit="Update"
                closeButton={closeButton}
            />
        </form>
    );
}
