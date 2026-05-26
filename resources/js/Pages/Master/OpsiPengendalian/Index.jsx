import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    
    const columns = [
        { key: "name", label: "Nama", sortField: "name", className: "min-w-[260px]" },
        { key: "joined", label: "Dibuat", sortField: "created_at", className: "w-[180px]" },
    ];

    return (
        <MasterDataIndex
            resource={props.opsiPengendalian}
            title="Opsi Pengendalian"
            description="Kelola daftar opsi pengendalian yang digunakan pada register risiko."
            addLabel="Tambah Opsi Pengendalian"
            addTitle="Tambah Opsi Pengendalian"
            editTitle="Edit Opsi Pengendalian"
            deleteTitle="Hapus Opsi Pengendalian"
            destroyRoute="opsiPengendalians.destroy"
            searchPlaceholder="Cari opsi pengendalian..."
            emptyTitle="Belum Ada Opsi Pengendalian"
            emptyDescription="Data opsi pengendalian belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
