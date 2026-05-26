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
            resource={props.jenisSebabs}
            title="Jenis Sebab"
            description="Kelola jenis sebab yang digunakan dalam analisis risiko."
            addLabel="Tambah Jenis Sebab"
            addTitle="Tambah Jenis Sebab"
            editTitle="Edit Jenis Sebab"
            deleteTitle="Hapus Jenis Sebab"
            destroyRoute="jenisSebabs.destroy"
            searchPlaceholder="Cari jenis sebab..."
            emptyTitle="Belum Ada Jenis Sebab"
            emptyDescription="Data jenis sebab belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
