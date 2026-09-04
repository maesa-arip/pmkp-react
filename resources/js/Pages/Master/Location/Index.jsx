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
            resource={props.locations}
            title="Lokasi Insiden"
            description="Kelola lokasi insiden dan area kerja yang dipakai pada pelaporan."
            addLabel="Tambah Lokasi"
            addTitle="Tambah Lokasi"
            editTitle="Edit Lokasi Insiden"
            deleteTitle="Hapus Lokasi Insiden"
            destroyRoute="locations.destroy"
            searchPlaceholder="Cari lokasi insiden..."
            emptyTitle="Belum Ada Lokasi Insiden"
            emptyDescription="Data lokasi insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
