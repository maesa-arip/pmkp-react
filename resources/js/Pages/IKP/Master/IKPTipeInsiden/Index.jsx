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
            resource={props.IkpTipeInsiden}
            title="IKP Tipe Insiden"
            description="Kelola pilihan tipe insiden untuk laporan keselamatan pasien."
            addLabel="Tambah Tipe Insiden"
            addTitle="Tambah Tipe Insiden"
            editTitle="Edit IKP Tipe Insiden"
            deleteTitle="Hapus IKP Tipe Insiden"
            destroyRoute="IkpTipeInsidens.destroy"
            searchPlaceholder="Cari ikp tipe insiden..."
            emptyTitle="Belum Ada IKP Tipe Insiden"
            emptyDescription="Data ikp tipe insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
