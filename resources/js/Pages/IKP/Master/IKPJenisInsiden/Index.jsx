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
            resource={props.IkpJenisInsiden}
            title="IKP Jenis Insiden"
            description="Kelola pilihan jenis insiden untuk laporan keselamatan pasien."
            addLabel="Tambah Jenis Insiden"
            addTitle="Tambah Jenis Insiden"
            editTitle="Edit IKP Jenis Insiden"
            deleteTitle="Hapus IKP Jenis Insiden"
            destroyRoute="IkpJenisInsidens.destroy"
            searchPlaceholder="Cari ikp jenis insiden..."
            emptyTitle="Belum Ada IKP Jenis Insiden"
            emptyDescription="Data ikp jenis insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
