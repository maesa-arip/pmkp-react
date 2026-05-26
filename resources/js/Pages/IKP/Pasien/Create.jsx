import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, ShouldMap }) {
    const { data, setData, post, reset, errors } = useForm({
        // Inisialisasi struktur object kosong sesuai kebutuhan
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("IkpPasien.store"), {
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
                ShouldMap={ShouldMap} 
                setData={setData} 
                submit="Simpan Laporan IKP" 
                closeButton={closeButton} 
            />
        </form>
    );
}