import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan data model untuk mencegah crash
    const safeModel = model || {};
    const safeTreated = safeModel.fgdtreated || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        
        dampak_responden1: safeTreated.dampak_responden1 ?? '',
        dampak_responden2: safeTreated.dampak_responden2 ?? '',
        dampak_responden3: safeTreated.dampak_responden3 ?? '',
        dampak_responden4: safeTreated.dampak_responden4 ?? '',
        dampak_responden5: safeTreated.dampak_responden5 ?? '',
        dampak_responden6: safeTreated.dampak_responden6 ?? '',
        dampak_responden7: safeTreated.dampak_responden7 ?? '',
        dampak_responden8: safeTreated.dampak_responden8 ?? '',

        probabilitas_responden1: safeTreated.probabilitas_responden1 ?? '',
        probabilitas_responden2: safeTreated.probabilitas_responden2 ?? '',
        probabilitas_responden3: safeTreated.probabilitas_responden3 ?? '',
        probabilitas_responden4: safeTreated.probabilitas_responden4 ?? '',
        probabilitas_responden5: safeTreated.probabilitas_responden5 ?? '',
        probabilitas_responden6: safeTreated.probabilitas_responden6 ?? '',
        probabilitas_responden7: safeTreated.probabilitas_responden7 ?? '',
        probabilitas_responden8: safeTreated.probabilitas_responden8 ?? '',
        
        osd3_dampak: safeTreated.osd3_dampak ?? '',
        osd3_probabilitas: safeTreated.osd3_probabilitas ?? '',
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdtreated", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const treated = model.fgdtreated || {};
        setData({
            ...data,
            id: model.id,
            pernyataan_risiko: model.pernyataan_risiko,
            
            dampak_responden1: treated.dampak_responden1 ?? '',
            dampak_responden2: treated.dampak_responden2 ?? '',
            dampak_responden3: treated.dampak_responden3 ?? '',
            dampak_responden4: treated.dampak_responden4 ?? '',
            dampak_responden5: treated.dampak_responden5 ?? '',
            dampak_responden6: treated.dampak_responden6 ?? '',
            dampak_responden7: treated.dampak_responden7 ?? '',
            dampak_responden8: treated.dampak_responden8 ?? '',

            probabilitas_responden1: treated.probabilitas_responden1 ?? '',
            probabilitas_responden2: treated.probabilitas_responden2 ?? '',
            probabilitas_responden3: treated.probabilitas_responden3 ?? '',
            probabilitas_responden4: treated.probabilitas_responden4 ?? '',
            probabilitas_responden5: treated.probabilitas_responden5 ?? '',
            probabilitas_responden6: treated.probabilitas_responden6 ?? '',
            probabilitas_responden7: treated.probabilitas_responden7 ?? '',
            probabilitas_responden8: treated.probabilitas_responden8 ?? '',
            
            osd3_dampak: treated.osd3_dampak ?? '',
            osd3_probabilitas: treated.osd3_probabilitas ?? '',
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
                submit={"Simpan Skor Treated"}
                closeButton={closeButton}
            />
        </form>
    );
}