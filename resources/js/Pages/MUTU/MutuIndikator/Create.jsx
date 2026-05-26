import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, ShouldMap }) {
    // Logika asli Anda tanpa location_id
    const { data, setData, post, reset, errors } = useForm({
        name: "", // Sesuai dengan bawaan asli kode Anda
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("MutuIndikator.store"), {
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
                ShouldMap={ShouldMap} 
                submit="Simpan" 
                closeButton={closeButton} 
            />
        </form>
    );
}