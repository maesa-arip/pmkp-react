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
            resource={props.IkpSpesialisasi}
            title="IKP Spesialisasi"
            description="Kelola daftar spesialisasi yang digunakan pada formulir IKP."
            addLabel="Tambah Spesialisasi"
            addTitle="Tambah Spesialisasi"
            editTitle="Edit IKP Spesialisasi"
            deleteTitle="Hapus IKP Spesialisasi"
            destroyRoute="IkpSpesialisasi.destroy"
            searchPlaceholder="Cari ikp spesialisasi..."
            emptyTitle="Belum Ada IKP Spesialisasi"
            emptyDescription="Data ikp spesialisasi belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
