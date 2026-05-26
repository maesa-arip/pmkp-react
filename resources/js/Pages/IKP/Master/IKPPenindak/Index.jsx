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
            resource={props.IkpPenindak}
            title="IKP Tindak Lanjut"
            description="Kelola pilihan tindak lanjut untuk laporan keselamatan pasien."
            addLabel="Tambah Tindak Lanjut"
            addTitle="Tambah Tindak Lanjut"
            editTitle="Edit IKP Tindak Lanjut"
            deleteTitle="Hapus IKP Tindak Lanjut"
            destroyRoute="IkpPenindak.destroy"
            searchPlaceholder="Cari ikp tindak lanjut..."
            emptyTitle="Belum Ada IKP Tindak Lanjut"
            emptyDescription="Data ikp tindak lanjut belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
