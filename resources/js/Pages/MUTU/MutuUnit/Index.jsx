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
import Table from "@/Components/Table";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import moment from "moment";
import EditFormulirPDSA from "../MutuPDSA/Edit";
import ThirdButtonLink from "@/Components/ThirdButtonLink";
import { Fragment } from "react";
import PDSA from "@/Pages/Export/PDSA";
import ExportModal from "@/Components/Modal/ExportModal";
import MutuIndikator from "@/Pages/Export/MutuIndikator";

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
    const { data: MutuUnit, meta, filtered, attributes } = props.MutuUnit;
    // console.log(MutuUnit)
    let ShouldMap = {
        MutuIndikator: props.MutuIndikator,
        IndikatorFitur4: props.IndikatorFitur4,
        IndikatorBaru: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
    };
    const {auth} =  usePage().props;
    // console.log(ShouldMap)
    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);

    const [isInitialRender, setIsInitialRender] = useState(true);
    const reload = useCallback(
        debounce((query) => {
            router.get(
                route(route().current()),
                // route("riskRegisterKlinis.index"),
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
    // const onChange = (event) =>
    //     setParams({ ...params, [event.target.name]: event.target.value });
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
    const openEditDialog = (MutuUnit) => {
        setState(MutuUnit);
        setIsOpenEditDialog(true);
    };
    const openEditPDSADialog = (MutuUnit) => {
        setState(MutuUnit);
        setIsOpenEditDialogFormulirPDSA(true);
    };
    const openDestroyDialog = (MutuUnit) => {
        setState(MutuUnit);
        setIsOpenDestroyDialog(true);
    };

    const destroyMutuUnit = () => {
        router.delete(route("MutuUnit.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenEditDialogFormulirPDSA, setIsOpenEditDialogFormulirPDSA] =
        useState(false);
    const [state, setState] = useState([]);
    
    const [isOpenExportDialogPDSA, setIsOpenExportDialogPDSA] = useState(false);
    const openExportDialogPDSA = () => {
        setIsOpenExportDialogPDSA(true);
    };
    const [isOpenExportDialogMutuIndikator, setIsOpenExportDialogMutuIndikator] = useState(false);
    const openExportDialogMutuIndikator = () => {
        setIsOpenExportDialogMutuIndikator(true);
    };

    const handleGeneratePDF = () => {
        router.post("/exportpdf");
    };
    return (
        <>
            <Head title="Mutu Unit" />
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-4xl"
                title="Tambah Mutu Unit"
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
                title="Edit Mutu Unit"
            >
                <Edit
                    ShouldMap={ShouldMap}
                    model={state}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogFormulirPDSA}
                setIsOpenEditDialog={setIsOpenEditDialogFormulirPDSA}
                size="max-w-6xl"
                title="Edit Formulir PDSA Mutu Unit"
            >
                <EditFormulirPDSA
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogFormulirPDSA}
                    setIsOpenEditDialog={setIsOpenEditDialogFormulirPDSA}
                />
            </EditModal>
            <ExportModal
                    isOpenExportDialog={isOpenExportDialogPDSA}
                    setIsOpenExportDialog={setIsOpenExportDialogPDSA}
                    size="max-w-4xl"
                    title={
                        `Pilihan Export PDSA ` + auth.user.name
                    }
                >
                    <PDSA setIsOpenAddDialog={setIsOpenExportDialogPDSA} />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogMutuIndikator}
                    setIsOpenExportDialog={setIsOpenExportDialogMutuIndikator}
                    size="max-w-4xl"
                    title={
                        `Pilihan Export Indikator  Mutu ` + auth.user.name
                    }
                >
                    <MutuIndikator setIsOpenAddDialog={setIsOpenExportDialogMutuIndikator} />
                </ExportModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-4xl"
                title="Delete Mutu Unit"
                warning="Yakin hapus data ini ?"
            >
                <DangerButton className="ml-2" onClick={destroyMutuUnit}>
                    Delete
                </DangerButton>
            </DestroyModal>
            <div className="px-2 py-12 bg-white border rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-1/2">
                            <div className="flex items-center justify-start mt-2 mb-0 gap-x-1">
                                <ThirdButton
                                    type="button"
                                    onClick={openAddDialog}
                                >
                                    Tambah
                                </ThirdButton>
                                {/* <a
                                    target="_blank"
                                    className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wide text-teal-500 uppercase transition duration-150 ease-in-out border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-teal-50 hover:bg-teal-100 focus:bg-teal-100 active:bg-teal-100 focus:ring-teal-100"
                                    href="/print-table"
                                >
                                    Print PDSA
                                </a> */}
                                <ThirdButton onClick={openExportDialogPDSA}>Print PDSA</ThirdButton>
                                <ThirdButton color="cyan" onClick={openExportDialogMutuIndikator}>Print Indikator</ThirdButton>
                                {/* <ThirdButtonLink color="cyan" type="button" href={'/print-table'} >Print Indikator</ThirdButtonLink> */}
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
                    <Table overflow="none">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Bulan</Table.Th>
                                <Table.Th
                                    onClick={() => sort("mutu_kategori_id")}
                                >
                                    Kategori
                                    {params.field == "mutu_kategori_id" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "mutu_kategori_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>

                                <Table.Th
                                    onClick={() => sort("indikator_fitur4_id")}
                                >
                                    Indikator
                                    {params.field == "indikator_fitur4_id" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "indikator_fitur4_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th colSpan={3}>
                                    Numerator (N) & Denuminator (D)
                                </Table.Th>
                                <Table.Th onClick={() => sort("standar")}>
                                    Capaian
                                    {params.field == "standar" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "standar" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th>Standar</Table.Th>
                                <Table.Th
                                    onClick={() => sort("mutu_kategori_id")}
                                >
                                    UNIT
                                    {params.field == "mutu_kategori_id" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "mutu_kategori_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {MutuUnit.map((MutuUnit, index) => (
                                // <>
                                <Fragment key={index}>
                                    <tr>
                                        <Table.Td rowSpan={2}>
                                            <Badge>{meta.from + index}</Badge>
                                        </Table.Td>
                                        <Table.Td rowSpan={2}>
                                            {/* {MutuUnit.mutu_indikator.standar} {MutuUnit.capaian} */}
                                            {(MutuUnit.mutu_indikator
                                                .operator === "=" &&
                                                MutuUnit.capaian >=
                                                    MutuUnit.mutu_indikator
                                                        .standar) ||
                                            (MutuUnit.mutu_indikator
                                                .operator === "≥" &&
                                                MutuUnit.capaian >=
                                                    MutuUnit.mutu_indikator
                                                        .standar) ||
                                            (MutuUnit.mutu_indikator
                                                .operator === "≤" &&
                                                MutuUnit.capaian <=
                                                    MutuUnit.mutu_indikator
                                                        .standar) ||
                                            (MutuUnit.mutu_indikator
                                                .operator === ">" &&
                                                MutuUnit.capaian >
                                                    MutuUnit.mutu_indikator
                                                        .standar) ||
                                            (MutuUnit.mutu_indikator
                                                .operator === "<" &&
                                                MutuUnit.capaian <
                                                    MutuUnit.mutu_indikator
                                                        .standar) ? (
                                                <Badge>Tercapai</Badge>
                                            ) : (
                                                <>
                                                    {MutuUnit.mutu_pdsa ? (
                                                        <Badge color="yellow">
                                                            Sudah PDSA
                                                        </Badge>
                                                    ) : (
                                                        <Badge color="red">
                                                            Perlu PDSA
                                                        </Badge>
                                                    )}
                                                </>
                                            )}
                                        </Table.Td>
                                        <Table.Td rowSpan={2}>
                                            {moment(MutuUnit.tanggal_mutu)
                                                .locale("he")
                                                .format("MMMM YYYY")}
                                        </Table.Td>
                                        <Table.Td rowSpan={2}>
                                            {
                                                MutuUnit.mutu_indikator.kategori
                                                    .name
                                            }
                                        </Table.Td>
                                        <Table.Td rowSpan={2}>
                                            {
                                                MutuUnit.mutu_indikator
                                                    .indikator_fitur4.name
                                            }
                                        </Table.Td>
                                        <Table.Td>N</Table.Td>
                                        <Table.Td>
                                            {MutuUnit.mutu_indikator.num_name}
                                        </Table.Td>
                                        <Table.Td>{MutuUnit.num}</Table.Td>
                                        <Table.Td
                                            rowSpan={2}
                                            className="whitespace-nowrap"
                                        >
                                            {MutuUnit.capaian}{MutuUnit.mutu_indikator.penyebut}
                                        </Table.Td>
                                        <Table.Td
                                            rowSpan={2}
                                            className="whitespace-nowrap"
                                        >
                                            {MutuUnit.mutu_indikator.operator}{" "}
                                            {MutuUnit.mutu_indikator.standar}{MutuUnit.mutu_indikator.penyebut}
                                        </Table.Td>
                                        <Table.Td
                                            rowSpan={2}
                                            className="whitespace-nowrap"
                                        >
                                            {
                                                MutuUnit.mutu_indikator.location
                                                    .name
                                            }
                                        </Table.Td>
                                        <Table.Td rowSpan={2}>
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
                                                <Dropdown.Content>
                                                    {(MutuUnit.mutu_indikator
                                                        .operator === "=" &&
                                                        MutuUnit.capaian >=
                                                            MutuUnit
                                                                .mutu_indikator
                                                                .standar) ||
                                                    (MutuUnit.mutu_indikator
                                                        .operator === "≥" &&
                                                        MutuUnit.capaian >=
                                                            MutuUnit
                                                                .mutu_indikator
                                                                .standar) ||
                                                    (MutuUnit.mutu_indikator
                                                        .operator === "≤" &&
                                                        MutuUnit.capaian <=
                                                            MutuUnit
                                                                .mutu_indikator
                                                                .standar) ||
                                                    (MutuUnit.mutu_indikator
                                                        .operator === ">" &&
                                                        MutuUnit.capaian >
                                                            MutuUnit
                                                                .mutu_indikator
                                                                .standar) ||
                                                    (MutuUnit.mutu_indikator
                                                        .operator === "<" &&
                                                        MutuUnit.capaian <
                                                            MutuUnit
                                                                .mutu_indikator
                                                                .standar) ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                                onClick={() =>
                                                                    openEditPDSADialog(
                                                                        MutuUnit
                                                                    )
                                                                }
                                                            >
                                                                PDSA
                                                            </button>
                                                            {MutuUnit.mutu_pdsa && (
                                                                <a
                                                                    // target="_blank"
                                                                    className="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out tems-center hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                                    href={`/print-pdsa/${MutuUnit.code}`}
                                                                >
                                                                    Print
                                                                </a>
                                                            )}
                                                        </>
                                                    )}

                                                    <button
                                                        className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                        onClick={() =>
                                                            openEditDialog(
                                                                MutuUnit
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                        onClick={() =>
                                                            openDestroyDialog(
                                                                MutuUnit
                                                            )
                                                        }
                                                    >
                                                        Hapus
                                                    </button>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </Table.Td>
                                    </tr>
                                    <tr>
                                        <Table.Td>D</Table.Td>
                                        <Table.Td>
                                            {MutuUnit.mutu_indikator.denum_name}
                                        </Table.Td>
                                        <Table.Td>{MutuUnit.denum}</Table.Td>
                                    </tr>
                                </Fragment>
                                // </>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Pagination meta={meta} />
                </div>
            </div>
        </>
    );
}
Index.layout = (page) => <App children={page} />;
