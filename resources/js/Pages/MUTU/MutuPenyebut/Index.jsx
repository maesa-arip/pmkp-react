import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    const columns = [
        { key: "name", label: "Nama Penyebut / Satuan", sortField: "name", className: "min-w-[260px]" },
        { key: "multiplier", label: "Pengali Hitung", sortField: "multiplier", className: "w-[180px]" },
        { key: "joined", label: "Dibuat", sortField: "created_at", className: "w-[180px]" },
    ];

    return (
        <MasterDataIndex
            resource={props.MutuPenyebut}
            title="Penyebut Mutu"
            description="Kelola pilihan penyebut atau satuan untuk kamus indikator mutu."
            addLabel="Tambah Penyebut"
            addTitle="Tambah Penyebut Mutu"
            editTitle="Edit Penyebut Mutu"
            deleteTitle="Hapus Penyebut Mutu"
            destroyRoute="MutuPenyebut.destroy"
            searchPlaceholder="Cari penyebut atau satuan..."
            emptyTitle="Belum Ada Penyebut"
            emptyDescription="Data penyebut mutu belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
