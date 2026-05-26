import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Form from './Form';

export default function Edit({ setIsOpenEditDialog, model }) {
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        name: safeModel.name || "",
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("permissions.update", safeModel.id), {
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
            name: model.name,
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                setData={setData}
                submit={"Simpan Perubahan"}
                closeButton={closeButton}
            />
        </form>
    );
}