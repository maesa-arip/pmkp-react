import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, roles }) {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
        email: "",
        password: "",
        roles: []
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
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
                roles={roles} 
                setData={setData} 
                submit="Buat Pengguna Baru" 
                closeButton={closeButton}
                isCreate={true} // Wajibkan password di UI form
            />
        </form>
    );
}