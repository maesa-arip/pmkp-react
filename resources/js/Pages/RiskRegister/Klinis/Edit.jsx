import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah crash jika model tiba-tiba kosong
    const safeModel = model || {}; 

    const { data, setData, put, reset, errors } = useForm({
        tgl_register: safeModel.tgl_register || "",
        tgl_selesai: safeModel.tgl_selesai || "",
        pernyataan_risiko: safeModel.pernyataan_risiko || "",
        sebab: safeModel.sebab || "",
        efek: safeModel.efek || "",
        grading: safeModel.grading || "",
        pengendalian_risiko: safeModel.pengendalian_risiko || "",
        proses_id: safeModel.proses_id || "",
        currently_id: safeModel.currently_id || "",
        risk_category_id: safeModel.risk_category_id || "",
        identification_source_id: safeModel.identification_source_id || "",
        location_id: safeModel.location_id || "",
        risk_variety_id: safeModel.risk_variety_id || "",
        risk_type_id: safeModel.risk_type_id || "",
        osd1_dampak: safeModel.osd1_dampak || "",
        osd1_probabilitas: safeModel.osd1_probabilitas || "",
        osd1_controllability: safeModel.osd1_controllability || "",
        osd2_dampak: safeModel.osd2_dampak || "",
        osd2_probabilitas: safeModel.osd2_probabilitas || "",
        osd2_controllability: safeModel.osd2_controllability || "",
        pic_id: safeModel.pic_id || "",
        indikator_fitur4_id: safeModel.indikator_fitur4_id || "",
        pengawasan_id: safeModel.pengawasan_id || "",
        perlu_penanganan_id: safeModel.perlu_penanganan_id || "",
        opsi_pengendalian_id: safeModel.opsi_pengendalian_id || "",
        pembiayaan_risiko_id: safeModel.pembiayaan_risiko_id || "",
        efektif_id: safeModel.efektif_id || "",
        jenis_pengendalian_id: safeModel.jenis_pengendalian_id || "",
        waktu_pengendalian_id: safeModel.waktu_pengendalian_id || "",
        belum_tertangani: safeModel.belum_tertangani || "",
        usulan_perbaikan: safeModel.usulan_perbaikan || "",
        denum: safeModel.denum || "",
        num: safeModel.num || "",
        waktudenumnum: safeModel.waktudenumnum || "",
        output: safeModel.output || "",
        waktu_implementasi_id: safeModel.waktu_implementasi_id || "",
        realisasi_id: safeModel.realisasi_id || "",
        pengendalian_harus_ada: safeModel.pengendalian_harus_ada || "",
        penanganan_risiko: safeModel.penanganan_risiko || "",
        rencana_pengendalian: safeModel.rencana_pengendalian || "",
        jenis_sebab_id: safeModel.jenis_sebab_id || "",
        pihak_terkena: safeModel.pihak_terkena || "",
        kronologi: safeModel.kronologi || "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;
        
        put(route("riskRegisterKlinis.update", safeModel.id), {
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
            indikator_fitur4_id: model.indikator_fitur4_id,
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
            pengendalian_harus_ada: model.pengendalian_harus_ada,
            penanganan_risiko: model.penanganan_risiko,
            rencana_pengendalian: model.rencana_pengendalian,
            jenis_sebab_id: model.jenis_sebab_id,
            pihak_terkena: model.pihak_terkena,
            kronologi: model.kronologi,
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        // FIX BUG: Menggunakan w-full h-full fleksibel agar tidak memaksa tergencet max-h
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
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