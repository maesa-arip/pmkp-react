import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    const { data, setData, put, reset, errors } = useForm({
        penyebab: model.ikp_hasil?.penyebab,
        akarmasalah: model.ikp_hasil?.akarmasalah,
        rekomendasi: model.ikp_hasil?.rekomendasi,
        pj1: model.ikp_hasil?.pj1,
        tanggal_rekomendasi: model.ikp_hasil?.tanggal_rekomendasi,
        tindakan: model.ikp_hasil?.tindakan,
        pj2: model.ikp_hasil?.pj2,
        tanggal_tindakan: model.ikp_hasil?.tanggal_tindakan,
        nama: model.ikp_hasil?.nama,
        verifikasi: model.ikp_hasil?.verifikasi,
        tanggal_mulai_investigasi: model.ikp_hasil?.tanggal_mulai_investigasi,
        tanggal_selesaii_investigasi: model.ikp_hasil?.tanggal_selesaii_investigasi,
        investigasi_lengkap: model.ikp_hasil?.investigasi_lengkap,
        tanggal_investigasi: model.ikp_hasil?.tanggal_investigasi,
        investigasi_lanjut: model.ikp_hasil?.investigasi_lanjut,
        ikp_dampak2_id: model.ikp_hasil?.ikp_dampak2_id,
        ikp_probabilitas2_id: model.ikp_hasil?.ikp_probabilitas2_id,
        tanggal_cek: model.ikp_hasil?.tanggal_cek,
        tindak_lanjut: model.ikp_hasil?.tindak_lanjut,
    });
    const closeButton = (e) => setIsOpenEditDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        put(route("ikppasien.hasilinvestigasi", model.id), {
            data,
            onSuccess: () => {
                reset(), setIsOpenEditDialog(false);
            },
        });
    };
    useEffect(() => {
        setData({
            ...data,
            penyebab: model.ikp_hasil?.penyebab,
            akarmasalah: model.ikp_hasil?.akarmasalah,
            rekomendasi: model.ikp_hasil?.rekomendasi,
            pj1: model.ikp_hasil?.pj1,
            tanggal_rekomendasi: model.ikp_hasil?.tanggal_rekomendasi,
            tindakan: model.ikp_hasil?.tindakan,
            pj2: model.ikp_hasil?.pj2,
            tanggal_tindakan: model.ikp_hasil?.tanggal_tindakan,
            nama: model.ikp_hasil?.nama,
            verifikasi: model.ikp_hasil?.verifikasi,
            tanggal_mulai_investigasi: model.ikp_hasil?.tanggal_mulai_investigasi,
            tanggal_selesaii_investigasi: model.ikp_hasil?.tanggal_selesaii_investigasi,
            investigasi_lengkap: model.ikp_hasil?.investigasi_lengkap,
            tanggal_investigasi: model.ikp_hasil?.tanggal_investigasi,
            investigasi_lanjut: model.ikp_hasil?.investigasi_lanjut,
            ikp_dampak2_id: model.ikp_hasil?.ikp_dampak2_id,
            ikp_probabilitas2_id: model.ikp_hasil?.ikp_probabilitas2_id,
            tanggal_cek: model.ikp_hasil?.tanggal_cek,
            tindak_lanjut: model.ikp_hasil?.tindak_lanjut,
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
