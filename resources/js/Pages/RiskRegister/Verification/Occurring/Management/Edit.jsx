import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        tgl_register: model.tgl_register,
        created_at: model.created_at,
        currently_id: model.currently_id,
        pernyataan_risiko: model.pernyataan_risiko,
        request_update_id: model.requestupdate?.id ?? '',
        tgl_perbaikan: model.requestupdate?.tgl_perbaikan ?? '',
        jam_perbaikan: model.requestupdate?.jam_perbaikan ?? '',
        upaya_pengendalian: model.requestupdate?.upaya_pengendalian ?? '',
        keterangan: model.requestupdateverificationmanagement?.keterangan ?? '',
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.storeverificationmanagementoccurring", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
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
            keterangan: model.requestupdateverificationmanagement?.keterangan ?? '',
        });
    }, [model]);
    return (
        <form onSubmit={onSubmit}>
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan"}
                closeButton={closeButton}
            />
        </form>
    );
}
