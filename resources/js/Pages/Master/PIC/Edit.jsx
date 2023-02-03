import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react'
import Form from './Form';

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        name: model.name,
        location_id : model.location_id,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("pics.update", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            name: model.name,
            location_id : model.location_id,
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
                submit={"Update"}
                closeButton = {closeButton}
            />
        </form>
  )
}
