import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react'
import Form from './Form';

export default function Edit({ setIsOpenEditDialog, model,ShouldMap }) {
    // console.log(model)
    const { data, setData, put, reset, errors } = useForm({
        mutu_indikator_id: model.mutu_indikator_id,
        tanggal_mutu: model.tanggal_mutu,
        num: model.num,
        denum: model.denum,
        capaian: model.capaian,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("MutuUnit.update", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            mutu_indikator_id: model.mutu_indikator_id,
        tanggal_mutu: model.tanggal_mutu,
        num: model.num,
        denum: model.denum,
        capaian: model.capaian,
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
  )
}
