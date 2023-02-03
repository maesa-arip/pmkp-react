import { useForm } from '@inertiajs/react';
import React from 'react'
import Form from './Form';

export default function Create({setIsOpenAddDialog}) {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("riskTypes.store"), {
            data,
            onSuccess: () => {
                reset(), setIsOpenAddDialog(false);
            },
        });
    };
  return (
    <form onSubmit={onSubmit}>
            <Form {...{ errors, data, setData, submit: "Simpan", closeButton }} />
        </form>
  )
}
