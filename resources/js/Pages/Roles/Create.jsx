import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, permissions }) {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
        permissions: []
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("roles.store"), {
            data,
            onSuccess: () => {
                reset(); 
                setIsOpenAddDialog(false);
            },
        });
    };
    
    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form 
                errors={errors} 
                data={data} 
                permissions={permissions} 
                setData={setData} 
                submit="Buat Role Baru" 
                closeButton={closeButton} 
            />
        </form>
    );
}