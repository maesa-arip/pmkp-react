import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah error jika model tiba-tiba kosong
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        problem: safeModel.mutu_pdsa?.problem ?? "",
        step: safeModel.mutu_pdsa?.step ?? "",
        plan_rencana: safeModel.mutu_pdsa?.plan_rencana ?? "",
        plan_harapan: safeModel.mutu_pdsa?.plan_harapan ?? "",
        do: safeModel.mutu_pdsa?.do ?? "",
        study: safeModel.mutu_pdsa?.study ?? "",
        action: safeModel.mutu_pdsa?.action ?? "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!safeModel.id) return;

        put(route("MutuUnit.formulirpdsa", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if(!model) return;
        setData({
            ...data,
            id: model.id,
            problem: model.mutu_pdsa?.problem ?? "",
            step: model.mutu_pdsa?.step ?? "",
            plan_rencana: model.mutu_pdsa?.plan_rencana ?? "",
            plan_harapan: model.mutu_pdsa?.plan_harapan ?? "",
            do: model.mutu_pdsa?.do ?? "",
            study: model.mutu_pdsa?.study ?? "",
            action: model.mutu_pdsa?.action ?? "",
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // FIX BUG: Menggunakan w-full h-full murni agar form tidak terpotong dalam modal
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Formulir PDSA"}
                closeButton={closeButton}
            />
        </form>
    );
}