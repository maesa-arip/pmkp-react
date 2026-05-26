import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan data model
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        tgl_register: safeModel.tgl_register || "",
        created_at: safeModel.created_at || "",
        currently_id: safeModel.currently_id || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        request_update_id: safeModel.requestupdate?.id ?? '',
        tgl_perbaikan: safeModel.requestupdate?.tgl_perbaikan ?? '',
        jam_perbaikan: safeModel.requestupdate?.jam_perbaikan ?? '',
        upaya_pengendalian: safeModel.requestupdate?.upaya_pengendalian ?? '',
        // Prioritaskan verificationoccurringadmin, fallback ke priority jika dibutuhkan di logic backend Anda
        keterangan: safeModel.verificationoccurringadmin?.keterangan ?? safeModel.verificationpriorityadmin?.keterangan ?? '',
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("riskregister.storeverificationadminoccurring", safeModel.id), {
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
            created_at: model.created_at,
            currently_id: model.currently_id,
            pernyataan_risiko: model.pernyataan_risiko,
            request_update_id: model.requestupdate?.id ?? '',
            tgl_perbaikan: model.requestupdate?.tgl_perbaikan ?? '',
            jam_perbaikan: model.requestupdate?.jam_perbaikan ?? '',
            upaya_pengendalian: model.requestupdate?.upaya_pengendalian ?? '',
            keterangan: model.verificationoccurringadmin?.keterangan ?? model.verificationpriorityadmin?.keterangan ?? '',
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // Memastikan form menggunakan layout penuh agar tidak terpotong
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Verifikasi"}
                closeButton={closeButton}
            />
        </form>
    );
}