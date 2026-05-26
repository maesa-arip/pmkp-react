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
            resource={props.identificationSources}
            title="Sumber Identifikasi"
            description="Kelola sumber identifikasi risiko yang dipakai pada formulir risiko."
            addLabel="Tambah Sumber Identifikasi"
            addTitle="Tambah Sumber Identifikasi"
            editTitle="Edit Sumber Identifikasi"
            deleteTitle="Hapus Sumber Identifikasi"
            destroyRoute="identificationSources.destroy"
            searchPlaceholder="Cari sumber identifikasi..."
            emptyTitle="Belum Ada Sumber Identifikasi"
            emptyDescription="Data sumber identifikasi belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
