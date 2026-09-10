import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah crash jika model tiba-tiba kosong saat modal transisi
    const safeModel = model || {}; 
    const safeInherent = safeModel.fgdinherent || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        tgl_register: safeModel.tgl_register || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        sebab: safeModel.sebab || "",
        dampak: safeModel.dampak || "",
        resiko: safeModel.resiko || "", 
        
        dampak_responden1: safeInherent.dampak_responden1 ?? "",
        dampak_responden2: safeInherent.dampak_responden2 ?? "",
        dampak_responden3: safeInherent.dampak_responden3 ?? "",
        dampak_responden4: safeInherent.dampak_responden4 ?? "",
        dampak_responden5: safeInherent.dampak_responden5 ?? "",
        dampak_responden6: safeInherent.dampak_responden6 ?? "",
        dampak_responden7: safeInherent.dampak_responden7 ?? "",
        dampak_responden8: safeInherent.dampak_responden8 ?? "",
        
        probabilitas_responden1: safeInherent.probabilitas_responden1 ?? "",
        probabilitas_responden2: safeInherent.probabilitas_responden2 ?? "",
        probabilitas_responden3: safeInherent.probabilitas_responden3 ?? "",
        probabilitas_responden4: safeInherent.probabilitas_responden4 ?? "",
        probabilitas_responden5: safeInherent.probabilitas_responden5 ?? "",
        probabilitas_responden6: safeInherent.probabilitas_responden6 ?? "",
        probabilitas_responden7: safeInherent.probabilitas_responden7 ?? "",
        probabilitas_responden8: safeInherent.probabilitas_responden8 ?? "",
        
        osd1_dampak: safeModel.osd1_dampak ?? "",
        osd1_probabilitas: safeModel.osd1_probabilitas ?? "",
        osd1_controllability: safeModel.osd1_controllability ?? "",
        perlu_penanganan_id: safeModel.perlu_penanganan_id || "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;
        
        // Memastikan route sesuai dengan route backend Anda
        put(route("riskregister.fgdinherent"), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const inherent = model.fgdinherent || {};
        setData({
            ...data,
            id: model.id,
            tgl_register: model.tgl_register,
            pernyataan_risiko: model.pernyataan_risiko,
            sebab: model.sebab,
            dampak: model.dampak,
            resiko: model.resiko,
            
            dampak_responden1: inherent.dampak_responden1 ?? "",
            dampak_responden2: inherent.dampak_responden2 ?? "",
            dampak_responden3: inherent.dampak_responden3 ?? "",
            dampak_responden4: inherent.dampak_responden4 ?? "",
            dampak_responden5: inherent.dampak_responden5 ?? "",
            dampak_responden6: inherent.dampak_responden6 ?? "",
            dampak_responden7: inherent.dampak_responden7 ?? "",
            dampak_responden8: inherent.dampak_responden8 ?? "",
            
            probabilitas_responden1: inherent.probabilitas_responden1 ?? "",
            probabilitas_responden2: inherent.probabilitas_responden2 ?? "",
            probabilitas_responden3: inherent.probabilitas_responden3 ?? "",
            probabilitas_responden4: inherent.probabilitas_responden4 ?? "",
            probabilitas_responden5: inherent.probabilitas_responden5 ?? "",
            probabilitas_responden6: inherent.probabilitas_responden6 ?? "",
            probabilitas_responden7: inherent.probabilitas_responden7 ?? "",
            probabilitas_responden8: inherent.probabilitas_responden8 ?? "",
            
            osd1_dampak: model.osd1_dampak ?? "",
            osd1_probabilitas: model.osd1_probabilitas ?? "",
            osd1_controllability: model.osd1_controllability ?? "",
            perlu_penanganan_id: model.perlu_penanganan_id || "",
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
