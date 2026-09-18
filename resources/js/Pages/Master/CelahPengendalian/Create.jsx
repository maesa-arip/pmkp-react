import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import Form from "./Form";

export default function Create({ setIsOpenAddDialog }) {
    const { data, setData, post, reset, errors, processing } = useForm({ name: "", description: "", is_active: true });
    const submitting = useRef(false);
    const onSubmit = e => {
        e.preventDefault();
        if (submitting.current || processing) return;
        submitting.current = true;
        post(route("celahPengendalians.store"), {
            onSuccess: () => { reset(); setIsOpenAddDialog(false); },
            onFinish: () => { submitting.current = false; },
        });
    };
    return <form onSubmit={onSubmit} className="w-full"><Form {...{ data, setData, errors, processing }} submit="Simpan" closeButton={() => setIsOpenAddDialog(false)} /></form>;
}
