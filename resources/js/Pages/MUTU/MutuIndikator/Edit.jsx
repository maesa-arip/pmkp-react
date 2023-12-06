import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        indikator_fitur4_id: model.indikator_fitur4_id,
        mutu_kategori_id: model.mutu_kategori_id,
        location_id: model.location_id,
        num_name: model.num_name,
        denum_name: model.denum_name,
        operator: model.operator,
        standar: model.standar,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("MutuIndikator.update", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            indikator_fitur4_id: model.indikator_fitur4_id,
            mutu_kategori_id: model.mutu_kategori_id,
            location_id: model.location_id,
            num_name: model.num_name,
            denum_name: model.denum_name,
            operator: model.operator,
            standar: model.standar,
        });
    }, [model]);
    return (
        <form onSubmit={onSubmit}>
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
