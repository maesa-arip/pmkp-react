import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        pernyataan_risiko: model.pernyataan_risiko,
        osd1_dampak: model.osd1_dampak,
        osd1_probabilitas: model.osd1_probabilitas,
        concatdp1: model.concatdp1,
        osd1_inherent: model.osd1_inherent,
        dampak_responden1: model.fgdinherent?.dampak_responden1 ?? "",
        dampak_responden2: model.fgdinherent?.dampak_responden2 ?? "",
        dampak_responden3: model.fgdinherent?.dampak_responden3 ?? "",
        dampak_responden4: model.fgdinherent?.dampak_responden4 ?? "",
        dampak_responden5: model.fgdinherent?.dampak_responden5 ?? "",
        dampak_responden6: model.fgdinherent?.dampak_responden6 ?? "",
        dampak_responden7: model.fgdinherent?.dampak_responden7 ?? "",
        dampak_responden8: model.fgdinherent?.dampak_responden8 ?? "",

        probabilitas_responden1:
            model.fgdinherent?.probabilitas_responden1 ?? "",
        probabilitas_responden2:
            model.fgdinherent?.probabilitas_responden2 ?? "",
        probabilitas_responden3:
            model.fgdinherent?.probabilitas_responden3 ?? "",
        probabilitas_responden4:
            model.fgdinherent?.probabilitas_responden4 ?? "",
        probabilitas_responden5:
            model.fgdinherent?.probabilitas_responden5 ?? "",
        probabilitas_responden6:
            model.fgdinherent?.probabilitas_responden6 ?? "",
        probabilitas_responden7:
            model.fgdinherent?.probabilitas_responden7 ?? "",
        probabilitas_responden8:
            model.fgdinherent?.probabilitas_responden8 ?? "",
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdinherent", model.id), {
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
            osd1_dampak: model.osd1_dampak,
            osd1_probabilitas: model.osd1_probabilitas,
            concatdp1: model.concatdp1,
            osd1_inherent: model.osd1_inherent,
            pernyataan_risiko: model.pernyataan_risiko,
            dampak_responden1: model.fgdinherent?.dampak_responden1 ?? "",
            dampak_responden2: model.fgdinherent?.dampak_responden2 ?? "",
            dampak_responden3: model.fgdinherent?.dampak_responden3 ?? "",
            dampak_responden4: model.fgdinherent?.dampak_responden4 ?? "",
            dampak_responden5: model.fgdinherent?.dampak_responden5 ?? "",
            dampak_responden6: model.fgdinherent?.dampak_responden6 ?? "",
            dampak_responden7: model.fgdinherent?.dampak_responden7 ?? "",
            dampak_responden8: model.fgdinherent?.dampak_responden8 ?? "",

            probabilitas_responden1:
                model.fgdinherent?.probabilitas_responden1 ?? "",
            probabilitas_responden2:
                model.fgdinherent?.probabilitas_responden2 ?? "",
            probabilitas_responden3:
                model.fgdinherent?.probabilitas_responden3 ?? "",
            probabilitas_responden4:
                model.fgdinherent?.probabilitas_responden4 ?? "",
            probabilitas_responden5:
                model.fgdinherent?.probabilitas_responden5 ?? "",
            probabilitas_responden6:
                model.fgdinherent?.probabilitas_responden6 ?? "",
            probabilitas_responden7:
                model.fgdinherent?.probabilitas_responden7 ?? "",
            probabilitas_responden8:
                model.fgdinherent?.probabilitas_responden8 ?? "",
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
