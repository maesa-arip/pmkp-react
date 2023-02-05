import { useForm } from '@inertiajs/react';
import React from 'react'
import Form from './Form';

export default function Create({setIsOpenAddDialog, ShouldMap}) {
    const { data, setData, post, reset, errors } = useForm({
        value: "",
        name: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("controlValues.store"), {
            data,
            onSuccess: () => {
                reset(), setIsOpenAddDialog(false);
            },
        });
    };
  return (
    <form onSubmit={onSubmit}>
            <Form {...{ errors, data, ShouldMap, setData, submit: "Simpan", closeButton }} />
        </form>
  )
}
