import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        problem: model.mutu_pdsa?.problem ?? "",
        step: model.mutu_pdsa?.step ?? "",
        plan_rencana: model.mutu_pdsa?.plan_rencana ?? "",
        plan_harapan: model.mutu_pdsa?.plan_harapan ?? "",
        do: model.mutu_pdsa?.do ?? "",
        study: model.mutu_pdsa?.study ?? "",
        action: model.mutu_pdsa?.action ?? "",
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("MutuUnit.formulirpdsa", model.id), {
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
            problem: model.mutu_pdsa?.problem ?? "",
            step: model.mutu_pdsa?.step ?? "",
            plan_rencana: model.mutu_pdsa?.plan_rencana ?? "",
            plan_harapan: model.mutu_pdsa?.plan_harapan ?? "",
            do: model.mutu_pdsa?.do ?? "",
            study: model.mutu_pdsa?.study ?? "",
            action: model.mutu_pdsa?.action ?? "",
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
