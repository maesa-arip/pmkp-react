import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN (Safe Model): Menghindari TypeError undefined saat panel ditutup
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        tgl_register: safeModel.tgl_register || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        tgl_perbaikan: safeModel.requestupdate?.tgl_perbaikan ?? "",
        jam_perbaikan: safeModel.requestupdate?.jam_perbaikan ?? "",
        upaya_pengendalian: safeModel.requestupdate?.upaya_pengendalian ?? "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("riskregister.requestupdatestatus", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        setData({
            ...data,
            id: model.id,
            tgl_register: model.tgl_register,
            pernyataan_risiko: model.pernyataan_risiko,
            tgl_perbaikan: model.requestupdate?.tgl_perbaikan ?? "",
            jam_perbaikan: model.requestupdate?.jam_perbaikan ?? "",
            upaya_pengendalian: model.requestupdate?.upaya_pengendalian ?? "",
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // FIX BUG: Menggunakan w-full h-full agar form tidak terpotong (clipped) di dalam modal
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Perubahan"}
                closeButton={closeButton}
            />
        </form>
    );
}