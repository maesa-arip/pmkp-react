import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // Pengamanan model agar tidak error
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        namapasien: safeModel.namapasien || "",
        nrm: safeModel.nrm || "",
        umur_tahun: safeModel.umur_tahun || "",
        umur_bulan: safeModel.umur_bulan || "",
        umur_hari: safeModel.umur_hari || "",
        ikp_penanggung_id: safeModel.ikp_penanggung_id || "",
        jeniskelamin: safeModel.jeniskelamin || "",
        tanggal_pelayanan: safeModel.tanggal_pelayanan || "",
        tanggal_insiden: safeModel.tanggal_insiden || "",
        insiden: safeModel.insiden || "",
        kronologi: safeModel.kronologi || "",
        ikp_jenis_insiden_id: safeModel.ikp_jenis_insiden_id || "",
        ikp_tipe_insiden_id: safeModel.ikp_tipe_insiden_id || "",
        ikp_spesialisasi_id: safeModel.ikp_spesialisasi_id || "",
        ikp_dampak_id: safeModel.ikp_dampak_id || "",
        ikp_probabilitas_id: safeModel.ikp_probabilitas_id || "",
        concatdp: safeModel.concatdp || "",
        ikp_pelapor_id: safeModel.ikp_pelapor_id || "",
        ikp_gruplayanan_id: safeModel.ikp_gruplayanan_id || "",
        ikp_lokasi_id: safeModel.ikp_lokasi_id || "",
        lokasi_name: safeModel.lokasi_name || "",
        pic_id: safeModel.pic_id || "",
        tindak_lanjut_hasil: safeModel.tindak_lanjut_hasil || "",
        ikp_penindak_id: safeModel.ikp_penindak_id || "",
        terjadi_tempatlain: safeModel.terjadi_tempatlain || "",
        langkah_tempatlain: safeModel.langkah_tempatlain || "",
        risiko_teridentifikasi: safeModel.risiko_teridentifikasi || false,
        risk_register_id: safeModel.risk_register_id || "",
        user_id: safeModel.user_id || "",
        kronologis: safeModel.kronologis || [],
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!safeModel.id) return;

        put(route("IkpPasien.update", safeModel.id), {
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
            namapasien: model.namapasien || "",
            nrm: model.nrm || "",
            umur_tahun: model.umur_tahun || "",
            umur_bulan: model.umur_bulan || "",
            umur_hari: model.umur_hari || "",
            ikp_penanggung_id: model.ikp_penanggung_id || "",
            jeniskelamin: model.jeniskelamin || "",
            tanggal_pelayanan: model.tanggal_pelayanan || "",
            tanggal_insiden: model.tanggal_insiden || "",
            insiden: model.insiden || "",
            kronologi: model.kronologi || "",
            ikp_jenis_insiden_id: model.ikp_jenis_insiden_id || "",
            ikp_tipe_insiden_id: model.ikp_tipe_insiden_id || "",
            ikp_spesialisasi_id: model.ikp_spesialisasi_id || "",
            ikp_dampak_id: model.ikp_dampak_id || "",
            ikp_probabilitas_id: model.ikp_probabilitas_id || "",
            concatdp: model.concatdp || "",
            ikp_pelapor_id: model.ikp_pelapor_id || "",
            ikp_gruplayanan_id: model.ikp_gruplayanan_id || "",
            ikp_lokasi_id: model.ikp_lokasi_id || "",
            lokasi_name: model.lokasi_name || "",
            pic_id: model.pic_id || "",
            tindak_lanjut_hasil: model.tindak_lanjut_hasil || "",
            ikp_penindak_id: model.ikp_penindak_id || "",
            terjadi_tempatlain: model.terjadi_tempatlain || "",
            langkah_tempatlain: model.langkah_tempatlain || "",
            risiko_teridentifikasi: model.risiko_teridentifikasi || false,
            risk_register_id: model.risk_register_id || "",
            user_id: model.user_id || "",
            kronologis: model.kronologis || [],
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                setData={setData}
                model={model}
                ShouldMap={ShouldMap}
                submit={"Update"}
                closeButton={closeButton}
            />
        </form>
    );
}
