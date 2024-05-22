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
import Pagination from "@/Components/Pagination";
import Table from "@/Components/Table";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import Badge from "@/Components/Badge";

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
        jenisSebabs: props.jenisSebabs,
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
    const openDestroyDialog = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenDestroyDialog(true);
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
    const [isOpenEditDialogOSDResidual, setIsOpenEditDialogOSDResidual] =
        useState(false);
    const [isOpenEditDialogFormulirRCA, setIsOpenEditDialogFormulirRCA] =
        useState(false);
    const [isOpenEditDialogFGDInherent, setIsOpenEditDialogFGDInherent] =
        useState(false);
    const [isOpenEditDialogFGDResidual, setIsOpenEditDialogFGDResidual] =
        useState(false);
    const [isOpenEditDialogFGDTreated, setIsOpenEditDialogFGDTreated] =
        useState(false);
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
                    <div className="flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg">
                        <div className="w-3/4">
                            <div className="flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1">
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
                                            openDestroyDialog(selectedRisk);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Delete
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash"
                                        width={24}
                                        height={24}
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
                                        <path d="M4 7l16 0" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 11l0 6" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
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
                                            openEditDialogFGDInherent(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    FGD Inherent
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
                                            openEditDialogFGDResidual(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    FGD Residual
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
                                            openEditDialogOSDResidual(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    OSD Residual ({riskRegisterOsd2Count})
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
                                            openEditDialogFGDTreated(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    FGD Treated
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
                                            openEditDialogFormulirRCA(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Formulir RCA
                                </ThirdButton>
                            </div>
                        </div>
                        <div className="w-1/4">
                            <div className="flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap">
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
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th onClick={() => sort("tgl_register")}>
                                    Tanggal Register
                                    {params.field == "tgl_register" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "tgl_register" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    width={"w-96"}
                                    onClick={() => sort("pernyataan_risiko")}
                                >
                                    Pernyataan Risiko
                                    {params.field == "pernyataan_risiko" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "pernyataan_risiko" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    width={"w-96"}
                                    onClick={() => sort("sebab")}
                                >
                                    Sebab
                                    {params.field == "sebab" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "sebab" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("risk_type_id")}>
                                    Jenis
                                    {params.field == "risk_type_id" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "risk_type_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("risk_variety_id")}
                                >
                                    Tipe
                                    {params.field == "risk_variety_id" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "risk_variety_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    width={"w-96"}
                                    onClick={() => sort("dampak")}
                                >
                                    Efek
                                    {params.field == "dampak" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "dampak" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("osd1_dampak")}>
                                    OSD1 Dampak
                                    {params.field == "osd1_dampak" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd1_dampak" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("osd1_probabilitas")}
                                >
                                    OSD1 Probabilitas
                                    {params.field == "osd1_probabilitas" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd1_probabilitas" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("osd1_controllability")}
                                >
                                    OSD1 Controllability
                                    {params.field == "osd1_controllability" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd1_controllability" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("osd1_inherent")}>
                                    OSD1 Inherent
                                    {params.field == "osd1_inherent" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd1_inherent" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("osd2_dampak")}>
                                    OSD2 Dampak
                                    {params.field == "osd2_dampak" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd2_dampak" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("osd2_probabilitas")}
                                >
                                    OSD2 Probabilitas
                                    {params.field == "osd2_probabilitas" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd2_probabilitas" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("osd2_controllability")}
                                >
                                    OSD2 Controllability
                                    {params.field == "osd2_controllability" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd2_controllability" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("osd2_inherent")}>
                                    OSD2 Residu
                                    {params.field == "osd2_inherent" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "osd2_inherent" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    width={"w-96"}
                                    onClick={() => sort("pengendalian_risiko")}
                                >
                                    Pengendalian Risiko
                                    {params.field == "pengendalian_risiko" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "pengendalian_risiko" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("user_id")}>
                                    Pemilik Risiko
                                    {params.field == "user_id" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "user_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("user_id")}>
                                    Grading
                                    {params.field == "user_id" &&
                                        params.direction == "asc" && (
                                            <UpIcon/>
                                        )}
                                    {params.field == "user_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {riskRegisterKlinis.map(
                                (riskregisterklinis1, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            selectedRow === index
                                                ? "bg-sky-100  cursor-pointer"
                                                : riskregisterklinis1.riskgrading?.name ==
                                                  "Extreme"
                                                ? "cursor-pointer text-white bg-red-500"
                                                : riskregisterklinis1.riskgrading?.name ==
                                                  "High"
                                                ? "cursor-pointer text-white bg-amber-600"
                                                : riskregisterklinis1.riskgrading?.name ==
                                                  "Moderate"
                                                ? "cursor-pointer text-yellow-950 bg-yellow-400"
                                                : riskregisterklinis1.riskgrading?.name ==
                                                  "Low"
                                                ? "cursor-pointer text-white bg-sky-500"
                                                : "cursor-pointer text-white bg-sky-500"
                                        }
                                        onClick={() => selectRow(index)}
                                    >
                                        <Table.Td>
                                            <Badge>{meta.from + index}</Badge>
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap">
                                            {riskregisterklinis1.tgl_register}
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.pernyataan_risiko
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.sebab}
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.risk_variety?.name
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.risk_type?.name}
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.dampak}
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.osd1_dampak}
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.osd1_probabilitas
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.osd1_controllability
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.osd1_inherent}
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.osd2_dampak}
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.osd2_probabilitas
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.osd2_controllability
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.osd2_inherent}
                                        </Table.Td>
                                        <Table.Td>
                                            {
                                                riskregisterklinis1.pengendalian_risiko
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.user?.name}
                                        </Table.Td>
                                        <Table.Td>
                                            {riskregisterklinis1.riskgrading?.name}
                                        </Table.Td>
                                    </tr>
                                )
                            )}
                        </Table.Tbody>
                    </Table>
                    <Pagination meta={meta} />
                </div>
            </div>
        </>
    );
}
Index.layout = (page) => <App children={page} />;
