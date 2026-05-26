import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    
    const columns = [
        { key: "value", label: "Nilai", sortField: "value", className: "w-[140px]" },
        { key: "name", label: "Nama", sortField: "name", className: "min-w-[260px]" },
        {
            key: "description",
            label: "Keterangan",
            sortField: "description",
            cellClassName: "whitespace-normal max-w-[480px]",
        },
        { key: "joined", label: "Dibuat", sortField: "created_at", className: "w-[180px]" },
    ];

    return (
        <MasterDataIndex
            resource={props.IkpDampak}
            title="IKP Dampak"
            description="Kelola nilai dan keterangan dampak insiden keselamatan pasien."
            addLabel="Tambah Dampak"
            addTitle="Tambah Dampak"
            editTitle="Edit IKP Dampak"
            deleteTitle="Hapus IKP Dampak"
            destroyRoute="IkpDampak.destroy"
            searchPlaceholder="Cari ikp dampak..."
            emptyTitle="Belum Ada IKP Dampak"
            emptyDescription="Data ikp dampak belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
