import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import Form from "./Form";

export default function Edit({ model, setIsOpenEditDialog }) {
    const values = () => ({ name: model.name || "", description: model.description || "", is_active: Boolean(model.is_active) });
    const { data, setData, put, errors, processing } = useForm(values());
    const submitting = useRef(false);
    useEffect(() => { setData(values()); }, [model]);
    const onSubmit = e => {
        e.preventDefault();
        if (!model.id || submitting.current || processing) return;
        submitting.current = true;
        put(route("celahPengendalians.update", model.id), {
            onSuccess: () => setIsOpenEditDialog(false),
            onFinish: () => { submitting.current = false; },
        });
    };
    return <form onSubmit={onSubmit} className="w-full"><Form {...{ data, setData, errors, processing }} submit="Simpan Perubahan" closeButton={() => setIsOpenEditDialog(false)} /></form>;
}
