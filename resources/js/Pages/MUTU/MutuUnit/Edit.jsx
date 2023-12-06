import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react'
import Form from './Form';

export default function Edit({ setIsOpenEditDialog, model,ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        name: model.name,
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
            name: model.name,
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
