import Container from "@/Components/Container";
import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import AddModal from "@/Components/Modal/AddModal";
import DestroyModal from "@/Components/Modal/DestroyModal";
import EditModal from "@/Components/Modal/EditModal";
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
        data: IkpPenanggung,
        meta,
        filtered,
        attributes,
    } = props.IkpPenanggung;
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
    const openEditDialog = (IkpPenanggung) => {
        setState(IkpPenanggung);
        setIsOpenEditDialog(true);
    };
    const openDestroyDialog = (IkpPenanggung) => {
        setState(IkpPenanggung);
        setIsOpenDestroyDialog(true);
    };

    const destroyIkpPenanggung = () => {
        router.delete(route("IkpPenanggung.destroy", state.id), {
            onSuccess: () => setIsOpenDestroyDialog(false),
        });
    };
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isOpenDestroyDialog, setIsOpenDestroyDialog] = useState(false);
    const [state, setState] = useState([]);
    return (
        <>
            <Head title="IKP Spesialisasi" />
            <AddModal
                isOpenAddDialog={isOpenAddDialog}
                setIsOpenAddDialog={setIsOpenAddDialog}
                size="max-w-4xl"
                title="Tambah IKP Spesialisasi"
            >
                <Create
                    isOpenAddDialog={isOpenAddDialog}
                    setIsOpenAddDialog={setIsOpenAddDialog}
                />
            </AddModal>
            <EditModal
                isOpenEditDialog={isOpenEditDialog}
                setIsOpenEditDialog={setIsOpenEditDialog}
                size="max-w-4xl"
                title="Edit IKP Spesialisasi"
            >
                <Edit
                    model={state}
                    isOpenEditDialog={isOpenEditDialog}
                    setIsOpenEditDialog={setIsOpenEditDialog}
                />
            </EditModal>
            <DestroyModal
                isOpenDestroyDialog={isOpenDestroyDialog}
                setIsOpenDestroyDialog={setIsOpenDestroyDialog}
                size="max-w-4xl"
                title="Delete IKP Spesialisasi"
                warning="Yakin hapus data ini ?"
            >
                <DangerButton className="ml-2" onClick={destroyIkpPenanggung}>
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
                                <Table.Th onClick={() => sort("name")}>
                                    Nama
                                    {params.field == "name" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "name" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th
                                    onClick={() => sort("created_at")}
                                >
                                    DIBUAT
                                    {params.field == "created_at" &&
                                        params.direction == "asc" && <UpIcon />}
                                    {params.field == "created_at" &&
                                        params.direction == "desc" && (
                                            <DownIcon />
                                        )}
                                </Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {IkpPenanggung.map((IkpPenanggung, index) => (
                                <tr key={index}>
                                    <Table.Td>
                                        <Badge>{meta.from + index}</Badge>
                                    </Table.Td>
                                    <Table.Td className="whitespace-nowrap">
                                        {IkpPenanggung.name}
                                    </Table.Td>
                                    <Table.Td>
                                        {IkpPenanggung.joined}
                                    </Table.Td>
                                    <Table.Td>
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
                                                            IkpPenanggung
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    onClick={() =>
                                                        openDestroyDialog(
                                                            IkpPenanggung
                                                        )
                                                    }
                                                >
                                                    Hapus
                                                </button>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </Table.Td>
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
