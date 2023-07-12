import Container from "@/Components/Container";
import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import ThirdButton from "@/Components/ThirdButton";
import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Create from "./Create";
import Edit from "./Edit";

const UpIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
        />
    </svg>
);
const DownIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

export default function Index(props) {
    const {
        data: riskRegisterKlinis,
        meta,
        filtered,
        attributes,
    } = props.riskRegisterKlinis;
    const { auth } = usePage().props;
    let ShouldMap = {
        riskCategories: props.riskCategories,
        identificationSources: props.identificationSources,
        locations: props.locations,
        riskVarieties: props.riskVarieties,
        riskTypes: props.riskTypes,
        opsiPengendalian: props.opsiPengendalian,
        pembiayaanRisiko: props.pembiayaanRisiko,
        efektif: props.efektif,
        jenisPengendalian: props.jenisPengendalian,
        waktuPengendalian: props.waktuPengendalian,
        waktuImplementasi: props.waktuImplementasi,
        pics: props.pics,
        impactValues: props.impactValues,
        probabilityValues: props.probabilityValues,
        controlValues: props.controlValues,
        indikatorFitur04s: props.indikatorFitur04s,
        proses: [
            { id: 1, name: "Mulai" },
            { id: 2, name: "Dalam Proses" },
            { id: 3, name: "Selesai" },
            { id: 4, name: "Ditangani" },
        ],
        type: [
            { id: 1, name: "Klinis" },
            { id: 2, name: "Non Klinis" },
        ],
        currently: [
            { id: 1, name: "Sedang Terjadi" },
            { id: 2, name: "Tidak Sedang Terjadi" },
        ],
        pengawasan: [
            { id: 1, name: "Sudah dilaksanakan" },
            { id: 2, name: "Belum dilaksanakan" },
        ],
        perluPenanganan: [
            { id: 1, name: "Ya" },
            { id: 2, name: "Tidak" },
        ],
        realisasi: [
            { id: 1, name: "Sudah Tercapai" },
            { id: 2, name: "Belum Tercapai" },
        ],
    };

    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const reload = useCallback(
        debounce((query) => {
            router.get(
                route(route().current()),
                { ...pickBy(query), page: query.page },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 150),
        []
    );

    useEffect(() => {
        if (!isInitialRender) {
            reload(params);
        } else {
            setIsInitialRender(false);
        }
    }, [params]);
    useEffect(() => {
        let numbers = [];
        for (
            let i = attributes.per_page;
            i < attributes.total / attributes.per_page;
            i = i + attributes.per_page
        ) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, []);
    const onChange = (event) => {
        const updatedParams = {
            ...params,
            [event.target.name]: event.target.value,
            page: 1, // Set page number to 1
        };
        setParams(updatedParams);
    };
    const sort = (item) => {
        setParams({
            ...params,
            field: item,
            direction: params.direction == "asc" ? "desc" : "asc",
        });
    };

    // CRUD

    const openAddDialog = () => {
        setIsOpenAddDialog(true);
    };
    const openEditDialog = (riskregisterklinis1) => {
        setState(riskregisterklinis1);
        setIsOpenEditDialog(true);
    };
    const openDestroyDialog = (riskregisterklinis1) => {
        setState(riskregisterklinis1);
        setIsOpenDestroyDialog(true);
    };

    const destroyriskregisterklinis1 = () => {
        router.delete(route("riskRegisterNonKlinis.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [state, setState] = useState([]);
    return (
        <>
            <Head title="Risk Register Non Klinis" />
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-4xl"
                title={`Tambah Risk Register Non Klinis ` + auth.user.name}
            >
                <Create
                    ShouldMap={ShouldMap}
                    isOpenAddDialog={isOpenAddDialog}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </AddModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-4xl"
                title="Edit Risk Register Non Klinis"
            >
                <Edit
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-2xl"
                title="Delete Risk Register Non Klinis"
                warning="Yakin hapus data ini ?"
            >
                <DangerButton
                    className="ml-2"
                    onClick={destroyriskregisterklinis1}
                >
                    Delete
                </DangerButton>
            </DestroyModal>

            <div className="px-2 py-12 bg-white border rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <p className="flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg">RISK REGISTER NON KLINIS</p>
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-1/2">
                            <div className="flex items-center justify-start mt-2 mb-0 gap-x-1">
                                <ThirdButton
                                    type="button"
                                    onClick={openAddDialog}
                                >
                                    Tambah
                                </ThirdButton>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex items-center justify-end mt-2 mb-0 gap-x-1">
                                <select
                                    name="load"
                                    id="load"
                                    onChange={onChange}
                                    value={params.load}
                                    className="transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select"
                                >
                                    {pageNumber.map((page, index) => (
                                        <option key={index}>{page}</option>
                                    ))}
                                </select>
                                <div className="flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring">
                                    <svg
                                        className="inline w-5 h-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        name="q"
                                        id="q"
                                        onChange={onChange}
                                        value={params.q}
                                        className="w-full border-0 focus:ring-0 form-text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col p-1">
                        <div className="-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="border-b border-gray-200 shadow sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div className="flex items-center cursor-pointer gap-x-2">
                                                        #
                                                    </div>
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("proses")
                                                        }
                                                    >
                                                        Proses
                                                        {params.field ==
                                                            "proses" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "proses" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("created_at")
                                                        }
                                                    >
                                                        Opsi
                                                        {params.field ==
                                                            "created_at" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "created_at" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("tgl_register")
                                                        }
                                                    >
                                                        Tanggal Register
                                                        {params.field ==
                                                            "tgl_register" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "tgl_register" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("tgl_selesai")
                                                        }
                                                    >
                                                        Tanggal Selesai
                                                        {params.field ==
                                                            "tgl_selesai" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "tgl_selesai" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "risk_category_id"
                                                            )
                                                        }
                                                    >
                                                        Kategori
                                                        {params.field ==
                                                            "risk_category_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "risk_category_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "identification_source_id"
                                                            )
                                                        }
                                                    >
                                                        Sumber
                                                        {params.field ==
                                                            "identification_source_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "identification_source_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "pernyataan_risiko"
                                                            )
                                                        }
                                                    >
                                                        Pernyataan Risiko
                                                        {params.field ==
                                                            "pernyataan_risiko" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "pernyataan_risiko" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("sebab")
                                                        }
                                                    >
                                                        Sebab
                                                        {params.field ==
                                                            "sebab" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "sebab" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("location_id")
                                                        }
                                                    >
                                                        Tanggal
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("risk_type_id")
                                                        }
                                                    >
                                                        Jenis
                                                        {params.field ==
                                                            "risk_type_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "risk_type_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "risk_variety_id"
                                                            )
                                                        }
                                                    >
                                                        Tipe
                                                        {params.field ==
                                                            "risk_variety_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "risk_variety_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("dampak")
                                                        }
                                                    >
                                                        Efek
                                                        {params.field ==
                                                            "dampak" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "dampak" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("osd1_dampak")
                                                        }
                                                    >
                                                        OSD1 Dampak
                                                        {params.field ==
                                                            "osd1_dampak" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd1_dampak" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd1_probabilitas"
                                                            )
                                                        }
                                                    >
                                                        OSD1 Probabilitas
                                                        {params.field ==
                                                            "osd1_probabilitas" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd1_probabilitas" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd1_controllability"
                                                            )
                                                        }
                                                    >
                                                        OSD1 Controllability
                                                        {params.field ==
                                                            "osd1_controllability" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd1_controllability" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd1_inherent"
                                                            )
                                                        }
                                                    >
                                                        OSD1 Inherent
                                                        {params.field ==
                                                            "osd1_inherent" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd1_inherent" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("osd2_dampak")
                                                        }
                                                    >
                                                        OSD2 Dampak
                                                        {params.field ==
                                                            "osd2_dampak" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd2_dampak" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd2_probabilitas"
                                                            )
                                                        }
                                                    >
                                                        OSD2 Probabilitas
                                                        {params.field ==
                                                            "osd2_probabilitas" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd2_probabilitas" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd2_controllability"
                                                            )
                                                        }
                                                    >
                                                        OSD2 Controllability
                                                        {params.field ==
                                                            "osd2_controllability" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd2_controllability" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "osd2_inherent"
                                                            )
                                                        }
                                                    >
                                                        OSD2 Residu
                                                        {params.field ==
                                                            "osd2_inherent" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "osd2_inherent" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("location_id")
                                                        }
                                                    >
                                                        Grading
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort(
                                                                "pengendalian_risiko"
                                                            )
                                                        }
                                                    >
                                                        Pengendalian Risiko
                                                        {params.field ==
                                                            "pengendalian_risiko" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "pengendalian_risiko" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("pic_id")
                                                        }
                                                    >
                                                        PIC
                                                        {params.field ==
                                                            "pic_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "pic_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("user_id")
                                                        }
                                                    >
                                                        Pemilik Risiko
                                                        {params.field ==
                                                            "user_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "user_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer gap-x-2"
                                                        onClick={() =>
                                                            sort("location_id")
                                                        }
                                                    >
                                                        Pengawasan
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "asc" && (
                                                                <UpIcon />
                                                            )}
                                                        {params.field ==
                                                            "location_id" &&
                                                            params.direction ==
                                                                "desc" && (
                                                                <DownIcon />
                                                            )}
                                                    </div>
                                                </th> */}

                                                <th
                                                    scope="col"
                                                    className="relative px-6 py-3"
                                                >
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {riskRegisterKlinis.map(
                                                (
                                                    riskregisterklinis1,
                                                    index
                                                ) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {meta.from + index}
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.proses_id
                                                            }
                                                        </td> */}
                                                        <td className="text-center">
                                                            <Dropdown>
                                                                <Dropdown.Trigger>
                                                                    <button>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="w-4 h-4 text-gray-400"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        </svg>
                                                                    </button>
                                                                </Dropdown.Trigger>
                                                                <Dropdown.Content
                                                                    align="right"
                                                                    width="24"
                                                                >
                                                                    <button
                                                                        className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                                        onClick={() =>
                                                                            openEditDialog(
                                                                                riskregisterklinis1
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                                        onClick={() =>
                                                                            openDestroyDialog(
                                                                                riskregisterklinis1
                                                                            )
                                                                        }
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.tgl_register
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.tgl_selesai
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .risk_category
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .identification_source
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.pernyataan_risiko
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.sebab
                                                            }
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.joined
                                                            }
                                                        </td> */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .risk_variety
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .risk_type
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.dampak
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd1_dampak
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd1_probabilitas
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd1_controllability
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd1_inherent
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd2_dampak
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd2_probabilitas
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd2_controllability
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.osd2_inherent
                                                            }
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .grading1
                                                            }
                                                        </td> */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1.pengendalian_risiko
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .pic.name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .user.name
                                                            }
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                riskregisterklinis1
                                                                    .pengawasan_id
                                                            }
                                                        </td> */}
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <Pagination meta={meta} /> */}
                                <ul className="flex items-center mt-10 gap-x-1">
                                    {meta.links.map((item, index) => (
                                        <button
                                            key={index}
                                            disabled={
                                                item.url == null ? true : false
                                            }
                                            className={`${
                                                item.url == null
                                                    ? "text-gray-500"
                                                    : "text-gray-800"
                                            } w-12 h-9 rounded-lg flex items-center justify-center border bg-white`}
                                            onClick={() =>
                                                setParams({
                                                    ...params,
                                                    page: new URL(
                                                        item.url
                                                    ).searchParams.get("page"),
                                                })
                                            }
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
Index.layout = (page) => <App children={page} />;
