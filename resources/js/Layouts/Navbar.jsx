import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
    ChevronDownIcon, 
    Bars3Icon, 
    UserCircleIcon, 
    ArrowRightOnRectangleIcon,
    BellIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    SunIcon,
    MoonIcon,
    XMarkIcon,
    DocumentTextIcon,
    ShieldExclamationIcon,
    FolderOpenIcon,DocumentPlusIcon, 
    ShieldCheckIcon, 
    ExclamationTriangleIcon, 
    WrenchScrewdriverIcon, 
    ClipboardDocumentCheckIcon, 
    CheckBadgeIcon
} from "@heroicons/react/24/outline";

export default function Navbar({ setIsMobileMenuOpen }) {
    const { auth, notifications } = usePage().props;
    
    // -----------------------------------------------------------
    // 1. STATE & FUNGSI: WAKTU
    // -----------------------------------------------------------
    const [date, setDate] = useState("");
    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDate(new Date().toLocaleDateString('id-ID', options));
    }, []);

    // -----------------------------------------------------------
    // 2. STATE & FUNGSI: DARK/LIGHT MODE
    // -----------------------------------------------------------
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // -----------------------------------------------------------
    // 3. STATE & FUNGSI: SEARCH MODAL (CMD/CTRL + K)
    // -----------------------------------------------------------
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Shortcut Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Data Simulasi Pencarian (Bisa disesuaikan dengan route Anda)
    const searchLinks = [
        { name: 'Register Risiko Klinis', href: route('riskRegisterKlinis.index'), icon: FolderOpenIcon, category: 'Manajemen Risiko' },
        { name: 'Register Risiko Non-Klinis', href: route('riskRegisterNonKlinis.index'), icon: FolderOpenIcon, category: 'Manajemen Risiko' },
        { name: 'Laporan Insiden (IKP)', href: route('IkpPasien.index'), icon: DocumentTextIcon, category: 'Keselamatan Pasien' },
        { name: 'Risiko Sedang Terjadi', href: route('rca.sedangterjadi'), icon: ShieldExclamationIcon, category: 'Investigasi / RCA' },
    ];

    const filteredSearch = searchLinks.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // -----------------------------------------------------------
    // 4. STATE & FUNGSI: HELP MODAL
    // -----------------------------------------------------------
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    return (
        <>
            <nav className="relative z-40 w-full bg-white rounded-t-xl dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
                <div className="px-3 mx-auto sm:px-5 lg:px-6">
                    <div className="flex items-center justify-between h-16 gap-4 sm:h-20">
                        
                        {/* --- KIRI: Hamburger & Judul --- */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 -ml-2 transition-colors rounded-xl lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>

                            <div className="hidden lg:block">
                                <span className="text-lg font-black tracking-wide text-slate-800 dark:text-white">
                                    SIM<span className="text-sky-600 dark:text-sky-400">DALIN</span>
                                </span>
                            </div>
                        </div>

                        {/* --- TENGAH: Tombol Search Pemicu Modal --- */}
                        <div className="items-center flex-1 hidden max-w-2xl px-2 md:flex lg:px-8">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="relative flex items-center w-full group focus:outline-none"
                            >
                                <MagnifyingGlassIcon className="absolute left-3.5 h-5 w-5 text-slate-400 group-hover:text-sky-500 transition-colors z-10" />
                                <div className="w-full pl-11 pr-16 py-2.5 text-[13px] font-medium text-left bg-slate-100/70 dark:bg-slate-900/50 border border-transparent rounded-xl group-hover:bg-white dark:group-hover:bg-[#0f172a] group-hover:border-sky-300 dark:group-hover:border-sky-500/50 group-hover:ring-4 group-hover:ring-sky-500/10 text-slate-500 dark:text-slate-400 transition-all shadow-inner group-hover:shadow-md cursor-text">
                                    Pencarian cepat (Data, Menu, Laporan)...
                                </div>
                                <div className="absolute z-10 items-center hidden gap-1 right-3 lg:flex">
                                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">Ctrl</kbd>
                                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">K</kbd>
                                </div>
                            </button>
                        </div>

                        {/* --- KANAN: Utilities, Notifikasi & Profil --- */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            
                            {/* Tombol Pusat Bantuan */}
                            <button 
                                onClick={() => setIsHelpOpen(true)}
                                className="hidden sm:block p-2.5 transition-colors rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50" 
                                title="Pusat Bantuan & Panduan"
                            >
                                <QuestionMarkCircleIcon className="w-[22px] h-[22px]" />
                            </button>

                            {/* Tombol Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="hidden sm:block p-2.5 transition-colors rounded-full text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50" 
                                title="Ganti Tema"
                            >
                                {theme === 'dark' ? <SunIcon className="w-[22px] h-[22px]" /> : <MoonIcon className="w-[22px] h-[22px]" />}
                            </button>
                            
                            {/* Notifikasi Bell */}
                            <Link href={route("notifications")} className="relative p-2.5 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                                <BellIcon className="w-[22px] h-[22px]" />
                                {notifications > 0 && (
                                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-rose-400 animate-ping"></span>
                                        <span className="relative inline-flex rounded-full bg-rose-500 border-2 border-white dark:border-[#0f172a] h-2.5 w-2.5"></span>
                                    </span>
                                )}
                            </Link>

                            <div className="w-px h-8 mx-1 sm:mx-2 bg-slate-200 dark:bg-slate-700/80"></div>

                            {/* Profil Dropdown */}
                            <div className="relative z-50">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button" className="inline-flex items-center p-1 sm:pr-3 sm:py-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-transparent border border-transparent rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-200 group">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 sm:mr-2.5 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-500/20 dark:to-blue-600/20 border border-sky-200 dark:border-sky-500/30 rounded-full flex items-center justify-center text-sky-700 dark:text-sky-400 text-xs sm:text-sm uppercase font-black shrink-0 transition-colors group-hover:border-sky-300 dark:group-hover:border-sky-400 shadow-sm">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                            <div className="hidden text-left sm:block">
                                                <p className="text-[13px] font-bold leading-tight text-slate-700 dark:text-slate-200 truncate max-w-[130px]">{auth.user.name}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 truncate max-w-[130px]">Administrator</p>
                                            </div>
                                            <ChevronDownIcon className="hidden w-4 h-4 ml-2 transition-transform duration-200 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 sm:block" />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="56">
                                        <div className="px-4 py-3 border-b sm:hidden border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#09090b]/50">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Masuk sebagai</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">{auth.user.email}</p>
                                        </div>
                                        {/* Menu Mobile Tambahan (Theme & Help) ditaruh di dropdown jika layar kecil */}
                                        <div className="border-b sm:hidden border-slate-100 dark:border-slate-700/80">
                                            <button onClick={toggleTheme} className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                                {theme === 'dark' ? <SunIcon className="w-4 h-4 mr-2.5 opacity-70" /> : <MoonIcon className="w-4 h-4 mr-2.5 opacity-70" />}
                                                Ganti Tema ({theme === 'dark' ? 'Terang' : 'Gelap'})
                                            </button>
                                            <button onClick={() => setIsHelpOpen(true)} className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <QuestionMarkCircleIcon className="w-4 h-4 mr-2.5 opacity-70" /> Pusat Bantuan
                                            </button>
                                        </div>
                                        <Dropdown.Link href={route("profile.edit")}>
                                            <div className="flex items-center font-medium">
                                                <UserCircleIcon className="w-4 h-4 mr-2.5 opacity-70 text-slate-400" /> Pengaturan Profil
                                            </div>
                                        </Dropdown.Link>
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800/80"></div>
                                        <Dropdown.Link href={route("logout")} method="post" as="button" className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:bg-rose-50 dark:focus:bg-rose-500/10">
                                            <div className="flex items-center font-bold">
                                                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2.5 opacity-70" /> Keluar Sistem
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                        </div>
                    </div>
                </div>
            </nav>

            {/* ============================================================== */}
            {/* MODAL COMMAND PALETTE (PENCARIAN) */}
            {/* ============================================================== */}
            <Transition.Root show={isSearchOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={setIsSearchOpen}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                                {/* Input Search */}
                                <div className="relative">
                                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                                    <input
                                        type="text"
                                        className="w-full h-12 pr-4 bg-transparent border-0 outline-none pl-11 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                                        placeholder="Ketik untuk mencari menu atau laporan..."
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}
                                        autoFocus
                                    />
                                    {/* Tombol Tutup/Esc */}
                                    <div className="absolute items-center hidden gap-1 right-3 top-3 lg:flex">
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">ESC</kbd>
                                    </div>
                                </div>

                                {/* Hasil Pencarian */}
                                {filteredSearch.length > 0 && (
                                    <ul className="p-2 overflow-y-auto text-sm max-h-72 scroll-py-2 custom-scrollbar text-slate-700 dark:text-slate-300">
                                        {filteredSearch.map((item, index) => (
                                            <li key={index}>
                                                <Link 
                                                    href={item.href} 
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="flex items-center px-3 py-3 transition-colors cursor-pointer select-none rounded-xl hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-400 group"
                                                >
                                                    <item.icon className="flex-none w-5 h-5 transition-colors text-slate-400 group-hover:text-sky-500" aria-hidden="true" />
                                                    <div className="flex-auto ml-4">
                                                        <p className="font-bold">{item.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{item.category}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {searchQuery !== '' && filteredSearch.length === 0 && (
                                    <div className="px-6 text-sm text-center py-14 sm:px-14">
                                        <ShieldExclamationIcon className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500" aria-hidden="true" />
                                        <p className="mt-4 font-semibold text-slate-900 dark:text-white">Data tidak ditemukan</p>
                                        <p className="mt-1 text-slate-500">Kami tidak dapat menemukan apa pun dengan kata kunci tersebut. Silakan coba kata kunci lain.</p>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* ============================================================== */}
            {/* MODAL PUSAT BANTUAN */}
            {/* ============================================================== */}
            <Transition.Root show={isHelpOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={setIsHelpOpen}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 transition-opacity bg-slate-950/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                    
                                    <div className="px-6 pt-6 pb-4 sm:p-8 sm:pb-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                        <div className="sm:flex sm:items-start">
                                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-sky-100 dark:bg-sky-500/20 sm:mx-0 sm:h-10 sm:w-10">
                                                <QuestionMarkCircleIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                                            </div>
                                            <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-lg font-black leading-6 text-slate-900 dark:text-white">
                                                    Pusat Bantuan SIMDALIN
                                                </Dialog.Title>
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                                        Jika Anda mengalami kendala saat melaporkan Insiden Keselamatan Pasien (IKP) atau membutuhkan akses tambahan, silakan hubungi tim IT atau Komite Mutu melalui kontak di bawah ini.
                                                    </p>
                                                    
                                                    <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700">
                                                        <h4 className="mb-2 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">Kontak Dukungan</h4>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unit IT: <span className="text-sky-600 dark:text-sky-400">Ext. 130</span></p>
                                                        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Komite Mutu: <span className="text-sky-600 dark:text-sky-400">Ext. 456</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DIVIDER: Garis Pemisah antara Pusat Bantuan umum dan Alur Risiko */}
                                        <div className="w-full h-px my-8 bg-slate-200 dark:bg-slate-700/80"></div>

                                        {/* SECTION: Alur Manajemen Risiko & Mutu */}
                                        <section className="ml-1 sm:ml-14">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Alur Pelaporan & Penyelesaian</h3>
                                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    Panduan urutan proses pelaporan indikator mutu hingga penyelesaian insiden risiko (Risk Register).
                                                </p>
                                            </div>

                                            {/* TIMELINE CONTAINER */}
                                            <div className="relative pb-4 pl-4 ml-3 space-y-8 border-l-2 border-slate-200 dark:border-slate-700/80">
                                                
                                                {/* Step 1 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-200 dark:border-slate-700 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <DocumentPlusIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">1. Pengajuan Indikator Mutu</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            Unit kerja menginput rancangan Indikator Mutu terlebih dahulu. Data akan berstatus <span className="font-bold text-amber-600 dark:text-amber-400">Menunggu Persetujuan</span>.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Step 2 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">2. Verifikasi Komite Mutu</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            Setelah di-<strong>Approve</strong> oleh Komite Mutu, indikator akan aktif dan bisa ditarik masuk sebagai referensi di dalam form <strong>Risk Register</strong>.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Step 3 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/30 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">3. Input Risiko (Sedang Terjadi)</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            Jika pelapor menginput risiko dengan status <span className="font-bold text-rose-600 dark:text-rose-400">"Sedang Terjadi"</span>, sistem otomatis mengirimkan tiket ke <strong>Notifikasi PIC Unit Terkait</strong>.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Step 4 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <WrenchScrewdriverIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">4. Tindak Lanjut oleh PIC</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            PIC Unit Terkait membuka notifikasinya, lalu menginput <strong>Tanggal Perbaikan</strong> beserta <strong>Upaya Perbaikan</strong> yang telah dilakukan.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Step 5 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-500/10 border-2 border-sky-200 dark:border-sky-500/30 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">5. Verifikasi Balik oleh Pelapor</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            Upaya perbaikan dari PIC akan muncul di menu <strong>Update Status Request</strong> milik Pelapor. Jika sesuai, Pelapor mengubah status insiden menjadi <span className="font-bold text-emerald-600 dark:text-emerald-400">"Tidak Sedang Terjadi"</span> (masuk History).
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Step 6 */}
                                                <div className="relative">
                                                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-500/10 border-2 border-teal-200 dark:border-teal-500/30 -left-[33px] top-1 ring-4 ring-white dark:ring-[#0f172a]">
                                                        <CheckBadgeIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                                    </div>
                                                    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors ml-4">
                                                        <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">6. Validasi Admin & Manajemen</h4>
                                                        <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                                                            Tahap akhir, Admin Risiko dan Manajemen akan melakukan verifikasi penutupan <em>case</em> secara keseluruhan pada laporan insiden yang telah diselesaikan.
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </section>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-[#1e293b]/50 border-t border-slate-100 dark:border-slate-800/80 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                            onClick={() => setIsHelpOpen(false)}
                                        >
                                            Mengerti & Tutup
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
