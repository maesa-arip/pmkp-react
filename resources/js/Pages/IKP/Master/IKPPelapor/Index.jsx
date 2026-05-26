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
            resource={props.IkpPelapor}
            title="IKP Pelapor Insiden"
            description="Kelola kategori pelapor yang tersedia pada formulir IKP."
            addLabel="Tambah Pelapor"
            addTitle="Tambah Pelapor"
            editTitle="Edit IKP Pelapor Insiden"
            deleteTitle="Hapus IKP Pelapor Insiden"
            destroyRoute="IkpPelapor.destroy"
            searchPlaceholder="Cari ikp pelapor insiden..."
            emptyTitle="Belum Ada IKP Pelapor Insiden"
            emptyDescription="Data ikp pelapor insiden belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
