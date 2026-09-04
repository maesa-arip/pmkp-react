import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "./Form";

export default function Edit({ setIsOpenEditDialog, model, roles, pics, locations }) {
    // Pengamanan data model
    const safeModel = model || {};

    const { data, setData, put, reset, errors } = useForm({
        name: safeModel.name || "",
        email: safeModel.email || "",
        pic_id: safeModel.pic_id || "",
        create_pic: false,
        new_pic_name: "",
        location_id: "",
        create_location: false,
        new_location_name: "",
        password: "", // Password kosong secara default untuk edit
        roles: safeModel.roles ? safeModel.roles.map(r => r.id) : []
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenEditDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!safeModel.id) return;

        put(route("users.update", safeModel.id), {
            data,
            onSuccess: () => {
                reset(); 
                setIsOpenEditDialog(false);
            },
        });
    };

    useEffect(() => {
        if(!model) return;
        setData({
            ...data,
            name: model.name,
            email: model.email,
            pic_id: model.pic_id || "",
            create_pic: false,
            new_pic_name: "",
            location_id: "",
            create_location: false,
            new_location_name: "",
            password: "", // Jangan tampilkan password lama
            roles: model.roles ? model.roles.map(r => r.id) : []
        });
    }, [model]);

    if (!model || !model.id) return null;

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form
                errors={errors}
                data={data}
                model={model}
                roles={roles}
                pics={pics}
                locations={locations}
                setData={setData}
                submit={"Simpan Perubahan User"}
                closeButton={closeButton}
                isCreate={false} // Beri tahu Form bahwa ini mode Edit
            />
        </form>
    );
}
