import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        tgl_register: model.tgl_register,
        pernyataan_risiko: model.pernyataan_risiko,
        why1: model.formulirrca?.why1 ?? '',
        why2: model.formulirrca?.why2 ?? '',
        why3: model.formulirrca?.why3 ?? '',
        why4: model.formulirrca?.why4 ?? '',
        why5: model.formulirrca?.why5 ?? '',
        akar_penyebab: model.formulirrca?.akar_penyebab ?? '',
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.formulirrca", model.id), {
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
            pernyataan_risiko: model.pernyataan_risiko,
            why1: model.formulirrca?.why1 ?? '',
            why2: model.formulirrca?.why2 ?? '',
            why3: model.formulirrca?.why3 ?? '',
            why4: model.formulirrca?.why4 ?? '',
            why5: model.formulirrca?.why5 ?? '',
            akar_penyebab: model.formulirrca?.akar_penyebab ?? '',
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
