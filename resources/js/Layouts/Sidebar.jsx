import { Link, usePage } from "@inertiajs/react";
import React from "react";
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    FunnelIcon,
    MinusIcon,
    PlusIcon,
    Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ApplicationLogo from "@/Components/ApplicationLogo";
import axios from "axios";
import ExportModal from "@/Components/Modal/ExportModal";
import LarsDHP from "@/Pages/Export/LarsDHP";
import ThirdButton from "@/Components/ThirdButton";

export default function Sidebar() {
    const { auth, notifications } = usePage().props;
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [loadingLars, setLoadingLars] = useState(false);
    const [loadingKlinis, setLoadingKlinis] = useState(false);
    const [loadingNonKlinis, setLoadingNonKlinis] = useState(false);
    const handleExportLARSDHP = () => {
        setLoadingLars(true);
        axios
            .get(route("export.riskregisterklinislarsdhp"), {
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    "Form Manajemen Risiko LARS DHP.xlsx"
                );
                document.body.appendChild(link);
                link.click();
                setLoadingLars(false);
            })
            .catch((error) => {
                console.error("Export failed:", error);
                setLoadingLars(false);
            });
    };
    const handleExportBPKPKlinis = () => {
        setLoadingKlinis(true);
        axios
            .get(route("export.riskregisterklinisbpkp"), {
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    "Proses Manajemen Risiko RSBM.xlsx"
                );
                document.body.appendChild(link);
                link.click();
                setLoadingKlinis(false);
            })
            .catch((error) => {
                console.error("Export failed:", error);
                setLoadingKlinis(false);
            });
    };

    const handleExportBPKPNonKlinis = () => {
        setLoadingNonKlinis(true);
        axios
            .get(route("export.riskregisternonklinisbpkp"), {
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    "Proses Manajemen Risiko RSBM.xlsx"
                );
                document.body.appendChild(link);
                link.click();
                setLoadingNonKlinis(false);
            })
            .catch((error) => {
                console.error("Export failed:", error);
                setLoadingNonKlinis(false);
            });
    };

    const [isOpenExportDialog, setIsOpenExportDialog] = useState(false);
    const openExportDialog = () => {
        setIsOpenExportDialog(true);
    };

    return (
        <div className="col-span-12 col-start-1 py-4 antialiased text-gray-800 md:px-4 md:pb-0 md:pt-4 md:col-span-2 md:block">
            <div className="top-0 left-0 flex flex-col w-full h-full bg-white border rounded-xl ">
                <ExportModal
                    isOpenExportDialog={isOpenExportDialog}
                    setIsOpenExportDialog={setIsOpenExportDialog}
                    size="max-w-4xl"
                    title={`Pilihan Export Register Klinis ` + auth.user.name}
                >
                    <LarsDHP setIsOpenAddDialog={setIsOpenExportDialog} />
                </ExportModal>
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setMobileFiltersOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Menu
                                        </h2>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close menu
                                            </span>
                                            <XMarkIcon
                                                className="w-6 h-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <div className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Pilihan</h3>
                                        <ul
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                            role="list"
                                            className="px-2 py-3 space-y-2 text-sm font-medium text-gray-900 border-b border-gray-200"
                                        >
                                            <li>
                                                <Link
                                                    href={route("dashboard")}
                                                    className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                >
                                                    <span className="inline-flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span className="ml-2 text-sm tracking-wide truncate">
                                                        Dashboard
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route("dashboard")}
                                                    className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                >
                                                    <span className="inline-flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span className="ml-2 text-sm tracking-wide truncate">
                                                        Notifications
                                                    </span>
                                                    {notifications ? (
                                                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                                                            {notifications}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                                                            0
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        </ul>

                                        <Disclosure
                                            as="div"
                                            className="px-4 py-6 border-b border-gray-200"
                                        >
                                            {({ open }) => (
                                                <>
                                                    <h3 className="flow-root -my-3">
                                                        <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                                                            <span className="font-medium text-gray-900">
                                                                Report
                                                            </span>
                                                            <span className="flex items-center ml-6">
                                                                {open ? (
                                                                    <MinusIcon
                                                                        className="w-5 h-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <PlusIcon
                                                                        className="w-5 h-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-4">
                                                            <Link
                                                                href="#"
                                                                onClick={
                                                                    handleExportLARSDHP
                                                                }
                                                                className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                            >
                                                                <span className="inline-flex items-center justify-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            2
                                                                        }
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
                                                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                        <path d="M8 11h8v7h-8z" />
                                                                        <path d="M8 15h8" />
                                                                        <path d="M11 11v7" />
                                                                    </svg>
                                                                </span>
                                                                {loadingLars ? (
                                                                    <button
                                                                        className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        Exporting...
                                                                    </button>
                                                                ) : (
                                                                    <button className="ml-2 text-sm tracking-wide truncate">
                                                                        Format
                                                                        LARS DHP
                                                                    </button>
                                                                )}
                                                            </Link>
                                                            <Link
                                                                href="#"
                                                                onClick={
                                                                    handleExportBPKPKlinis
                                                                }
                                                                className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                            >
                                                                <span className="inline-flex items-center justify-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            2
                                                                        }
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
                                                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                        <path d="M8 11h8v7h-8z" />
                                                                        <path d="M8 15h8" />
                                                                        <path d="M11 11v7" />
                                                                    </svg>
                                                                </span>
                                                                {loadingKlinis ? (
                                                                    <button
                                                                        className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        Exporting...
                                                                    </button>
                                                                ) : (
                                                                    <button className="ml-2 text-sm tracking-wide truncate">
                                                                        Format
                                                                        BPKP
                                                                        KLINIS
                                                                    </button>
                                                                )}
                                                            </Link>
                                                            <Link
                                                                href="#"
                                                                onClick={
                                                                    handleExportBPKPNonKlinis
                                                                }
                                                                className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                            >
                                                                <span className="inline-flex items-center justify-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            2
                                                                        }
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
                                                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                        <path d="M8 11h8v7h-8z" />
                                                                        <path d="M8 15h8" />
                                                                        <path d="M11 11v7" />
                                                                    </svg>
                                                                </span>
                                                                {loadingNonKlinis ? (
                                                                    <button
                                                                        className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        Exporting...
                                                                    </button>
                                                                ) : (
                                                                    <button className="ml-2 text-sm tracking-wide truncate">
                                                                        Format
                                                                        BPKP NON
                                                                        KLINIS
                                                                    </button>
                                                                )}
                                                            </Link>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                        <Disclosure
                                            as="div"
                                            className="px-4 py-6 border-b border-gray-200"
                                        >
                                            {({ open }) => (
                                                <>
                                                    <h3 className="flow-root -my-3">
                                                        <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                                                            <span className="font-medium text-gray-900">
                                                                Data Risiko
                                                            </span>
                                                            <span className="flex items-center ml-6">
                                                                {open ? (
                                                                    <MinusIcon
                                                                        className="w-5 h-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <PlusIcon
                                                                        className="w-5 h-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-4">
                                                            <Link
                                                                onClick={() =>
                                                                    setMobileFiltersOpen(
                                                                        false
                                                                    )
                                                                }
                                                                href={route(
                                                                    "riskRegisterKlinis.index"
                                                                )}
                                                                className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                            >
                                                                <span className="inline-flex items-center justify-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 icon icon-tabler icon-tabler-list-details"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            2
                                                                        }
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
                                                                        <path d="M13 5h8" />
                                                                        <path d="M13 9h5" />
                                                                        <path d="M13 15h8" />
                                                                        <path d="M13 19h5" />
                                                                        <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                        <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="ml-2 text-sm tracking-wide truncate">
                                                                    Risk
                                                                    Register
                                                                    Klinis
                                                                </span>
                                                            </Link>
                                                            <Link
                                                                onClick={() =>
                                                                    setMobileFiltersOpen(
                                                                        false
                                                                    )
                                                                }
                                                                href={route(
                                                                    "riskRegisterNonKlinis.index"
                                                                )}
                                                                className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                            >
                                                                <span className="inline-flex items-center justify-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-5 h-5 icon icon-tabler icon-tabler-list-details"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            2
                                                                        }
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
                                                                        <path d="M13 5h8" />
                                                                        <path d="M13 9h5" />
                                                                        <path d="M13 15h8" />
                                                                        <path d="M13 19h5" />
                                                                        <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                        <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="ml-2 text-sm tracking-wide truncate">
                                                                    Risk
                                                                    Register Non
                                                                    Klinis
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                        <ul
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                            role="list"
                                            className="px-2 py-3 space-y-2 text-sm font-medium text-gray-900 border-b border-gray-200"
                                        >
                                            <li>
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                >
                                                    <span className="inline-flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span className="ml-2 text-sm tracking-wide truncate">
                                                        Profile
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-sm tracking-wide"
                                                >
                                                    <div className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100">
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span className="ml-2 text-sm tracking-wide">
                                                            Logout
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <aside className="px-4 mx-4">
                    <div className="flex items-center justify-between pt-4 pb-4 border-b border-gray-200 md:pt-6">
                        <div className="flex items-center md:hidden shrink-0">
                            <Link href="/">
                                <ApplicationLogo className="block w-auto text-gray-800 fill-current h-9" />
                            </Link>
                        </div>
                        <h1 className="hidden text-base font-bold tracking-tight text-gray-900 md:block">
                            Menu
                        </h1>

                        <div className="flex items-center">
                            <button
                                type="button"
                                className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Menu</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 icon icon-tabler icon-tabler-menu-deep"
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
                                    <path d="M4 6h16" />
                                    <path d="M7 12h13" />
                                    <path d="M10 18h10" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                <h3 className="sr-only">Categories</h3>
                                <ul
                                    role="list"
                                    className="py-4 space-y-2 text-sm font-medium text-gray-900 border-b border-gray-200"
                                >
                                    <li>
                                        <Link
                                            href={route("dashboard")}
                                            className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                        >
                                            <span className="inline-flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="ml-2 text-sm tracking-wide truncate">
                                                Dashboard
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("dashboard")}
                                            className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                        >
                                            <span className="inline-flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="ml-2 text-sm tracking-wide truncate">
                                                Notifications
                                            </span>
                                            {notifications ? (
                                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                                                    {notifications}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                                                    0
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                </ul>

                                <Disclosure
                                    as="div"
                                    className="py-6 border-b border-gray-200"
                                >
                                    {({ open }) => (
                                        <>
                                            <h3 className="flow-root -my-3">
                                                <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                                                    <span className="font-medium text-gray-900">
                                                        Report
                                                    </span>
                                                    <span className="flex items-center ml-6">
                                                        {open ? (
                                                            <MinusIcon
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <PlusIcon
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </h3>
                                            <Disclosure.Panel className="pt-6">
                                                <div className="space-y-4">
                                                    <button
                                                        type="button"

                                                        onClick={
                                                            openExportDialog
                                                        }
                                                        className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                    >
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
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
                                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                <path d="M8 11h8v7h-8z" />
                                                                <path d="M8 15h8" />
                                                                <path d="M11 11v7" />
                                                            </svg>
                                                        </span>
                                                        {loadingLars ? (
                                                            <div
                                                                className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                disabled={true}
                                                            >
                                                                Exporting...
                                                            </div>
                                                        ) : (
                                                            <div className="ml-2 text-sm tracking-wide truncate">
                                                                Format LARS DHP1
                                                            </div>
                                                        )}
                                                    </button>
                                                    <Link
                                                        href="#"
                                                        onClick={
                                                            handleExportBPKPKlinis
                                                        }
                                                        className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                    >
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
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
                                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                <path d="M8 11h8v7h-8z" />
                                                                <path d="M8 15h8" />
                                                                <path d="M11 11v7" />
                                                            </svg>
                                                        </span>
                                                        {loadingKlinis ? (
                                                            <button
                                                                className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                disabled={true}
                                                            >
                                                                Exporting...
                                                            </button>
                                                        ) : (
                                                            <button className="ml-2 text-sm tracking-wide truncate">
                                                                Format BPKP
                                                                KLINIS
                                                            </button>
                                                        )}
                                                    </Link>
                                                    <Link
                                                        href="#"
                                                        onClick={
                                                            handleExportBPKPNonKlinis
                                                        }
                                                        className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                    >
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5 icon icon-tabler icon-tabler-file-spreadsheet"
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
                                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                <path d="M8 11h8v7h-8z" />
                                                                <path d="M8 15h8" />
                                                                <path d="M11 11v7" />
                                                            </svg>
                                                        </span>
                                                        {loadingNonKlinis ? (
                                                            <button
                                                                className="ml-2 text-sm tracking-wide truncate cursor-not-allowed"
                                                                disabled={true}
                                                            >
                                                                Exporting...
                                                            </button>
                                                        ) : (
                                                            <button className="ml-2 text-sm tracking-wide truncate">
                                                                Format BPKP NON
                                                                KLINIS
                                                            </button>
                                                        )}
                                                    </Link>
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                                <Disclosure
                                    as="div"
                                    className="py-6 border-b border-gray-200"
                                >
                                    {({ open }) => (
                                        <>
                                            <h3 className="flow-root -my-3">
                                                <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                                                    <span className="font-medium text-gray-900">
                                                        Data Risiko
                                                    </span>
                                                    <span className="flex items-center ml-6">
                                                        {open ? (
                                                            <MinusIcon
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <PlusIcon
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </h3>
                                            <Disclosure.Panel className="pt-6">
                                                <div className="space-y-4">
                                                    <Link
                                                        href={route(
                                                            "riskRegisterKlinis.index"
                                                        )}
                                                        className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                    >
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5 icon icon-tabler icon-tabler-list-details"
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
                                                                <path d="M13 5h8" />
                                                                <path d="M13 9h5" />
                                                                <path d="M13 15h8" />
                                                                <path d="M13 19h5" />
                                                                <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                            </svg>
                                                        </span>
                                                        <span className="ml-2 text-sm tracking-wide truncate">
                                                            Risk Register Klinis
                                                        </span>
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "riskRegisterNonKlinis.index"
                                                        )}
                                                        className="relative flex flex-row items-center pr-6 text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                                    >
                                                        <span className="inline-flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-5 h-5 icon icon-tabler icon-tabler-list-details"
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
                                                                <path d="M13 5h8" />
                                                                <path d="M13 9h5" />
                                                                <path d="M13 15h8" />
                                                                <path d="M13 19h5" />
                                                                <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                                <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                                            </svg>
                                                        </span>
                                                        <span className="ml-2 text-sm tracking-wide truncate">
                                                            Risk Register Non
                                                            Klinis
                                                        </span>
                                                    </Link>
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                                <ul
                                    role="list"
                                    className="py-4 space-y-2 text-sm font-medium text-gray-900 border-b border-gray-200"
                                >
                                    <li>
                                        <Link
                                            href={route("profile.edit")}
                                            className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100"
                                        >
                                            <span className="inline-flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="ml-2 text-sm tracking-wide truncate">
                                                Profile
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full text-sm tracking-wide"
                                        >
                                            <div className="relative flex flex-row items-center text-gray-600 border-l-4 border-transparent h-11 focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-gray-100">
                                                <span className="inline-flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="ml-2 text-sm tracking-wide">
                                                    Logout
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
