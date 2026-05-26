import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    
    const columns = [
        { key: "value", label: "Nilai", sortField: "value", className: "w-[140px]" },
        { key: "name", label: "Nama", sortField: "name", className: "min-w-[260px]" },
        { key: "joined", label: "Dibuat", sortField: "created_at", className: "w-[180px]" },
    ];

    return (
        <MasterDataIndex
            resource={props.IkpProbabilitas}
            title="IKP Probabilitas"
            description="Kelola nilai probabilitas untuk penilaian insiden keselamatan pasien."
            addLabel="Tambah Probabilitas"
            addTitle="Tambah Probabilitas"
            editTitle="Edit IKP Probabilitas"
            deleteTitle="Hapus IKP Probabilitas"
            destroyRoute="IkpProbabilitas.destroy"
            searchPlaceholder="Cari ikp probabilitas..."
            emptyTitle="Belum Ada IKP Probabilitas"
            emptyDescription="Data ikp probabilitas belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
