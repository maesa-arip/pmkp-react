import MasterDataIndex from "@/Components/MasterDataIndex";
import React from "react";
import Create from "./Create";
import Edit from "./Edit";

export default function Index(props) {
    const locations = props.locations || [];
    const columns = [
        { key: "name", label: "Nama", sortField: "name", className: "min-w-[260px]" },

        {
            key: "location",
            label: "Lokasi",
            sortField: "location_id",
            accessor: "location.name",
        },
        { key: "joined", label: "Dibuat", sortField: "created_at", className: "w-[180px]" },
    ];

    return (
        <MasterDataIndex
            resource={props.pics}
            title="PIC / Penanggung Jawab"
            description="Kelola PIC dan lokasi penanggung jawab untuk tindak lanjut risiko."
            addLabel="Tambah PIC"
            addTitle="Tambah PIC"
            editTitle="Edit PIC / Penanggung Jawab"
            deleteTitle="Hapus PIC / Penanggung Jawab"
            destroyRoute="pics.destroy"
            searchPlaceholder="Cari pic / penanggung jawab..."
            emptyTitle="Belum Ada PIC / Penanggung Jawab"
            emptyDescription="Data pic / penanggung jawab belum tersedia."
            columns={columns}
            Create={Create}
            Edit={Edit}
            createProps={{ ShouldMap: locations }}
            editProps={{ ShouldMap: locations }}
        />
    );
}

Index.layout = MasterDataIndex.layout;
