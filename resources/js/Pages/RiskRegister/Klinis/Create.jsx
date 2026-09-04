import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, ShouldMap }) {
    // Inisialisasi properti yang dibutuhkan
    const { data, setData, post, reset, errors } = useForm({
        tgl_register: "",
        tgl_selesai: "",
        pernyataan_risiko: "",
        sebab: "",
        efek: "",
        grading: "",
        pengendalian_risiko: "",
        proses_id: "",
        currently_id: "",
        risk_category_id: "",
        identification_source_id: "",
        location_id: "",
        risk_variety_id: "",
        risk_type_id: "",
        osd1_dampak: "",
        osd1_probabilitas: "",
        osd1_controllability: "",
        osd2_dampak: "",
        osd2_probabilitas: "",
        osd2_controllability: "",
        pic_id: "",
        indikator_fitur4_id: "",
        pengawasan_id: "",
        perlu_penanganan_id: "",
        opsi_pengendalian_id: "",
        pembiayaan_risiko_id: "",
        efektif_id: "",
        jenis_pengendalian_id: "",
        waktu_pengendalian_id: "",
        belum_tertangani: "",
        usulan_perbaikan: "",
        denum: "",
        num: "",
        waktudenumnum: "",
        output: "",
        waktu_implementasi_id: "",
        realisasi_id: "",
        pengendalian_harus_ada: "",
        penanganan_risiko: "",
        rencana_pengendalian: "",
        jenis_sebab_id: "",
        pihak_terkena: "",
        kronologi: "",
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("riskRegisterKlinis.store"), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenAddDialog(false);
            },
        });
    };
    
    return (
        // FIX BUG: Menggunakan w-full h-full fleksibel agar tidak memaksa tergencet max-h
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form 
                errors={errors} 
                data={data} 
                ShouldMap={ShouldMap} 
                setData={setData} 
                submit="Simpan Data Baru" 
                closeButton={closeButton} 
            />
        </form>
    );
}