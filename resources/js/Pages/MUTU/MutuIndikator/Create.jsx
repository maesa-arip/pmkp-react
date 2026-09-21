import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, ShouldMap }) {
    // Logika asli Anda tanpa location_id
    const { data, setData, post, reset, errors, processing } = useForm({
        periode_kinerja_id: "", indikator_fitur3_id: "", indikator_fitur4_id: "", IndikatorBaru: 0, indikator: "", mutu_kategori_id: "", num_name: "", denum_name: "", operator: "", standar: "", penyebut: "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (processing) return;
        post(route("MutuIndikator.store"), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenAddDialog(false);
            },
        });
    };

    return (
        <form onSubmit={onSubmit} className="flex w-full min-w-0 flex-col">
            <Form 
                errors={errors} 
                data={data} 
                setData={setData} 
                ShouldMap={ShouldMap} 
                submit="Simpan"
                processing={processing}
                closeButton={closeButton} 
            />
        </form>
    );
}