import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Form from './Form';

export default function Edit({ setIsOpenEditDialog, model, permissions }) {
    // PENGAMANAN: Safe Model agar aplikasi tidak crash
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        name: safeModel.name || "",
        permissions: safeModel.permissions ? safeModel.permissions.map(p => p.id) : []
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("roles.update", safeModel.id), {
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
            permissions: model.permissions ? model.permissions.map(p => p.id) : []
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                permissions={permissions}
                setData={setData}
                submit={"Simpan Perubahan Role"}
                closeButton={closeButton}
            />
        </form>
    );
}