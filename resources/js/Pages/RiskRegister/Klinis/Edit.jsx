import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        tgl_register: model.tgl_register,
        tgl_selesai: model.tgl_selesai,
        pernyataan_risiko: model.pernyataan_risiko,
        sebab: model.sebab,
        efek: model.efek,
        grading: model.grading,
        pengendalian_risiko: model.pengendalian_risiko,
        proses_id: model.proses_id,
        currently_id: model.currently_id,
        risk_category_id: model.risk_category_id,
        identification_source_id: model.identification_source_id,
        location_id: model.location_id,
        risk_variety_id: model.risk_variety_id,
        risk_type_id: model.risk_type_id,
        osd1_dampak: model.osd1_dampak,
        osd1_probabilitas: model.osd1_probabilitas,
        osd1_controllability: model.osd1_controllability,
        osd2_dampak: model.osd2_dampak,
        osd2_probabilitas: model.osd2_probabilitas,
        osd2_controllability: model.osd2_controllability,
        pic_id: model.pic_id,
        indikator_fituro4_id: model.indikator_fituro4_id,
        pengawasan_id: model.pengawasan_id,
        perlu_penanganan_id: model.perlu_penanganan_id,
        opsi_pengendalian_id: model.opsi_pengendalian_id,
        pembiayaan_risiko_id: model.pembiayaan_risiko_id,
        efektif_id: model.efektif_id,
        jenis_pengendalian_id: model.jenis_pengendalian_id,
        waktu_pengendalian_id: model.waktu_pengendalian_id,
        belum_tertangani: model.belum_tertangani,
        usulan_perbaikan: model.usulan_perbaikan,
        denum: model.denum,
        num: model.num,
        waktudenumnum: model.waktudenumnum,
        output: model.output,
        waktu_implementasi_id: model.waktu_implementasi_id,
        realisasi_id: model.realisasi_id,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("riskRegisterKlinis.update", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            tgl_register: model.tgl_register,
            tgl_selesai: model.tgl_selesai,
            pernyataan_risiko: model.pernyataan_risiko,
            sebab: model.sebab,
            resiko: model.resiko,
            dampak: model.dampak,
            target_waktu: model.target_waktu,
            efek: model.efek,
            grading: model.grading,
            pengendalian_risiko: model.pengendalian_risiko,
            proses_id: model.proses_id,
            currently_id: model.currently_id,
            risk_category_id: model.risk_category_id,
            identification_source_id: model.identification_source_id,
            location_id: model.location_id,
            risk_variety_id: model.risk_variety_id,
            risk_type_id: model.risk_type_id,
            osd1_dampak: model.osd1_dampak,
            osd1_probabilitas: model.osd1_probabilitas,
            osd1_controllability: model.osd1_controllability,
            osd2_dampak: model.osd2_dampak,
            osd2_probabilitas: model.osd2_probabilitas,
            osd2_controllability: model.osd2_controllability,
            pic_id: model.pic_id,
            indikator_fituro4_id: model.indikator_fituro4_id,
            pengawasan_id: model.pengawasan_id,
            perlu_penanganan_id: model.perlu_penanganan_id,
            opsi_pengendalian_id: model.opsi_pengendalian_id,
            pembiayaan_risiko_id: model.pembiayaan_risiko_id,
            efektif_id: model.efektif_id,
            jenis_pengendalian_id: model.jenis_pengendalian_id,
            waktu_pengendalian_id: model.waktu_pengendalian_id,
            belum_tertangani: model.belum_tertangani,
            usulan_perbaikan: model.usulan_perbaikan,
            denum: model.denum,
            num: model.num,
            waktudenumnum: model.waktudenumnum,
            output: model.output,
            waktu_implementasi_id: model.waktu_implementasi_id,
            realisasi_id: model.realisasi_id,
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
                submit={"Update"}
                closeButton={closeButton}
            />
        </form>
    );
}
