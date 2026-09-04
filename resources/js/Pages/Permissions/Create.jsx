import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog }) {
    const { data, setData, post, reset, errors } = useForm({
        name: "", // Hanya butuh name untuk Permission
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("permissions.store"), {
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
                setData={setData} 
                submit="Simpan Kunci Akses" 
                closeButton={closeButton} 
            />
        </form>
    );
}