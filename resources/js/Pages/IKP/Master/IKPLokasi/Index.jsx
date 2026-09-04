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
            resource={props.IkpLokasi}
            title="IKP Lokasi Kejadian"
            description="Kelola lokasi kejadian yang tersedia pada formulir IKP."
            addLabel="Tambah Lokasi Kejadian"
            addTitle="Tambah Lokasi Kejadian"
            editTitle="Edit IKP Lokasi Kejadian"
            deleteTitle="Hapus IKP Lokasi Kejadian"
            destroyRoute="IkpLokasi.destroy"
            searchPlaceholder="Cari ikp lokasi kejadian..."
            emptyTitle="Belum Ada IKP Lokasi Kejadian"
            emptyDescription="Data ikp lokasi kejadian belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
