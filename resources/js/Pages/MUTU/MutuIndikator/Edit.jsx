import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah error crash
    const safeModel = model || {};

    // Logika asli Anda tanpa location_id
    const { data, setData, put, reset, errors } = useForm({
        indikator_fitur4_id: safeModel.indikator_fitur4_id || "",
        mutu_kategori_id: safeModel.mutu_kategori_id || "",
        num_name: safeModel.num_name || "",
        denum_name: safeModel.denum_name || "",
        operator: safeModel.operator || "",
        standar: safeModel.standar || "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!safeModel.id) return;

        put(route("MutuIndikator.update", safeModel.id), {
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
            indikator_fitur4_id: model.indikator_fitur4_id,
            mutu_kategori_id: model.mutu_kategori_id,
            num_name: model.num_name,
            denum_name: model.denum_name,
            operator: model.operator,
            standar: model.standar,
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
                submit={"Update"}
                closeButton={closeButton}
            />
        </form>
    );
}