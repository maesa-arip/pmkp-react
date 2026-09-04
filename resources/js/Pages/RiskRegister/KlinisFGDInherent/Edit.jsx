import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah crash jika model tiba-tiba kosong saat modal transisi
    const safeModel = model || {}; 

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        tgl_register: safeModel.tgl_register || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        sebab: safeModel.sebab || "",
        dampak: safeModel.dampak || "",
        resiko: safeModel.resiko || "", 
        
        dampak_responden1: safeModel.dampak_responden1 ?? "",
        dampak_responden2: safeModel.dampak_responden2 ?? "",
        dampak_responden3: safeModel.dampak_responden3 ?? "",
        dampak_responden4: safeModel.dampak_responden4 ?? "",
        dampak_responden5: safeModel.dampak_responden5 ?? "",
        dampak_responden6: safeModel.dampak_responden6 ?? "",
        dampak_responden7: safeModel.dampak_responden7 ?? "",
        dampak_responden8: safeModel.dampak_responden8 ?? "",
        
        probabilitas_responden1: safeModel.probabilitas_responden1 ?? "",
        probabilitas_responden2: safeModel.probabilitas_responden2 ?? "",
        probabilitas_responden3: safeModel.probabilitas_responden3 ?? "",
        probabilitas_responden4: safeModel.probabilitas_responden4 ?? "",
        probabilitas_responden5: safeModel.probabilitas_responden5 ?? "",
        probabilitas_responden6: safeModel.probabilitas_responden6 ?? "",
        probabilitas_responden7: safeModel.probabilitas_responden7 ?? "",
        probabilitas_responden8: safeModel.probabilitas_responden8 ?? "",
        
        osd1_dampak: safeModel.osd1_dampak ?? "",
        osd1_probabilitas: safeModel.osd1_probabilitas ?? "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;
        
        // Memastikan route sesuai dengan route backend Anda
        put(route("klinisfgdinherent.update", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        setData({
            ...data,
            id: model.id,
            tgl_register: model.tgl_register,
            pernyataan_risiko: model.pernyataan_risiko,
            sebab: model.sebab,
            dampak: model.dampak,
            resiko: model.resiko,
            
            dampak_responden1: model.dampak_responden1 ?? "",
            dampak_responden2: model.dampak_responden2 ?? "",
            dampak_responden3: model.dampak_responden3 ?? "",
            dampak_responden4: model.dampak_responden4 ?? "",
            dampak_responden5: model.dampak_responden5 ?? "",
            dampak_responden6: model.dampak_responden6 ?? "",
            dampak_responden7: model.dampak_responden7 ?? "",
            dampak_responden8: model.dampak_responden8 ?? "",
            
            probabilitas_responden1: model.probabilitas_responden1 ?? "",
            probabilitas_responden2: model.probabilitas_responden2 ?? "",
            probabilitas_responden3: model.probabilitas_responden3 ?? "",
            probabilitas_responden4: model.probabilitas_responden4 ?? "",
            probabilitas_responden5: model.probabilitas_responden5 ?? "",
            probabilitas_responden6: model.probabilitas_responden6 ?? "",
            probabilitas_responden7: model.probabilitas_responden7 ?? "",
            probabilitas_responden8: model.probabilitas_responden8 ?? "",
            
            osd1_dampak: model.osd1_dampak ?? "",
            osd1_probabilitas: model.osd1_probabilitas ?? "",
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // FIX BUG: Class flex col, w-full, h-full murni (tanpa batasan max-h agar tidak terpotong)
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Skor FGD"}
                closeButton={closeButton}
            />
        </form>
    );
}