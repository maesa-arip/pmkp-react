import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan data model
    const safeModel = model || {};
    const safeRCA = safeModel.formulirrca || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        tgl_register: safeModel.tgl_register || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        why1: safeRCA.why1 ?? '',
        why2: safeRCA.why2 ?? '',
        why3: safeRCA.why3 ?? '',
        why4: safeRCA.why4 ?? '',
        why5: safeRCA.why5 ?? '',
        akar_penyebab: safeRCA.akar_penyebab ?? '',
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.formulirrca", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const rca = model.formulirrca || {};
        setData({
            ...data,
            id: model.id,
            tgl_register: model.tgl_register,
            pernyataan_risiko: model.pernyataan_risiko,
            why1: rca.why1 ?? '',
            why2: rca.why2 ?? '',
            why3: rca.why3 ?? '',
            why4: rca.why4 ?? '',
            why5: rca.why5 ?? '',
            akar_penyebab: rca.akar_penyebab ?? '',
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // FIX BUG: Menggunakan w-full h-full murni agar layout tidak terpotong (clipped)
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Formulir RCA"}
                closeButton={closeButton}
            />
        </form>
    );
}