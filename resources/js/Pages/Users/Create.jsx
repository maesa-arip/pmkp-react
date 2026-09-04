import { useForm } from '@inertiajs/react';
import React from 'react';
import Form from './Form';

export default function Create({ setIsOpenAddDialog, roles, pics, locations }) {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
        email: "",
        pic_id: "",
        create_pic: false,
        new_pic_name: "",
        location_id: "",
        create_location: false,
        new_location_name: "",
        password: "",
        roles: []
    });
    
    const closeButton = (e) => {
        if(e) e.preventDefault();
        setIsOpenAddDialog(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            data,
            onSuccess: () => {
                reset(); 
                setIsOpenAddDialog(false);
            },
        });
    };
    
    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full h-full">
            <Form 
                errors={errors} 
                data={data} 
                roles={roles} 
                pics={pics}
                locations={locations}
                setData={setData} 
                submit="Buat Pengguna Baru" 
                closeButton={closeButton}
                isCreate={true} // Wajibkan password di UI form
            />
        </form>
    );
}
