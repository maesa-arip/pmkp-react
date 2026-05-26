import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    
    const columns = [
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
            resource={props.riskVarieties}
            title="Jenis Insiden"
            description="Kelola jenis insiden beserta keterangan pendukungnya."
            addLabel="Tambah Jenis Insiden"
            addTitle="Tambah Jenis Insiden"
            editTitle="Edit Jenis Insiden"
            deleteTitle="Hapus Jenis Insiden"
            destroyRoute="riskVarieties.destroy"
            searchPlaceholder="Cari jenis insiden..."
            emptyTitle="Belum Ada Jenis Insiden"
            emptyDescription="Data jenis insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
