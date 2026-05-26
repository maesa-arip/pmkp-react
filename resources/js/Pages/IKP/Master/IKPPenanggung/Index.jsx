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
            resource={props.IkpPenanggung}
            title="IKP Penanggung Biaya"
            description="Kelola daftar penanggung biaya pada laporan keselamatan pasien."
            addLabel="Tambah Penanggung Biaya"
            addTitle="Tambah Penanggung Biaya"
            editTitle="Edit IKP Penanggung Biaya"
            deleteTitle="Hapus IKP Penanggung Biaya"
            destroyRoute="IkpPenanggung.destroy"
            searchPlaceholder="Cari ikp penanggung biaya..."
            emptyTitle="Belum Ada IKP Penanggung Biaya"
            emptyDescription="Data ikp penanggung biaya belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{}}
            editProps={{}}
        />
    );
}

Index.layout = MasterDataIndex.layout;
