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
            resource={props.IkpGrupLayanan}
            title="IKP Grup Layanan"
            description="Kelola grup layanan untuk klasifikasi laporan IKP."
            addLabel="Tambah Grup Layanan"
            addTitle="Tambah Grup Layanan"
            editTitle="Edit IKP Grup Layanan"
            deleteTitle="Hapus IKP Grup Layanan"
            destroyRoute="IkpGrupLayanan.destroy"
            searchPlaceholder="Cari ikp grup layanan..."
            emptyTitle="Belum Ada IKP Grup Layanan"
            emptyDescription="Data ikp grup layanan belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
