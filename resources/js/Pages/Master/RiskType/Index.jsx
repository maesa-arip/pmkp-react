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
            resource={props.riskTypes}
            title="Tipe Insiden"
            description="Kelola tipe insiden untuk klasifikasi laporan risiko."
            addLabel="Tambah Tipe Insiden"
            addTitle="Tambah Tipe Insiden"
            editTitle="Edit Tipe Insiden"
            deleteTitle="Hapus Tipe Insiden"
            destroyRoute="riskTypes.destroy"
            searchPlaceholder="Cari tipe insiden..."
            emptyTitle="Belum Ada Tipe Insiden"
            emptyDescription="Data tipe insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
