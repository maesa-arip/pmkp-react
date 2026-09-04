import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan data model
    const safeModel = model || {};
    const safeActual = safeModel.fgdactual || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        
        dampak_responden1: safeActual.dampak_responden1 ?? '',
        dampak_responden2: safeActual.dampak_responden2 ?? '',
        dampak_responden3: safeActual.dampak_responden3 ?? '',
        dampak_responden4: safeActual.dampak_responden4 ?? '',
        dampak_responden5: safeActual.dampak_responden5 ?? '',
        dampak_responden6: safeActual.dampak_responden6 ?? '',
        dampak_responden7: safeActual.dampak_responden7 ?? '',
        dampak_responden8: safeActual.dampak_responden8 ?? '',

        probabilitas_responden1: safeActual.probabilitas_responden1 ?? '',
        probabilitas_responden2: safeActual.probabilitas_responden2 ?? '',
        probabilitas_responden3: safeActual.probabilitas_responden3 ?? '',
        probabilitas_responden4: safeActual.probabilitas_responden4 ?? '',
        probabilitas_responden5: safeActual.probabilitas_responden5 ?? '',
        probabilitas_responden6: safeActual.probabilitas_responden6 ?? '',
        probabilitas_responden7: safeActual.probabilitas_responden7 ?? '',
        probabilitas_responden8: safeActual.probabilitas_responden8 ?? '',
        
        osd4_dampak: safeActual.osd4_dampak ?? '',
        osd4_probabilitas: safeActual.osd4_probabilitas ?? '',
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdactual", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const actual = model.fgdactual || {};
        setData({
            ...data,
            id: model.id,
            pernyataan_risiko: model.pernyataan_risiko,
            
            dampak_responden1: actual.dampak_responden1 ?? '',
            dampak_responden2: actual.dampak_responden2 ?? '',
            dampak_responden3: actual.dampak_responden3 ?? '',
            dampak_responden4: actual.dampak_responden4 ?? '',
            dampak_responden5: actual.dampak_responden5 ?? '',
            dampak_responden6: actual.dampak_responden6 ?? '',
            dampak_responden7: actual.dampak_responden7 ?? '',
            dampak_responden8: actual.dampak_responden8 ?? '',

            probabilitas_responden1: actual.probabilitas_responden1 ?? '',
            probabilitas_responden2: actual.probabilitas_responden2 ?? '',
            probabilitas_responden3: actual.probabilitas_responden3 ?? '',
            probabilitas_responden4: actual.probabilitas_responden4 ?? '',
            probabilitas_responden5: actual.probabilitas_responden5 ?? '',
            probabilitas_responden6: actual.probabilitas_responden6 ?? '',
            probabilitas_responden7: actual.probabilitas_responden7 ?? '',
            probabilitas_responden8: actual.probabilitas_responden8 ?? '',
            
            osd4_dampak: actual.osd4_dampak ?? '',
            osd4_probabilitas: actual.osd4_probabilitas ?? '',
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full w-full max-h-[85vh]">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Skor Aktual"}
                closeButton={closeButton}
            />
        </form>
    );
}