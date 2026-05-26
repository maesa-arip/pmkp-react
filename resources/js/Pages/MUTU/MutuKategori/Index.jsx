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
            resource={props.MutuKategori}
            title="Kategori Mutu"
            description="Kelola kategori mutu untuk pengelompokan indikator mutu."
            addLabel="Tambah Kategori Mutu"
            addTitle="Tambah Kategori Mutu"
            editTitle="Edit Kategori Mutu"
            deleteTitle="Hapus Kategori Mutu"
            destroyRoute="MutuKategori.destroy"
            searchPlaceholder="Cari kategori mutu..."
            emptyTitle="Belum Ada Kategori Mutu"
            emptyDescription="Data kategori mutu belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
