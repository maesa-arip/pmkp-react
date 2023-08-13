import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        pernyataan_risiko: model.pernyataan_risiko,
        dampak_responden1: model.fgdtreated?.dampak_responden1 ?? '',
        dampak_responden2: model.fgdtreated?.dampak_responden2 ?? '',
        dampak_responden3: model.fgdtreated?.dampak_responden3 ?? '',
        dampak_responden4: model.fgdtreated?.dampak_responden4 ?? '',
        dampak_responden5: model.fgdtreated?.dampak_responden5 ?? '',
        dampak_responden6: model.fgdtreated?.dampak_responden6 ?? '',
        dampak_responden7: model.fgdtreated?.dampak_responden7 ?? '',
        dampak_responden8: model.fgdtreated?.dampak_responden8 ?? '',

        probabilitas_responden1: model.fgdtreated?.probabilitas_responden1 ?? '',
        probabilitas_responden2: model.fgdtreated?.probabilitas_responden2 ?? '',
        probabilitas_responden3: model.fgdtreated?.probabilitas_responden3 ?? '',
        probabilitas_responden4: model.fgdtreated?.probabilitas_responden4 ?? '',
        probabilitas_responden5: model.fgdtreated?.probabilitas_responden5 ?? '',
        probabilitas_responden6: model.fgdtreated?.probabilitas_responden6 ?? '',
        probabilitas_responden7: model.fgdtreated?.probabilitas_responden7 ?? '',
        probabilitas_responden8: model.fgdtreated?.probabilitas_responden8 ?? '',
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdtreated", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            id: model.id,
            pernyataan_risiko: model.pernyataan_risiko,
            dampak_responden1: model.fgdtreated?.dampak_responden1 ?? '',
            dampak_responden2: model.fgdtreated?.dampak_responden2 ?? '',
            dampak_responden3: model.fgdtreated?.dampak_responden3 ?? '',
            dampak_responden4: model.fgdtreated?.dampak_responden4 ?? '',
            dampak_responden5: model.fgdtreated?.dampak_responden5 ?? '',
            dampak_responden6: model.fgdtreated?.dampak_responden6 ?? '',
            dampak_responden7: model.fgdtreated?.dampak_responden7 ?? '',
            dampak_responden8: model.fgdtreated?.dampak_responden8 ?? '',

            probabilitas_responden1: model.fgdtreated?.probabilitas_responden1 ?? '',
            probabilitas_responden2: model.fgdtreated?.probabilitas_responden2 ?? '',
            probabilitas_responden3: model.fgdtreated?.probabilitas_responden3 ?? '',
            probabilitas_responden4: model.fgdtreated?.probabilitas_responden4 ?? '',
            probabilitas_responden5: model.fgdtreated?.probabilitas_responden5 ?? '',
            probabilitas_responden6: model.fgdtreated?.probabilitas_responden6 ?? '',
            probabilitas_responden7: model.fgdtreated?.probabilitas_responden7 ?? '',
            probabilitas_responden8: model.fgdtreated?.probabilitas_responden8 ?? '',
        });
    }, [model]);
    return (
        <form onSubmit={onSubmit}>
            <Form
                errors={errors}
                data={data}
                model={model}
                ShouldMap={ShouldMap}
                setData={setData}
                submit={"Simpan"}
                closeButton={closeButton}
            />
        </form>
    );
}
