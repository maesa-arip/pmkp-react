import DangerButton from "@/Components/DangerButton";
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
import EditOSDResidual from "../KlinisOsd2/Edit";
import EditFormulirRCA from "../KlinisFormulirRCA/Edit";
import EditFGDInherent from "../KlinisFGDInherent/Edit";
import EditFGDResidual from "../KlinisFGDResidual/Edit";
import EditFGDTreated from "../KlinisFGDTreated/Edit";

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
    const riskRegisterCount = props.riskRegisterCount;
    const riskRegisterPengendalianCount = props.riskRegisterPengendalianCount;
    const OpsiPengendalianCount = props.OpsiPengendalianCount;
    const riskRegisterOsd2Count = props.riskRegisterOsd2Count;
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
        indikatorFitur4s: props.indikatorFitur4s,
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
    const openDestroyDialog = (riskregisterklinis1) => {
        setState(riskregisterklinis1);
        setIsOpenDestroyDialog(true);
    };

    const destroyriskregisterklinis1 = () => {
        router.delete(route("riskRegisterKlinis.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null); // Use this state to track the row being edited
    const selectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
    };
    const openEditDialog = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialog(true);
    };
    const openEditDialogOSDResidual = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogOSDResidual(true);
    };

    const openEditDialogFormulirRCA = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogFormulirRCA(true);
    };

    const openEditDialogFGDInherent = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogFGDInherent(true);
    };
    const openEditDialogFGDResidual = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogFGDResidual(true);
    };
    const openEditDialogFGDTreated = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogFGDTreated(true);
    };

    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenEditDialogOSDResidual, setIsOpenEditDialogOSDResidual] = useState(false);
    const [isOpenEditDialogFormulirRCA, setIsOpenEditDialogFormulirRCA] = useState(false);
    const [isOpenEditDialogFGDInherent, setIsOpenEditDialogFGDInherent] = useState(false);
    const [isOpenEditDialogFGDResidual, setIsOpenEditDialogFGDResidual] = useState(false);
    const [isOpenEditDialogFGDTreated, setIsOpenEditDialogFGDTreated] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [state, setState] = useState([]);
    return (
        <>
            <Head title="Risk Register Klinis" />
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-6xl"
                title={`Tambah Risk Register Klinis ` + auth.user.name}
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
                size="max-w-6xl"
                title="Edit Risk Register Klinis"
            >
                <Edit
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogOSDResidual}
                setIsOpenEditDialog={setIsOpenEditDialogOSDResidual}
                size="max-w-6xl"
                title="Edit OSD Residual Risk Register Klinis"
            >
                <EditOSDResidual
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogOSDResidual}
                    setIsOpenEditDialog={setIsOpenEditDialogOSDResidual}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogFormulirRCA}
                setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA}
                size="max-w-6xl"
                title="Edit Formulir RCA Risk Register Klinis"
            >
                <EditFormulirRCA
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogFormulirRCA}
                    setIsOpenEditDialog={setIsOpenEditDialogFormulirRCA}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogFGDInherent}
                setIsOpenEditDialog={setIsOpenEditDialogFGDInherent}
                size="max-w-6xl"
                title="Edit FGD Inherent Risk Register Klinis"
            >
                <EditFGDInherent
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogFGDInherent}
                    setIsOpenEditDialog={setIsOpenEditDialogFGDInherent}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogFGDResidual}
                setIsOpenEditDialog={setIsOpenEditDialogFGDResidual}
                size="max-w-6xl"
                title="Edit FGD Residual Risk Register Klinis"
            >
                <EditFGDResidual
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogFGDResidual}
                    setIsOpenEditDialog={setIsOpenEditDialogFGDResidual}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogFGDTreated}
                setIsOpenEditDialog={setIsOpenEditDialogFGDTreated}
                size="max-w-6xl"
                title="Edit FGD Treated Risk Register Klinis"
            >
                <EditFGDTreated
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogFGDTreated}
                    setIsOpenEditDialog={setIsOpenEditDialogFGDTreated}
                />
            </EditModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-2xl"
                title="Delete Risk Register Klinis"
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
                    <p className="flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg">
                        RISK REGISTER KLINIS ({riskRegisterCount})
                    </p>
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-3/4">
                            <div className="flex items-center justify-start mt-2 mb-0 gap-x-1">
                                <ThirdButton
                                    color="sky"
                                    type="button"
                                    onClick={openAddDialog}
                                >
                                    Tambah Risiko
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-2 icon icon-tabler icon-tabler-square-rounded-plus"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <path d="M9 12h6" />
                                        <path d="M12 9v6" />
                                        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                                    </svg>
                                </ThirdButton>
                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "blue"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialog(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Edit
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-2 icon icon-tabler icon-tabler-edit"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </ThirdButton>

                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "red"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialogOSDResidual(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    OSD Residual ({riskRegisterOsd2Count})
                                </ThirdButton>
                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "yellow"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialogFormulirRCA(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Formulir RCA
                                </ThirdButton>
                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "teal"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialogFGDInherent(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Formulir Inherent
                                </ThirdButton>
                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "cyan"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialogFGDResidual(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    FGD Residual
                                </ThirdButton>
                                <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "sky"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialogFGDTreated(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    FGD Treated
                                </ThirdButton>
                                {/* <ThirdButton
                                    color={
                                        selectedRow === null ? "gray" : "amber"
                                    }
                                    type="button"
                                    className={`${
                                        selectedRow === null
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedRisk =
                                                riskRegisterKlinis[selectedRow];
                                            openEditDialog2(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Pelaporan
                                </ThirdButton> */}
                            </div>
                        </div>
                        <div className="w-1/4">
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
                                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
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
                                                        #
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
                                                {/* <th
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
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase w-96"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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

                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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

                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase"
                                                >
                                                    <div
                                                        className="flex items-center cursor-pointer w-96 gap-x-2"
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
                                                    <tr
                                                        key={index}
                                                        className={
                                                            selectedRow ===
                                                            index
                                                                ? "bg-sky-100  cursor-pointer"
                                                                : "cursor-pointer"
                                                        }
                                                    >
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap"
                                                            onClick={() =>
                                                                selectRow(index)
                                                            }
                                                        >
                                                            {meta.from + index}
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1.tgl_register
                                                                }
                                                            </div>
                                                        </td>

                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
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
                                                        </td> */}
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1.pernyataan_risiko
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1.sebab
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1
                                                                        .risk_variety
                                                                        .name
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1
                                                                        .risk_type
                                                                        .name
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1.dampak
                                                                }
                                                            </div>
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
                                                        <td className="p-2">
                                                            <div className="p-4 border border-gray-300 rounded-md shadow-sm">
                                                                {
                                                                    riskregisterklinis1.pengendalian_risiko
                                                                }
                                                            </div>
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
