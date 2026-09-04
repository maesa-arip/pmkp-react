import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan data model
    const safeModel = model || {};
    const safeResidual = safeModel.fgdresidual || {};

    const { data, setData, put, reset, errors } = useForm({
        id: safeModel.id || "",
        osd2_dampak: safeModel.osd2_dampak || "",
        osd2_probabilitas: safeModel.osd2_probabilitas || "",
        concatdp2: safeModel.concatdp2 || "",
        osd2_inherent: safeModel.osd2_inherent || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        
        dampak_responden1: safeResidual.dampak_responden1 ?? "",
        dampak_responden2: safeResidual.dampak_responden2 ?? "",
        dampak_responden3: safeResidual.dampak_responden3 ?? "",
        dampak_responden4: safeResidual.dampak_responden4 ?? "",
        dampak_responden5: safeResidual.dampak_responden5 ?? "",
        dampak_responden6: safeResidual.dampak_responden6 ?? "",
        dampak_responden7: safeResidual.dampak_responden7 ?? "",
        dampak_responden8: safeResidual.dampak_responden8 ?? "",

        probabilitas_responden1: safeResidual.probabilitas_responden1 ?? "",
        probabilitas_responden2: safeResidual.probabilitas_responden2 ?? "",
        probabilitas_responden3: safeResidual.probabilitas_responden3 ?? "",
        probabilitas_responden4: safeResidual.probabilitas_responden4 ?? "",
        probabilitas_responden5: safeResidual.probabilitas_responden5 ?? "",
        probabilitas_responden6: safeResidual.probabilitas_responden6 ?? "",
        probabilitas_responden7: safeResidual.probabilitas_responden7 ?? "",
        probabilitas_responden8: safeResidual.probabilitas_responden8 ?? "",
    });

    const closeButton = (e) => {
        if (e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdresidual", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const residual = model.fgdresidual || {};
        setData({
            ...data,
            id: model.id,
            osd2_dampak: model.osd2_dampak,
            osd2_probabilitas: model.osd2_probabilitas,
            concatdp2: model.concatdp2,
            osd2_inherent: model.osd2_inherent,
            pernyataan_risiko: model.pernyataan_risiko,
            
            dampak_responden1: residual.dampak_responden1 ?? "",
            dampak_responden2: residual.dampak_responden2 ?? "",
            dampak_responden3: residual.dampak_responden3 ?? "",
            dampak_responden4: residual.dampak_responden4 ?? "",
            dampak_responden5: residual.dampak_responden5 ?? "",
            dampak_responden6: residual.dampak_responden6 ?? "",
            dampak_responden7: residual.dampak_responden7 ?? "",
            dampak_responden8: residual.dampak_responden8 ?? "",

            probabilitas_responden1: residual.probabilitas_responden1 ?? "",
            probabilitas_responden2: residual.probabilitas_responden2 ?? "",
            probabilitas_responden3: residual.probabilitas_responden3 ?? "",
            probabilitas_responden4: residual.probabilitas_responden4 ?? "",
            probabilitas_responden5: residual.probabilitas_responden5 ?? "",
            probabilitas_responden6: residual.probabilitas_responden6 ?? "",
            probabilitas_responden7: residual.probabilitas_responden7 ?? "",
            probabilitas_responden8: residual.probabilitas_responden8 ?? "",
        });
    }, [model]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full w-full max-h-[85vh]">
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan Skor Residual"}
                closeButton={closeButton}
            />
        </form>
    );
}