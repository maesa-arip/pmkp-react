import { Link, usePage } from "@inertiajs/react";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    XMarkIcon,
    Squares2X2Icon,
    BellIcon,
    ClipboardDocumentCheckIcon,
    ShieldExclamationIcon,
    DocumentChartBarIcon,
    ChartPieIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    DocumentTextIcon,
    FolderOpenIcon,
    BeakerIcon,
    CircleStackIcon,
} from "@heroicons/react/24/outline";
import {
    MinusIcon,
    PlusIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/20/solid";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ExportModal from "@/Components/Modal/ExportModal";

// Export Modals
import LarsDHPKlinis from "@/Pages/Export/LarsDHPKlinis";
import LarsDHPNonKlinis from "@/Pages/Export/LarsDHPNonKlinis";
import BPKP from "@/Pages/Export/BPKP";
import SedangTerjadi from "@/Pages/Export/SedangTerjadi";
import IKPDataInsiden from "@/Pages/Export/IKPDataInsiden";
import IKPDataEvaluasi from "@/Pages/Export/IKPDataEvaluasi";

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const { auth, notifications, updatestatus, permissionNames } =
        usePage().props;
    const permission_name = permissionNames
        ? permissionNames.map((p) => p.name)
        : [];
    const hasPermission = (...names) =>
        names.some((name) => permission_name.indexOf(name) > -1);
    const canSeeRiskMaster = hasPermission(
        "lihat data master manajemen risiko",
        "atur data master manajemen risiko",
        "edit data master manajemen risiko",
    );
    const canSeeValueMaster = hasPermission("atur nilai", "atur data nilai");
    const canSeeIkpMaster = hasPermission("lihat data master ikp");
    const canSeeMutuMaster = hasPermission("lihat data master mutu");
    const canSeeAccessMaster = hasPermission("atur hak akses");

    // console.log("Permissions:", permission_name); // Debug: Cek permissions yang diterima
    const closeSidebar = () => {
        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const [isOpenExportDialogBPKP, setIsOpenExportDialogBPKP] = useState(false);
    const [
        isOpenExportDialogSedangTerjadi,
        setIsOpenExportDialogSedangTerjadi,
    ] = useState(false);
    const [
        isOpenExportDialogIKPDataInsiden,
        setIsOpenExportDialogIKPDataInsiden,
    ] = useState(false);
    const [
        isOpenExportDialogIKPDataEvaluasi,
        setIsOpenExportDialogIKPDataEvaluasi,
    ] = useState(false);
    const [
        isOpenExportDialogLarsDHPKlinis,
        setIsOpenExportDialogLarsDHPKlinis,
    ] = useState(false);
    const [
        isOpenExportDialogLarsDHPNonKlinis,
        setIsOpenExportDialogLarsDHPNonKlinis,
    ] = useState(false);

    const openExportDialogBPKP = () => setIsOpenExportDialogBPKP(true);
    const openExportDialogSedangTerjadi = () =>
        setIsOpenExportDialogSedangTerjadi(true);
    const openExportDialogIKPDataInsiden = () =>
        setIsOpenExportDialogIKPDataInsiden(true);
    const openExportDialogIKPDataEvaluasi = () =>
        setIsOpenExportDialogIKPDataEvaluasi(true);
    const openExportDialogLarsDHPKlinis = () =>
        setIsOpenExportDialogLarsDHPKlinis(true);
    const openExportDialogLarsDHPNonKlinis = () =>
        setIsOpenExportDialogLarsDHPNonKlinis(true);

    const routeName = route().current() || "";
    const isActive = (path) => routeName === path;

    const isMasterRoute = [
        "opsiPengendalians",
        "riskCategories",
        "identificationSources",
        "locations",
        "riskVarieties",
        "riskTypes",
        "pics",
        "jenisSebabs",
        "impactValues",
        "probabilityValues",
        "controlValues",
        "IkpJenisInsidens",
        "IkpTipeInsiden",
        "IkpSpesialisasi",
        "IkpDampak",
        "IkpProbabilitas",
        "IkpPelapor",
        "IkpGrupLayanan",
        "IkpPenanggung",
        "IkpLokasi",
        "IkpPenindak",
        "MutuKategori",
    ].some((prefix) => routeName.startsWith(prefix));

    const [openMenu, setOpenMenu] = useState(() => {
        if (
            isActive("riskregister.verificationmanagementoccurring") ||
            isActive("riskregister.verificationadminoccurring")
        )
            return "verifikasi-berjalan";
        if (
            isActive("riskregister.verificationmanagementpriority") ||
            isActive("riskregister.verificationadminpriority")
        )
            return "verifikasi-prioritas";
        if (routeName.startsWith("riskRegister")) return "data-risiko";
        if (isActive("rca.sedangterjadi") || isActive("rca.risikoprioritas"))
            return "formulir-rca";
        if (
            routeName.startsWith("Mutu") &&
            !routeName.startsWith("MutuKategori")
        )
            return "data-mutu";
        if (isMasterRoute) return "data-master";
        if (
            routeName.startsWith("users") ||
            routeName.startsWith("roles") ||
            routeName.startsWith("permissions")
        )
            return "akses-sistem";
        return null;
    });

    const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);

    // --- REVISI KELAS CSS SPACING LEBIH LEGA ---
    const getNavClasses = (active) => `
        flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group w-full text-left
        ${active ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 shadow-sm" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"}
    `;

    // Margin ikon dilebarkan dari mr-3 ke mr-4
    const getIconClasses = (active) => `
        w-5 h-5 mr-4 shrink-0 transition-colors duration-200
        ${active ? "text-sky-600 dark:text-sky-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"}
    `;

    // Padding submenu lebih lega (px-4 py-2.5) dan hover efek bergeser (hover:pl-5)
    const getSubNavClasses = (active) => `
        block px-4 py-2.5 text-[13px] transition-all duration-200 rounded-xl w-full text-left
        ${
            active
                ? "bg-transparent text-sky-700 dark:text-sky-400 font-bold relative before:absolute before:inset-y-2 before:-left-[1px] before:w-[3px] before:bg-sky-500 before:rounded-r-md"
                : "text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 hover:pl-5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50"
        }
    `;

    const AccordionItem = ({ id, active, title, icon: Icon, children }) => {
        const isOpen = openMenu === id;
        return (
            <div>
                <button
                    onClick={() => toggleMenu(id)}
                    className={getNavClasses(active)}
                >
                    <div className="flex items-center">
                        <Icon className={getIconClasses(active)} />
                        {title}
                    </div>
                    {/* Ikon Plus/Minus di kanan diberi sedikit opacity agar tidak terlalu tajam */}
                    {isOpen ? (
                        <MinusIcon className="w-4 h-4 ml-2 opacity-40 shrink-0" />
                    ) : (
                        <PlusIcon className="w-4 h-4 ml-2 opacity-40 shrink-0" />
                    )}
                </button>
                <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0"}`}
                >
                    <div className="overflow-hidden">
                        {/* ml-[26px] memastikan border-line sejajar tegak lurus dari tengah Ikon Kiri */}
                        <div className="pl-3 pr-2 ml-[26px] pb-2 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700/80 relative">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Label Seksi Utama diberi margin top lebih lega (mt-8)
    const SectionLabel = ({ title }) => (
        <p className="px-4 mb-3 mt-8 text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {title}
        </p>
    );

    // Label Sub-Seksi
    const SubSectionLabel = ({ title }) => (
        <span className="block px-4 mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400/80 dark:text-slate-500">
            {title}
        </span>
    );

    const NavigationContent = () => (
        <div className="pt-2 pb-10">
            {/* SECTION: UTAMA */}
            <div className="space-y-1.5">
                <Link
                    href={route("dashboard")}
                    onClick={closeSidebar}
                    className={getNavClasses(isActive("dashboard"))}
                >
                    <div className="flex items-center">
                        <Squares2X2Icon
                            className={getIconClasses(isActive("dashboard"))}
                        />
                        Dashboard
                    </div>
                </Link>
                <Link
                    href={route("notifications")}
                    onClick={closeSidebar}
                    className={getNavClasses(isActive("notifications"))}
                >
                    <div className="flex items-center">
                        <BellIcon
                            className={getIconClasses(
                                isActive("notifications"),
                            )}
                        />
                        Riwayat & Notifikasi
                    </div>
                    {notifications > 0 && (
                        <span className="px-2.5 py-0.5 ml-2 text-[10px] font-black rounded-md bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shadow-sm">
                            {notifications}
                        </span>
                    )}
                </Link>
                <Link
                    href={route("requeststatus")}
                    onClick={closeSidebar}
                    className={getNavClasses(isActive("requeststatus"))}
                >
                    <div className="flex items-center">
                        <ClipboardDocumentCheckIcon
                            className={getIconClasses(
                                isActive("requeststatus"),
                            )}
                        />
                        Status Request
                    </div>
                    {updatestatus > 0 && (
                        <span className="px-2.5 py-0.5 ml-2 text-[10px] font-black rounded-md bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 shadow-sm">
                            {updatestatus}
                        </span>
                    )}
                </Link>
            </div>

            {/* SECTION: MANAJEMEN RISIKO */}
            <div>
                <SectionLabel title="Manajemen Risiko" />
                <div className="space-y-1.5">
                    {permission_name.indexOf("lihat data verifikasi") > -1 && (
                        <AccordionItem
                            id="verifikasi-berjalan"
                            active={
                                isActive(
                                    "riskregister.verificationmanagementoccurring",
                                ) ||
                                isActive(
                                    "riskregister.verificationadminoccurring",
                                )
                            }
                            title="Verifikasi Berjalan"
                            icon={ShieldExclamationIcon}
                        >
                            <Link
                                href={route(
                                    "riskregister.verificationmanagementoccurring",
                                )}
                                onClick={closeSidebar}
                                className={getSubNavClasses(
                                    isActive(
                                        "riskregister.verificationmanagementoccurring",
                                    ),
                                )}
                            >
                                Level Manajemen
                            </Link>
                            <Link
                                href={route(
                                    "riskregister.verificationadminoccurring",
                                )}
                                onClick={closeSidebar}
                                className={getSubNavClasses(
                                    isActive(
                                        "riskregister.verificationadminoccurring",
                                    ),
                                )}
                            >
                                Admin Risiko
                            </Link>
                        </AccordionItem>
                    )}
                    <AccordionItem
                        id="verifikasi-prioritas"
                        active={
                            isActive(
                                "riskregister.verificationmanagementpriority",
                            ) ||
                            isActive("riskregister.verificationadminpriority")
                        }
                        title="Verifikasi Prioritas"
                        icon={ShieldExclamationIcon}
                    >
                        <Link
                            href={route(
                                "riskregister.verificationmanagementpriority",
                            )}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive(
                                    "riskregister.verificationmanagementpriority",
                                ),
                            )}
                        >
                            Level Manajemen
                        </Link>
                        <Link
                            href={route(
                                "riskregister.verificationadminpriority",
                            )}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive(
                                    "riskregister.verificationadminpriority",
                                ),
                            )}
                        >
                            Admin Risiko
                        </Link>
                    </AccordionItem>
                    <AccordionItem
                        id="data-risiko"
                        active={routeName.startsWith("riskRegister")}
                        title="Register Risiko"
                        icon={FolderOpenIcon}
                    >
                        <Link
                            href={route("riskRegisterKlinis.index")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("riskRegisterKlinis.index"),
                            )}
                        >
                            Risiko Klinis
                        </Link>
                        <Link
                            href={route("riskRegisterNonKlinis.index")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("riskRegisterNonKlinis.index"),
                            )}
                        >
                            Risiko Non Klinis
                        </Link>
                    </AccordionItem>
                    <AccordionItem
                        id="formulir-rca"
                        active={
                            isActive("rca.sedangterjadi") ||
                            isActive("rca.risikoprioritas")
                        }
                        title="Formulir RCA"
                        icon={DocumentChartBarIcon}
                    >
                        <Link
                            href={route("rca.sedangterjadi")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("rca.sedangterjadi"),
                            )}
                        >
                            Risiko Berjalan
                        </Link>
                        <Link
                            href={route("rca.risikoprioritas")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("rca.risikoprioritas"),
                            )}
                        >
                            Risiko Prioritas
                        </Link>
                    </AccordionItem>
                    <AccordionItem
                        id="report-risiko"
                        active={false}
                        title="Report Risiko"
                        icon={ChartPieIcon}
                    >
                        <button
                            onClick={() => {
                                openExportDialogLarsDHPKlinis();
                                closeSidebar();
                            }}
                            className={`${getSubNavClasses(false)} flex justify-between items-center group/btn`}
                        >
                            LARS DHP Klinis{" "}
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => {
                                openExportDialogLarsDHPNonKlinis();
                                closeSidebar();
                            }}
                            className={`${getSubNavClasses(false)} flex justify-between items-center group/btn`}
                        >
                            PERGUB Non Klinis{" "}
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => {
                                openExportDialogBPKP();
                                closeSidebar();
                            }}
                            className={`${getSubNavClasses(false)} flex justify-between items-center group/btn`}
                        >
                            Report BPKP{" "}
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                    </AccordionItem>
                </div>
            </div>

            {/* SECTION: IKP & MUTU */}
            <div>
                <SectionLabel title="Insiden Pasien & Mutu" />
                <div className="space-y-1.5">
                    <Link
                        href={route("IkpPasien.index")}
                        onClick={closeSidebar}
                        className={getNavClasses(isActive("IkpPasien.index"))}
                    >
                        <div className="flex items-center">
                            <DocumentTextIcon
                                className={getIconClasses(
                                    isActive("IkpPasien.index"),
                                )}
                            />{" "}
                            Data Insiden (IKP)
                        </div>
                    </Link>
                    <AccordionItem
                        id="report-ikp"
                        active={false}
                        title="Report IKP"
                        icon={ChartPieIcon}
                    >
                        <button
                            onClick={() => {
                                openExportDialogIKPDataInsiden();
                                closeSidebar();
                            }}
                            className={`${getSubNavClasses(false)} flex justify-between items-center group/btn`}
                        >
                            Data Insiden{" "}
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => {
                                openExportDialogIKPDataEvaluasi();
                                closeSidebar();
                            }}
                            className={`${getSubNavClasses(false)} flex justify-between items-center group/btn`}
                        >
                            Data Evaluasi{" "}
                            <ArrowDownTrayIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                    </AccordionItem>
                    <AccordionItem
                        id="data-mutu"
                        active={
                            routeName.startsWith("Mutu") &&
                            !routeName.startsWith("MutuKategori")
                        }
                        title="Data Mutu"
                        icon={BeakerIcon}
                    >
                        <Link
                            href={route("MutuIndikator.index")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("MutuIndikator.index"),
                            )}
                        >
                            Indikator Mutu
                        </Link>
                        <Link
                            href={route("MutuUnit.index")}
                            onClick={closeSidebar}
                            className={getSubNavClasses(
                                isActive("MutuUnit.index"),
                            )}
                        >
                            Mutu Unit
                        </Link>
                    </AccordionItem>
                </div>
            </div>

            {/* SECTION: MASTER DATA */}
            {(canSeeRiskMaster ||
                canSeeValueMaster ||
                canSeeIkpMaster ||
                canSeeMutuMaster ||
                canSeeAccessMaster) && (
                <div>
                    <SectionLabel title="Pengaturan Master" />
                    <div className="space-y-1.5">
                        <AccordionItem
                            id="data-master"
                            active={isMasterRoute}
                            title="Data Master"
                            icon={CircleStackIcon}
                        >
                            {canSeeRiskMaster && (
                                <div className="mb-4">
                                    <SubSectionLabel title="Master Risiko" />
                                    <Link
                                        href={route("opsiPengendalians.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "opsiPengendalians",
                                            ),
                                        )}
                                    >
                                        Opsi Pengendalian
                                    </Link>
                                    <Link
                                        href={route("riskCategories.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "riskCategories",
                                            ),
                                        )}
                                    >
                                        Kategori Risiko
                                    </Link>
                                    <Link
                                        href={route(
                                            "identificationSources.index",
                                        )}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "identificationSources",
                                            ),
                                        )}
                                    >
                                        Sumber Identifikasi
                                    </Link>
                                    <Link
                                        href={route("locations.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("locations"),
                                        )}
                                    >
                                        Lokasi Insiden
                                    </Link>
                                    <Link
                                        href={route("riskVarieties.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "riskVarieties",
                                            ),
                                        )}
                                    >
                                        Jenis Insiden
                                    </Link>
                                    <Link
                                        href={route("riskTypes.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("riskTypes"),
                                        )}
                                    >
                                        Tipe Insiden
                                    </Link>
                                    <Link
                                        href={route("pics.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("pics"),
                                        )}
                                    >
                                        PIC / Penangung Jawab
                                    </Link>
                                    <Link
                                        href={route("jenisSebabs.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("jenisSebabs"),
                                        )}
                                    >
                                        Jenis Sebab
                                    </Link>
                                </div>
                            )}

                            {canSeeValueMaster && (
                                <div className="pt-1 mb-4">
                                    <SubSectionLabel title="Master Nilai" />
                                    <Link
                                        href={route("impactValues.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "impactValues",
                                            ),
                                        )}
                                    >
                                        Bobot Dampak
                                    </Link>
                                    <Link
                                        href={route("probabilityValues.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "probabilityValues",
                                            ),
                                        )}
                                    >
                                        Bobot Probabilitas
                                    </Link>
                                    <Link
                                        href={route("controlValues.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "controlValues",
                                            ),
                                        )}
                                    >
                                        Bobot Control
                                    </Link>
                                </div>
                            )}

                            {canSeeIkpMaster && (
                                <div className="pt-1 mb-4">
                                    <SubSectionLabel title="Master IKP" />
                                    <Link
                                        href={route("IkpJenisInsidens.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpJenisInsidens",
                                            ),
                                        )}
                                    >
                                        Jenis Insiden
                                    </Link>
                                    <Link
                                        href={route("IkpTipeInsiden.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpTipeInsiden",
                                            ),
                                        )}
                                    >
                                        Tipe Insiden
                                    </Link>
                                    <Link
                                        href={route("IkpSpesialisasi.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpSpesialisasi",
                                            ),
                                        )}
                                    >
                                        Spesialisasi
                                    </Link>
                                    <Link
                                        href={route("IkpDampak.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("IkpDampak"),
                                        )}
                                    >
                                        Dampak
                                    </Link>
                                    <Link
                                        href={route("IkpProbabilitas.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpProbabilitas",
                                            ),
                                        )}
                                    >
                                        Probabilitas
                                    </Link>
                                    <Link
                                        href={route("IkpPelapor.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("IkpPelapor"),
                                        )}
                                    >
                                        Pelapor Insiden
                                    </Link>
                                    <Link
                                        href={route("IkpGrupLayanan.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpGrupLayanan",
                                            ),
                                        )}
                                    >
                                        Grup Layanan
                                    </Link>
                                    <Link
                                        href={route("IkpPenanggung.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "IkpPenanggung",
                                            ),
                                        )}
                                    >
                                        Penanggung Biaya
                                    </Link>
                                    <Link
                                        href={route("IkpLokasi.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("IkpLokasi"),
                                        )}
                                    >
                                        Lokasi Kejadian
                                    </Link>
                                    <Link
                                        href={route("IkpPenindak.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith("IkpPenindak"),
                                        )}
                                    >
                                        Tindak Lanjut
                                    </Link>
                                </div>
                            )}

                            {canSeeMutuMaster && (
                                <div className="pt-1">
                                    <SubSectionLabel title="Master Mutu" />
                                    <Link
                                        href={route("MutuKategori.index")}
                                        onClick={closeSidebar}
                                        className={getSubNavClasses(
                                            routeName.startsWith(
                                                "MutuKategori",
                                            ),
                                        )}
                                    >
                                        Kategori Mutu
                                    </Link>
                                </div>
                            )}
                        </AccordionItem>

                        {canSeeAccessMaster && (
                            <AccordionItem
                                id="akses-sistem"
                                active={
                                    routeName.startsWith("users") ||
                                    routeName.startsWith("roles") ||
                                    routeName.startsWith("permissions")
                                }
                                title="Akses Sistem"
                                icon={UserCircleIcon}
                            >
                                <Link
                                    href={route("users.index")}
                                    onClick={closeSidebar}
                                    className={getSubNavClasses(
                                        routeName.startsWith("users"),
                                    )}
                                >
                                    Daftar Pengguna
                                </Link>
                                <Link
                                    href={route("roles.index")}
                                    onClick={closeSidebar}
                                    className={getSubNavClasses(
                                        routeName.startsWith("roles"),
                                    )}
                                >
                                    Peran (Roles)
                                </Link>
                                <Link
                                    href={route("permissions.index")}
                                    onClick={closeSidebar}
                                    className={getSubNavClasses(
                                        routeName.startsWith("permissions"),
                                    )}
                                >
                                    Hak Akses
                                </Link>
                            </AccordionItem>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="col-span-12 col-start-1 py-2 antialiased transition-colors duration-200 lg:pr-2 lg:pb-2 lg:pt-2 lg:col-span-2 lg:block">
            <>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogLarsDHPKlinis}
                    setIsOpenExportDialog={setIsOpenExportDialogLarsDHPKlinis}
                    size="max-w-4xl"
                    title={`Export LARS DHP Klinis - ` + auth.user.name}
                >
                    <LarsDHPKlinis
                        setIsOpenAddDialog={setIsOpenExportDialogLarsDHPKlinis}
                    />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogLarsDHPNonKlinis}
                    setIsOpenExportDialog={
                        setIsOpenExportDialogLarsDHPNonKlinis
                    }
                    size="max-w-4xl"
                    title={`Export LARS DHP Non Klinis - ` + auth.user.name}
                >
                    <LarsDHPNonKlinis
                        setIsOpenAddDialog={
                            setIsOpenExportDialogLarsDHPNonKlinis
                        }
                    />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogBPKP}
                    setIsOpenExportDialog={setIsOpenExportDialogBPKP}
                    size="max-w-4xl"
                    title={`Export BPKP Risk Register - ` + auth.user.name}
                >
                    <BPKP setIsOpenAddDialog={setIsOpenExportDialogBPKP} />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogSedangTerjadi}
                    setIsOpenExportDialog={setIsOpenExportDialogSedangTerjadi}
                    size="max-w-4xl"
                    title={`Export Sedang Terjadi - ` + auth.user.name}
                >
                    <SedangTerjadi
                        setIsOpenAddDialog={setIsOpenExportDialogSedangTerjadi}
                    />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogIKPDataInsiden}
                    setIsOpenExportDialog={setIsOpenExportDialogIKPDataInsiden}
                    size="max-w-4xl"
                    title={`Export IKP Data Insiden - ` + auth.user.name}
                >
                    <IKPDataInsiden
                        setIsOpenAddDialog={setIsOpenExportDialogIKPDataInsiden}
                    />
                </ExportModal>
                <ExportModal
                    isOpenExportDialog={isOpenExportDialogIKPDataEvaluasi}
                    setIsOpenExportDialog={setIsOpenExportDialogIKPDataEvaluasi}
                    size="max-w-4xl"
                    title={`Export IKP Data Evaluasi - ` + auth.user.name}
                >
                    <IKPDataEvaluasi
                        setIsOpenAddDialog={
                            setIsOpenExportDialogIKPDataEvaluasi
                        }
                    />
                </ExportModal>
            </>

            {/* MOBILE DRAWER */}
            <Transition.Root show={!!isMobileMenuOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[100] lg:hidden"
                    onClose={closeSidebar}
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
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex flex-col w-full h-full max-w-[300px] bg-white dark:bg-[#0f172a] shadow-2xl">
                                <div className="flex items-center justify-between h-16 px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                                    <ApplicationLogo className="block w-auto h-7 text-sky-600 dark:text-white" />
                                    <button
                                        type="button"
                                        className="p-2 -mr-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white bg-slate-50 dark:bg-slate-800"
                                        onClick={closeSidebar}
                                    >
                                        <XMarkIcon
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                <div className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
                                    <NavigationContent />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* DESKTOP SIDEBAR PANEL */}
            <div
                className="hidden lg:flex flex-col w-full h-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden sticky top-2"
                style={{ maxHeight: "calc(100vh - 1rem)" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0 h-[4.5rem]">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ApplicationLogo className="block w-auto h-8 transition-transform text-sky-600 dark:text-white group-hover:scale-105" />
                        <span className="font-black tracking-wide text-slate-800 dark:text-white">
                            SIM
                            <span className="text-sky-600 dark:text-sky-400">
                                RS
                            </span>
                        </span>
                    </Link>
                </div>

                <div className="flex-col flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
                    <NavigationContent />
                </div>
            </div>
        </div>
    );
}
