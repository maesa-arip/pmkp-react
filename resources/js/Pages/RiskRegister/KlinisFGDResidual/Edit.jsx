import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        id: model.id,
        osd2_dampak: model.osd2_dampak,
        osd2_probabilitas: model.osd2_probabilitas,
        concatdp2: model.concatdp2,
        osd2_inherent: model.osd2_inherent,
        pernyataan_risiko: model.pernyataan_risiko,
        dampak_responden1: model.fgdresidual?.dampak_responden1 ?? "",
        dampak_responden2: model.fgdresidual?.dampak_responden2 ?? "",
        dampak_responden3: model.fgdresidual?.dampak_responden3 ?? "",
        dampak_responden4: model.fgdresidual?.dampak_responden4 ?? "",
        dampak_responden5: model.fgdresidual?.dampak_responden5 ?? "",
        dampak_responden6: model.fgdresidual?.dampak_responden6 ?? "",
        dampak_responden7: model.fgdresidual?.dampak_responden7 ?? "",
        dampak_responden8: model.fgdresidual?.dampak_responden8 ?? "",

        probabilitas_responden1:
            model.fgdresidual?.probabilitas_responden1 ?? "",
        probabilitas_responden2:
            model.fgdresidual?.probabilitas_responden2 ?? "",
        probabilitas_responden3:
            model.fgdresidual?.probabilitas_responden3 ?? "",
        probabilitas_responden4:
            model.fgdresidual?.probabilitas_responden4 ?? "",
        probabilitas_responden5:
            model.fgdresidual?.probabilitas_responden5 ?? "",
        probabilitas_responden6:
            model.fgdresidual?.probabilitas_responden6 ?? "",
        probabilitas_responden7:
            model.fgdresidual?.probabilitas_responden7 ?? "",
        probabilitas_responden8:
            model.fgdresidual?.probabilitas_responden8 ?? "",
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskregister.fgdresidual", model.id), {
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
            osd2_dampak: model.osd2_dampak,
            osd2_probabilitas: model.osd2_probabilitas,
            concatdp2: model.concatdp2,
            osd2_inherent: model.osd2_inherent,
            pernyataan_risiko: model.pernyataan_risiko,
            dampak_responden1: model.fgdresidual?.dampak_responden1 ?? "",
            dampak_responden2: model.fgdresidual?.dampak_responden2 ?? "",
            dampak_responden3: model.fgdresidual?.dampak_responden3 ?? "",
            dampak_responden4: model.fgdresidual?.dampak_responden4 ?? "",
            dampak_responden5: model.fgdresidual?.dampak_responden5 ?? "",
            dampak_responden6: model.fgdresidual?.dampak_responden6 ?? "",
            dampak_responden7: model.fgdresidual?.dampak_responden7 ?? "",
            dampak_responden8: model.fgdresidual?.dampak_responden8 ?? "",

            probabilitas_responden1:
                model.fgdresidual?.probabilitas_responden1 ?? "",
            probabilitas_responden2:
                model.fgdresidual?.probabilitas_responden2 ?? "",
            probabilitas_responden3:
                model.fgdresidual?.probabilitas_responden3 ?? "",
            probabilitas_responden4:
                model.fgdresidual?.probabilitas_responden4 ?? "",
            probabilitas_responden5:
                model.fgdresidual?.probabilitas_responden5 ?? "",
            probabilitas_responden6:
                model.fgdresidual?.probabilitas_responden6 ?? "",
            probabilitas_responden7:
                model.fgdresidual?.probabilitas_responden7 ?? "",
            probabilitas_responden8:
                model.fgdresidual?.probabilitas_responden8 ?? "",
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
