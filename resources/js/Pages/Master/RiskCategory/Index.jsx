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
            resource={props.riskCategories}
            title="Kategori Risiko"
            description="Kelola kategori risiko untuk pengelompokan data register risiko."
            addLabel="Tambah Kategori Risiko"
            addTitle="Tambah Kategori Risiko"
            editTitle="Edit Kategori Risiko"
            deleteTitle="Hapus Kategori Risiko"
            destroyRoute="riskCategories.destroy"
            searchPlaceholder="Cari kategori risiko..."
            emptyTitle="Belum Ada Kategori Risiko"
            emptyDescription="Data kategori risiko belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
