import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        mutu_indikator_id: safeModel.mutu_indikator_id || "",
        tanggal_mutu: safeModel.tanggal_mutu || "",
        num: safeModel.num || "",
        denum: safeModel.denum || "",
        capaian: safeModel.capaian || "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!safeModel.id) return;

        put(route("MutuUnit.update", safeModel.id), {
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
            mutu_indikator_id: model.mutu_indikator_id,
            tanggal_mutu: model.tanggal_mutu,
            num: model.num,
            denum: model.denum,
            capaian: model.capaian,
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                setData={setData}
                model={model}
                ShouldMap={ShouldMap}
                submit={"Update Capaian"}
                closeButton={closeButton}
            />
        </form>
    );
}