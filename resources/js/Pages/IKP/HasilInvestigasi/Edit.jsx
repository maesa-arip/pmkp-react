import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, ShouldMap }) {
    // PENGAMANAN: Mencegah crash jika model tiba-tiba kosong
    const safeModel = model || {};
    const ikpHasil = safeModel.ikp_hasil || {};

    const { data, setData, put, reset, errors } = useForm({
        penyebab: ikpHasil.penyebab || "",
        akarmasalah: ikpHasil.akarmasalah || "",
        rekomendasi: ikpHasil.rekomendasi || "",
        pj1: ikpHasil.pj1 || "",
        tanggal_rekomendasi: ikpHasil.tanggal_rekomendasi || "",
        tindakan: ikpHasil.tindakan || "",
        pj2: ikpHasil.pj2 || "",
        tanggal_tindakan: ikpHasil.tanggal_tindakan || "",
        nama: ikpHasil.nama || "",
        verifikasi: ikpHasil.verifikasi ?? "",
        tanggal_mulai_investigasi: ikpHasil.tanggal_mulai_investigasi || "",
        tanggal_selesaii_investigasi: ikpHasil.tanggal_selesaii_investigasi || "",
        investigasi_lengkap: ikpHasil.investigasi_lengkap ?? "",
        tanggal_investigasi: ikpHasil.tanggal_investigasi || "",
        investigasi_lanjut: ikpHasil.investigasi_lanjut ?? "",
        ikp_dampak2_id: ikpHasil.ikp_dampak2_id || "",
        ikp_probabilitas2_id: ikpHasil.ikp_probabilitas2_id || "",
        tanggal_cek: ikpHasil.tanggal_cek || "",
        tindak_lanjut: ikpHasil.tindak_lanjut || "",
    });

    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("ikppasien.hasilinvestigasi", safeModel.id), {
            data,
            onSuccess: () => {
                reset();
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if (!model) return;
        const hasil = model.ikp_hasil || {};
        setData({
            ...data,
            penyebab: hasil.penyebab || "",
            akarmasalah: hasil.akarmasalah || "",
            rekomendasi: hasil.rekomendasi || "",
            pj1: hasil.pj1 || "",
            tanggal_rekomendasi: hasil.tanggal_rekomendasi || "",
            tindakan: hasil.tindakan || "",
            pj2: hasil.pj2 || "",
            tanggal_tindakan: hasil.tanggal_tindakan || "",
            nama: hasil.nama || "",
            verifikasi: hasil.verifikasi ?? "",
            tanggal_mulai_investigasi: hasil.tanggal_mulai_investigasi || "",
            tanggal_selesaii_investigasi: hasil.tanggal_selesaii_investigasi || "",
            investigasi_lengkap: hasil.investigasi_lengkap ?? "",
            tanggal_investigasi: hasil.tanggal_investigasi || "",
            investigasi_lanjut: hasil.investigasi_lanjut ?? "",
            ikp_dampak2_id: hasil.ikp_dampak2_id || "",
            ikp_probabilitas2_id: hasil.ikp_probabilitas2_id || "",
            tanggal_cek: hasil.tanggal_cek || "",
            tindak_lanjut: hasil.tindak_lanjut || "",
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
                submit={"Simpan Hasil Investigasi"}
                closeButton={closeButton}
            />
        </form>
    );
}