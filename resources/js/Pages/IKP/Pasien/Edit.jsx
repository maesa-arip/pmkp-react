import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        namapasien: model.namapasien,
        nrm: model.nrm,
        umur_tahun: model.umur_tahun,
        umur_bulan: model.umur_bulan,
        umur_hari: model.umur_hari,
        ikp_penanggung_id: model.ikp_penanggung_id,
        jeniskelamin: model.jeniskelamin,
        tanggal_pelayanan: model.tanggal_pelayanan,
        tanggal_insiden: model.tanggal_insiden,
        insiden: model.insiden,
        kronologi: model.kronologi,
        ikp_jenis_insiden_id: model.ikp_jenis_insiden_id,
        ikp_tipe_insiden_id: model.ikp_tipe_insiden_id,
        ikp_spesialisasi_id: model.ikp_spesialisasi_id,
        ikp_dampak_id: model.ikp_dampak_id,
        ikp_probabilitas_id: model.ikp_probabilitas_id,
        concatdp: model.concatdp,
        ikp_pelapor_id: model.ikp_pelapor_id,
        ikp_gruplayanan_id: model.ikp_gruplayanan_id,
        ikp_lokasi_id: model.ikp_lokasi_id,
        lokasi_name: model.lokasi_name,
        pic_id: model.pic_id,
        tindak_lanjut_hasil: model.tindak_lanjut_hasil,
        ikp_penindak_id: model.ikp_penindak_id,
        terjadi_tempatlain: model.terjadi_tempatlain,
        langkah_tempatlain: model.langkah_tempatlain,
        user_id: model.user_id,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("IkpPasien.update", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            namapasien: model.namapasien,
            nrm: model.nrm,
            umur_tahun: model.umur_tahun,
            umur_bulan: model.umur_bulan,
            umur_hari: model.umur_hari,
            ikp_penanggung_id: model.ikp_penanggung_id,
            jeniskelamin: model.jeniskelamin,
            tanggal_pelayanan: model.tanggal_pelayanan,
            tanggal_insiden: model.tanggal_insiden,
            insiden: model.insiden,
            kronologi: model.kronologi,
            ikp_jenis_insiden_id: model.ikp_jenis_insiden_id,
            ikp_tipe_insiden_id: model.ikp_tipe_insiden_id,
            ikp_spesialisasi_id: model.ikp_spesialisasi_id,
            ikp_dampak_id: model.ikp_dampak_id,
            ikp_probabilitas_id: model.ikp_probabilitas_id,
            concatdp: model.concatdp,
            ikp_pelapor_id: model.ikp_pelapor_id,
            ikp_gruplayanan_id: model.ikp_gruplayanan_id,
            ikp_lokasi_id: model.ikp_lokasi_id,
            lokasi_name: model.lokasi_name,
            pic_id: model.pic_id,
            tindak_lanjut_hasil: model.tindak_lanjut_hasil,
            ikp_penindak_id: model.ikp_penindak_id,
            terjadi_tempatlain: model.terjadi_tempatlain,
            langkah_tempatlain: model.langkah_tempatlain,
            user_id: model.user_id,
        });
    }, [model]);
    return (
        <form onSubmit={onSubmit}>
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
