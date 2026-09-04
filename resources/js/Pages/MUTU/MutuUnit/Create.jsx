import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, ShouldMap }) {
    const { data, setData, post, reset, errors } = useForm({
        mutu_indikator_id: "",
        tanggal_mutu: "",
        num: "",
        denum: "",
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("MutuUnit.store"), {
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
                submit="Simpan Capaian" 
                closeButton={closeButton} 
            />
        </form>
    );
}