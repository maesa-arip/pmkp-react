import Container from "@/Components/Container";
import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
import EditHasilInvestigasi from "../HasilInvestigasi/Edit";
import ThirdButton from "@/Components/ThirdButton";
import App from "@/Layouts/App";
import { Head, router } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Table from "@/Components/Table";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";
import moment from "moment";
import SecondaryButton from "@/Components/SecondaryButton";

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
    const { data: IkpPasien, meta, filtered, attributes } = props.IkpPasien;
    // console.log(IkpPasien)
    let ShouldMap = {
        IkpJenisInsiden: props.IkpJenisInsiden,
        IkpTipeInsiden: props.IkpTipeInsiden,
        IkpSpesialisasi: props.IkpSpesialisasi,
        IkpDampak: props.IkpDampak,
        IkpProbabilitas: props.IkpProbabilitas,
        IkpPelapor: props.IkpPelapor,
        IkpGrupLayanan: props.IkpGrupLayanan,
        IkpPenanggung: props.IkpPenanggung,
        IkpLokasi: props.IkpLokasi,
        IkpPenindak: props.IkpPenindak,
        pics: props.pics,
        IkpTerjadiTempatLain: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        JenisKelamin: [
            { id: 1, name: "Laki - Laki" },
            { id: 2, name: "Perempuan" },
            { id: 3, name: "-" },
        ],
        IkpVerifikasi: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        IkpInvestigasiLengkap: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
        IkpInvestigasiLanjut: [
            { id: 0, name: "Tidak" },
            { id: 1, name: "Ya" },
        ],
    };
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
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null); // Use this state to track the row being edited
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [
        isOpenEditDialogHasilInvestigasi,
        setIsOpenEditDialogHasilInvestigasi,
    ] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenPrintDialog, setIsOpenPrintDialog] = useState(false);
    const [state, setState] = useState([]);

    const openAddDialog = () => {
        setIsOpenAddDialog(true);
    };
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
    const openDestroyDialog = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenDestroyDialog(true);
    };
    const destroyIkpPasien = () => {
        router.delete(route("IkpPasien.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };

    const openEditDialogHasilInvestigasi = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenEditDialogHasilInvestigasi(true);
    };
    const openPrintDialog = (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenPrintDialog(true);
    };

    const printIkpPasien = (row) => {
        setState(row);
        window.open(route("export.printFormInvestigasiSederhana", state.code));
        setIsOpenPrintDialog(false);
        // router.get(route("export.printFormInvestigasiSederhana", state.id), {
        //     onSuccess: () => setIsOpenDestroyDialog(false),
        // });
    };
    return (
        <>
            <Head title="IKP Form" />
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-7xl"
                title="Tambah IKP Form"
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
                size="max-w-7xl"
                title="Edit IKP Form"
            >
                <Edit
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialogHasilInvestigasi}
                setIsOpenEditDialog={setIsOpenEditDialogHasilInvestigasi}
                size="max-w-6xl"
                title="Edit Hasil Investigasi"
            >
                <EditHasilInvestigasi
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialogHasilInvestigasi}
                    setIsOpenEditDialog={setIsOpenEditDialogHasilInvestigasi}
                />
            </EditModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-4xl"
                title="Delete IKP Form"
                warning="Yakin hapus data ini ?"
            >
                <DangerButton className="ml-2" onClick={destroyIkpPasien}>
                    Delete
                </DangerButton>
            </DestroyModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenPrintDialog}
                setIsOpenDestroyDialog={setIsOpenPrintDialog}
                size="max-w-4xl"
                title="Print IKP Form"
                warning="Yakin print data ini ?"
            >
                <SecondaryButton className="ml-2" onClick={printIkpPasien}>
                    Print
                </SecondaryButton>
            </DestroyModal>
            <div className="px-2 py-12 bg-white border rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-2/3">
                            <div className="flex items-center justify-start mt-2 mb-0 gap-x-1">
                                <ThirdButton
                                    type="button"
                                    color="sky"
                                    onClick={openAddDialog}
                                >
                                    Tambah IKP
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
                                            const selectedIkp =
                                                IkpPasien[selectedRow];
                                            openEditDialog(selectedIkp);
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
                                            const selectedIkp =
                                                IkpPasien[selectedRow];
                                            openDestroyDialog(selectedIkp);
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
                                            const selectedIkp =
                                                IkpPasien[selectedRow];
                                            openEditDialogHasilInvestigasi(
                                                selectedIkp
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Hasil Investigasi
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-2 icon icon-tabler icon-tabler-report-search"
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
                                        <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
                                        <path d="M18 12v-5a2 2 0 0 0 -2 -2h-2" />
                                        <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                        <path d="M8 11h4" />
                                        <path d="M8 15h3" />
                                        <path d="M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
                                        <path d="M18.5 19.5l2.5 2.5" />
                                    </svg>
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
                                    // onClick={printIkpPasien}
                                    onClick={() => {
                                        if (selectedRow !== null) {
                                            const selectedIkp =
                                                IkpPasien[selectedRow];
                                            openPrintDialog(selectedIkp);
                                            // printIkpPasien(selectedIkp);
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Print Laporan_IKP
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-2 icon icon-tabler icon-tabler-report-search"
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
                                        <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
                                        <path d="M18 12v-5a2 2 0 0 0 -2 -2h-2" />
                                        <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                        <path d="M8 11h4" />
                                        <path d="M8 15h3" />
                                        <path d="M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
                                        <path d="M18.5 19.5l2.5 2.5" />
                                    </svg>
                                </ThirdButton>
                            </div>
                        </div>
                        <div className="w-1/3">
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
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th
                                    onClick={() => sort("tanggal_insiden")}
                                >
                                    Tanggal_Kejadian
                                    {params.field == "tanggal_insiden" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "tanggal_insiden" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("created_at")}>
                                    Tanggal Melapor
                                    {params.field == "created_at" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "created_at" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("lokasi_name")}>
                                    Unit
                                    {params.field == "lokasi_name" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "lokasi_name" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("ikp_jenis_insiden_id")}
                                >
                                    Jenis Insiden
                                    {params.field == "ikp_jenis_insiden_id" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "ikp_jenis_insiden_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("insiden")}>
                                    Insiden
                                    {params.field == "insiden" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "insiden" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>

                                <Table.Th
                                    onClick={() => sort("ikp_penanggung_id")}
                                >
                                    Penannggung Jawab Biaya
                                    {params.field == "ikp_penanggung_id" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "ikp_penanggung_id" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("concatdp")}>
                                    Grading
                                    {params.field == "concatdp" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "concatdp" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th onClick={() => sort("concatdp2")}>
                                    Grading Setelah Investigasi
                                    {params.field == "concatdp2" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "concatdp2" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                {/* <Table.Th></Table.Th> */}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {IkpPasien.map((IkpPasien, index) => (
                                <tr
                                    key={index}
                                    className={
                                        selectedRow === index
                                            ? "bg-sky-100  cursor-pointer"
                                            : IkpPasien.riskgrading.name_ikp ==
                                              "Ekstrim"
                                            ? "cursor-pointer text-white bg-red-500"
                                            : IkpPasien.riskgrading.name_ikp ==
                                              "Tinggi"
                                            ? "cursor-pointer text-white bg-amber-500"
                                            : IkpPasien.riskgrading.name_ikp ==
                                              "Moderat"
                                            ? "cursor-pointer text-white bg-green-500"
                                            : "cursor-pointer text-white bg-sky-500"
                                    }
                                    onClick={() => selectRow(index)}
                                >
                                    <Table.Td>
                                        <Badge>{meta.from + index}</Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {moment(
                                            IkpPasien.tanggal_insiden
                                        ).format("DD-MM-YYYY")}{" "}
                                        (
                                        {moment(
                                            IkpPasien.tanggal_insiden
                                        ).format("hh:mm")}
                                        )
                                    </Table.Td>
                                    <Table.Td className="whitespace-nowrap">
                                        {moment(IkpPasien.created_at).format(
                                            "DD-MM-YYYY"
                                        )}
                                    </Table.Td>
                                    <Table.Td>{IkpPasien.lokasi_name}</Table.Td>
                                    <Table.Td>
                                        {IkpPasien.jenis_insiden?.name}
                                    </Table.Td>
                                    <Table.Td>{IkpPasien.insiden}</Table.Td>

                                    <Table.Td>
                                        {IkpPasien.penanggung?.name}
                                    </Table.Td>
                                    <Table.Td>
                                        {IkpPasien.riskgrading?.name_ikp}
                                    </Table.Td>
                                    <Table.Td>
                                        {IkpPasien.hasil_grading
                                            ? IkpPasien.ikp_hasil
                                                ? IkpPasien.hasil_grading
                                                      ?.name_ikp
                                                : "Belum Investigasi"
                                            : IkpPasien.ikp_hasil
                                            ? "Sudah Investigasi Belum Grading"
                                            : "Belum Investigasi"}
                                    </Table.Td>
                                    {/* <Table.Td>
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
                                                <button
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    onClick={() =>
                                                        openEditDialog(
                                                            IkpPasien
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    onClick={() =>
                                                        openDestroyDialog(
                                                            IkpPasien
                                                        )
                                                    }
                                                >
                                                    Hapus
                                                </button>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </Table.Td> */}
                                </tr>
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
