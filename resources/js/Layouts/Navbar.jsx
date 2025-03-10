import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";

export default function Navbar() {
    const { auth, permissionNames } = usePage().props;
    const [isOpenMenuModal, setIsOpenMenuModal] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const permission_name = permissionNames
        ? permissionNames.map((permission) => permission.name)
        : "null";
    return (
        <nav className="hidden my-2 bg-white border md:block rounded-xl">
            <div className="px-4 mx-auto ">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex items-center shrink-0">
                            <Link href="/">
                                <ApplicationLogo className="block w-auto text-gray-800 fill-current h-9" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </NavLink>
                            {/* <NavLink
                                href={route("casemix.index")}
                                active={route().current("casemix.index")}
                            >
                                Casemix
                            </NavLink> */}
                            {/* <NavLink
                                href={route("users.index")}
                                active={route().current("users.index")}
                            >
                                Users
                            </NavLink> */}
                            {permission_name.indexOf("atur hak akses") > -1 && (
                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <div className="relative ml-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                    >
                                                        Permission
                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                <Link
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    href={route("users.index")}
                                                >
                                                    Users
                                                </Link>
                                                <Link
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    href={route("roles.index")}
                                                >
                                                    Roles
                                                </Link>
                                                <Link
                                                    className="items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2"
                                                    href={route(
                                                        "permissions.index"
                                                    )}
                                                >
                                                    Permissions
                                                </Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                            {permission_name.indexOf(
                                "edit data master manajemen risiko"
                            ) > -1 && (
                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <div className="relative ml-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                    >
                                                        Master Risiko
                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        "opsiPengendalians.index"
                                                    )}
                                                >
                                                    Opsi Pengendalian
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "riskCategories.index"
                                                    )}
                                                >
                                                    Kategori Risiko
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "identificationSources.index"
                                                    )}
                                                >
                                                    Sumber Identifikasi
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "locations.index"
                                                    )}
                                                >
                                                    Lokasi
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "riskVarieties.index"
                                                    )}
                                                >
                                                    Jenis Insiden
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "riskTypes.index"
                                                    )}
                                                >
                                                    Tipe Insiden
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("pics.index")}
                                                >
                                                    Penangung Jawab/PIC
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "jenisSebabs.index"
                                                    )}
                                                >
                                                    Jenis Sebab
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                            {permission_name.indexOf("atur data nilai") >
                                -1 && (
                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <div className="relative ml-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                    >
                                                        Data Nilai
                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        "impactValues.index"
                                                    )}
                                                >
                                                    Dampak
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "probabilityValues.index"
                                                    )}
                                                >
                                                    Probabilitas
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "controlValues.index"
                                                    )}
                                                >
                                                    Controllability
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                            {permission_name.indexOf(
                                "lihat data risk register sesuai lokasi"
                            ) > -1 && (
                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <div className="relative ml-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                    >
                                                        Data Risiko
                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        "riskRegisterKlinis.index"
                                                    )}
                                                >
                                                    Risk Register Klinis
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "riskRegisterNonKlinis.index"
                                                    )}
                                                >
                                                    Risk Register Non Klinis
                                                </Dropdown.Link>
                                                {/* <Dropdown.Link
                                                href={route(
                                                    "locations.index"
                                                )}
                                            >
                                                Budaya Keselamatan
                                            </Dropdown.Link> */}
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                            {permission_name.indexOf(
                                "lihat data master ikp"
                            ) > -1 && (
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <div className="relative ml-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                >
                                                    Master IKP
                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpJenisInsidens.index"
                                                )}
                                            >
                                                IKP Jenis Insiden
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpTipeInsiden.index"
                                                )}
                                            >
                                                IKP Tipe Insiden
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpSpesialisasi.index"
                                                )}
                                            >
                                                IKP Spesialisasi
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpDampak.index"
                                                )}
                                            >
                                                IKP Dampak
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("IkpProbabilitas.index")}
                                            >
                                                IKP Probabilitas
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpPelapor.index"
                                                )}
                                            >
                                                IKP Melaporkan Insiden
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("IkpGrupLayanan.index")}
                                            >
                                                IKP Menyangkut Pasien
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("IkpPenanggung.index")}
                                            >
                                                IKP Penangung Biaya
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpLokasi.index"
                                                )}
                                            >
                                                IKP Tempat Insiden
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "IkpPenindak.index"
                                                )}
                                            >
                                                IKP Tindak Lanjut
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                            )}
                            {permission_name.indexOf(
                                "lihat data master mutu"
                            ) > -1 && (
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <div className="relative ml-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                                >
                                                    Master Mutu
                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route(
                                                    "MutuKategori.index"
                                                )}
                                            >
                                                Mutu Kategori
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <div className="relative ml-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
                                        >
                                            {auth.user.name}

                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="flex items-center -mr-2 sm:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState
                                )
                            }
                            className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                        >
                            <svg
                                className="w-6 h-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={
                    (showingNavigationDropdown ? "block" : "hidden") +
                    " sm:hidden"
                }
            >
                <div className="pt-2 pb-3 space-y-1">
                    <ResponsiveNavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        Dashboard
                    </ResponsiveNavLink>
                </div>

                <div className="pt-4 pb-1 border-t border-gray-200">
                    <div className="px-4">
                        <div className="text-base font-medium text-gray-800">
                            {auth.user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {auth.user.email}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href={route("profile.edit")}>
                            Profile
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                        >
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
