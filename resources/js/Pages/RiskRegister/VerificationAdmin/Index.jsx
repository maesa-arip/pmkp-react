import Dropdown from "@/Components/Dropdown";
import EditModal from "@/Components/Modal/EditModal";

import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Edit from "./Edit";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import Table from "@/Components/Table";
import Badge from "@/Components/Badge";
import { IconChevronDown } from "@tabler/icons";
import ThirdButton from "@/Components/ThirdButton";
import EditStatus from "../UpdateStatus/Edit";
import moment from "moment";

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
    };

    const [pageNumber, setPageNumber] = useState([]);
    const [params, setParams] = useState(filtered);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const reload = useCallback(
        debounce((query) => {
            router.get(
                route("requeststatus"),
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
        router.delete(route("riskRegisterKlinis.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const openRequestUpdateStatus= (row) => {
        setState(row);
        setEditingRow(row);
        setIsOpenRequestUpdateStatus(true);
    };
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [isOpenRequestUpdateStatus, setIsOpenRequestUpdateStatus] =
        useState(false);
    const [state, setState] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null); // Use this state to track the row being edited
    const selectRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
    };

    return (
        <>
            <Head title="Update Status" />
            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-4xl"
                title="Update Status"
            >
                <Edit
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <EditModal
                isOpenEditDialog={isOpenRequestUpdateStatus}
                setIsOpenEditDialog={setIsOpenRequestUpdateStatus}
                size="max-w-6xl"
                title="Update Status"
            >
                <EditStatus
                    model={state}
                    ShouldMap={ShouldMap}
                    isOpenEditDialog={isOpenRequestUpdateStatus}
                    setIsOpenEditDialog={setIsOpenRequestUpdateStatus}
                />
            </EditModal>
            <div className="px-2 py-12 bg-white border rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <p className="flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg">
                    VERIFIKASI ADMIN
                    </p>
                    <div className="flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg">
                        <div className="w-3/4">
                            <div className="flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2">
                               
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
                                                openEditDialog(
                                                    selectedRisk
                                                )
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Lihat History
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
                                            openRequestUpdateStatus(
                                                selectedRisk
                                            );
                                        }
                                    }}
                                    disabled={selectedRow === null}
                                >
                                    Update Status
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

                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto rounded ">
                            <div className="inline-block min-w-full py-2 align-middle ">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>#</Table.Th>
                                            <Table.Th>
                                                Tanggal Kejadian
                                            </Table.Th>
                                            <Table.Th>
                                                Tanggal Perbaikan
                                            </Table.Th>
                                            <Table.Th
                                                width={"w-96"}
                                                onClick={() => sort("sebab")}
                                            >
                                                Sebab
                                                {params.field == "sebab" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "sebab" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </Table.Th>
                                            <Table.Th
                                                onClick={() => sort("pic_id")}
                                            >
                                                Penanggung Jawab
                                                {params.field == "pic_id" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "pic_id" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
                                            </Table.Th>
                                            <Table.Th
                                                onClick={() => sort("user_id")}
                                            >
                                                Pemilik Risiko
                                                {params.field == "user_id" &&
                                                    params.direction ==
                                                        "asc" && <UpIcon />}
                                                {params.field == "user_id" &&
                                                    params.direction ==
                                                        "desc" && <DownIcon />}
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
                                                            : "cursor-pointer text-red-500 bg-red-50"
                                                    }
                                                    onClick={() =>
                                                        selectRow(index)
                                                    }
                                                >
                                                    <Table.Td>
                                                        <Badge>
                                                            {meta.from + index}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {moment(
                                                            riskregisterklinis1.created_at
                                                        ).format("YYYY-MM-DD")}
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {riskregisterklinis1.requestupdate
                                                            ? riskregisterklinis1
                                                                  .requestupdate
                                                                  .tgl_perbaikan
                                                            : "Belum Perbaikan"}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {
                                                            riskregisterklinis1.sebab
                                                        }
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {
                                                            riskregisterklinis1
                                                                .pic.name
                                                        }
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {
                                                            riskregisterklinis1
                                                                .user.name
                                                        }
                                                    </Table.Td>
                                                </tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                                <Pagination meta={meta} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
Index.layout = (page) => <App children={page} />;
