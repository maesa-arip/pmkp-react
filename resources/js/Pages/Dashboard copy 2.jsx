import App from "@/Layouts/App";
import { Head, usePage, Link } from "@inertiajs/react";
import React from "react";
import { 
    ExclamationTriangleIcon, 
    DocumentChartBarIcon, 
    ShieldExclamationIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    PlusCircleIcon,
    ArrowDownTrayIcon,
    ArrowRightIcon,
    ChatBubbleLeftEllipsisIcon,
    CheckBadgeIcon,
    DocumentTextIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/outline";

// Import Recharts untuk Visualisasi Data
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard(props) {
    const { auth, notifications, updatestatus } = usePage().props;

    // --- MOCK DATA (Ganti dengan props dari Backend nantinya) ---
    const trendData = [
        { name: 'Des', klinis: 2, nonKlinis: 1 },
        { name: 'Jan', klinis: 4, nonKlinis: 2 },
        { name: 'Feb', klinis: 7, nonKlinis: 3 },
        { name: 'Mar', klinis: 3, nonKlinis: 2 },
        { name: 'Apr', klinis: 5, nonKlinis: 4 },
        { name: 'Mei', klinis: 8, nonKlinis: 3 },
    ];

    const rcaData = [
        { name: 'Selesai RCA', value: 45, color: '#10b981' }, // emerald-500
        { name: 'Proses Analisis', value: 20, color: '#f59e0b' }, // amber-500
        { name: 'Overdue (Terlambat)', value: 8, color: '#e11d48' }, // rose-600
    ];

    const activities = [
        { id: 1, user: 'dr. Andi S.', action: 'Melaporkan insiden pasien jatuh di Ruang Rawat Inap', time: '2 jam yang lalu', type: 'danger', icon: <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" /> },
        { id: 2, user: 'Suster Rina', action: 'Memperbarui status perbaikan pada insiden IGD', time: '5 jam yang lalu', type: 'info', icon: <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-sky-500" /> },
        { id: 3, user: 'Budi (Teknisi)', action: 'Melaporkan kerusakan panel listrik utama', time: '1 hari yang lalu', type: 'warning', icon: <ShieldExclamationIcon className="w-4 h-4 text-amber-500" /> },
        { id: 4, user: 'Admin Risiko', action: 'Memverifikasi dan memberikan grading risiko', time: '1 hari yang lalu', type: 'success', icon: <CheckBadgeIcon className="w-4 h-4 text-emerald-500" /> },
        { id: 5, user: 'dr. Sarah', action: 'Mengunggah dokumen investigasi RCA', time: '2 hari yang lalu', type: 'document', icon: <DocumentTextIcon className="w-4 h-4 text-indigo-500" /> },
    ];

    // Data Matriks 5x5 (Probabilitas x Dampak)
    const heatmapMatrix = [
        [5, 10, 15, 20, 25], // Probabilitas 5
        [4,  8, 12, 16, 20], // Probabilitas 4
        [3,  6,  9, 12, 15], // Probabilitas 3
        [2,  4,  6,  8, 10], // Probabilitas 2
        [1,  2,  3,  4,  5]  // Probabilitas 1
    ];

    // Fungsi warna untuk cell Heatmap berdasarkan skor
    const getHeatmapColor = (score) => {
        if (score <= 3) return "bg-emerald-400 dark:bg-emerald-500 text-white"; // Rendah
        if (score <= 6) return "bg-amber-400 dark:bg-amber-500 text-white"; // Sedang
        if (score <= 12) return "bg-orange-500 dark:bg-orange-600 text-white"; // Tinggi
        return "bg-rose-600 dark:bg-rose-700 text-white"; // Ekstrim
    };

    // Fungsi untuk mensimulasikan jumlah insiden di tiap kotak matriks (Ganti dengan data asli)
    const getDummyIncidentCount = (score) => {
        if (score === 8) return 3;
        if (score === 12) return 1;
        if (score === 3) return 5;
        if (score === 20) return 2;
        return "";
    };
    // -----------------------------------------------------------

    const getColorClass = (color) => {
        const colors = {
            sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border-sky-200 dark:border-sky-500/20",
            emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
            destructive: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
            slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
        };
        return colors[color] || colors.slate;
    };

    const kpiStats = [
        { title: "Total Risiko", value: (props.riskRegisterKlinis || 0) + (props.riskRegisterNonKlinis || 0), color: "slate", icon: <DocumentChartBarIcon className="w-5 h-5" />, link: route('riskRegisterKlinis.index') },
        { title: "Risiko Klinis", value: props.riskRegisterKlinis || 0, color: "sky", icon: <ShieldExclamationIcon className="w-5 h-5" />, link: route('riskRegisterKlinis.index') },
        { title: "Non Klinis", value: props.riskRegisterNonKlinis || 0, color: "sky", icon: <UserGroupIcon className="w-5 h-5" />, link: route('riskRegisterNonKlinis.index') },
        { title: "Sedang Terjadi", value: notifications || 0, color: "destructive", icon: <ExclamationTriangleIcon className="w-5 h-5" />, link: "#" },
        { title: "Req Perubahan", value: updatestatus || 0, color: "sky", icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />, link: route('requeststatus') },
        { title: "Butuh RCA", value: props.priorityRisk || 0, color: "destructive", icon: <ExclamationTriangleIcon className="w-5 h-5" />, link: route('rca.risikoprioritas') },
        { title: "Verif. Manajemen", value: props.occuringManagement || 0, color: "slate", icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />, link: route('riskregister.verificationmanagementoccurring') },
        { title: "Verif. Admin", value: props.occuringAdmin || 0, color: "slate", icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />, link: route('riskregister.verificationadminoccurring') },
    ];

    // Komponen Custom Tooltip untuk Recharts (Agar sesuai tema)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-white border shadow-lg dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 rounded-xl">
                    <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                    {payload.map((pld, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }}></div>
                            <span className="capitalize">{pld.name}:</span>
                            <span className="font-bold">{pld.value} Insiden</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Dashboard Manajemen Risiko" />

            <div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
                
                {/* --- HEADER --- */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600"></div>
                    <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                                Beranda Dashboard
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Ringkasan metrik dan status pengawasan risiko operasional hari ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 text-sm font-bold border shadow-sm text-sky-700 bg-sky-50 border-sky-200 rounded-xl dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20">
                                Halo, {auth.user.name} 👋
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KPI CARDS --- */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiStats.map((stat, index) => (
                        <Link 
                            key={index} 
                            href={stat.link}
                            className="group flex flex-col bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-sm font-bold tracking-tight transition-colors text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                                    {stat.title}
                                </span>
                                <div className={`p-2 rounded-xl border ${getColorClass(stat.color)} shadow-sm transition-transform group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-50">
                                    {stat.value}
                                </h3>
                                <ArrowRightIcon className="w-4 h-4 transition-colors -translate-x-2 opacity-0 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 dark:group-hover:text-sky-400 group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* --- ROW 2: CHARTS --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* AREA CHART: Tren Insiden (Span 8) */}
                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-8 dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Tren Insiden (6 Bulan Terakhir)</h2>
                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Perbandingan frekuensi pelaporan insiden Klinis vs Non-Klinis.</p>
                        </div>
                        <div className="flex-1 p-6 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorKlinis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorNonKlinis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="klinis" name="Klinis" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorKlinis)" />
                                    <Area type="monotone" dataKey="nonKlinis" name="Non Klinis" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNonKlinis)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* PIE CHART: Status RCA (Span 4) */}
                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-4 dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Kepatuhan RCA</h2>
                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Status penyelesaian investigasi akar masalah.</p>
                        </div>
                        <div className="relative flex flex-col items-center justify-center flex-1 p-6">
                            <div className="w-full h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={rcaData} innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                            {rcaData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Keterangan Legend Custom */}
                            <div className="flex flex-col w-full gap-2 mt-4">
                                {rcaData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ROW 3: HEATMAP & AUDIT TRAIL --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* RISK HEATMAP (Span 6) */}
                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-6 dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Matriks Risiko (Heatmap)</h2>
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Sebaran insiden aktif berdasarkan Probabilitas & Dampak.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center flex-1 p-6">
                            <div className="flex">
                                {/* Label Y-Axis (Probabilitas) */}
                                <div className="flex items-center justify-center w-8 -rotate-90">
                                    <span className="text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">Probabilitas</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {/* Grid Matrix */}
                                    <div className="grid grid-cols-5 gap-1">
                                        {heatmapMatrix.map((row, rowIndex) => (
                                            row.map((score, colIndex) => {
                                                const count = getDummyIncidentCount(score);
                                                return (
                                                    <div 
                                                        key={`${rowIndex}-${colIndex}`} 
                                                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg shadow-sm transition-transform hover:scale-105 cursor-pointer ${getHeatmapColor(score)}`}
                                                        title={`Skor: ${score}`}
                                                    >
                                                        {count && (
                                                            <span className="flex items-center justify-center w-6 h-6 text-xs font-black bg-white rounded-full shadow-md text-slate-900 sm:w-8 sm:h-8 sm:text-sm">
                                                                {count}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        ))}
                                    </div>
                                    {/* Label X-Axis (Dampak) */}
                                    <div className="mt-3 text-center">
                                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Dampak</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITY LOG & QUICK ACTIONS (Span 6) */}
                    <div className="flex flex-col gap-6 lg:col-span-6">
                        
                        {/* Audit Trail / Log Aktivitas */}
                        <div className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                            <div className="px-6 py-5 border-b bg-slate-50/50 dark:bg-transparent border-slate-100 dark:border-slate-800/80">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Aktivitas Terbaru</h3>
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Log operasional sistem secara real-time.</p>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[300px] custom-scrollbar">
                                <div className="space-y-6">
                                    {activities.map((act) => (
                                        <div key={act.id} className="flex gap-4">
                                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                                                act.type === 'danger' ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20' :
                                                act.type === 'info' ? 'bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20' :
                                                act.type === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' :
                                                act.type === 'success' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                                                'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                                            }`}>
                                                {act.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    <span className="font-bold text-slate-900 dark:text-white">{act.user}</span> {act.action}
                                                </p>
                                                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-500">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions (Dipindah ke bawah Log agar lebih compact) */}
                        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                            <h2 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">Aksi Cepat</h2>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('riskRegisterKlinis.index')} className="inline-flex items-center px-4 py-2.5 text-sm font-bold text-white transition-all rounded-xl shadow-sm bg-sky-600 hover:bg-sky-700 hover:shadow active:scale-95 flex-1 justify-center sm:flex-none">
                                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Reg. Klinis
                                </Link>
                                <Link href={route('riskRegisterNonKlinis.index')} className="inline-flex items-center px-4 py-2.5 text-sm font-bold transition-all bg-white border rounded-xl shadow-sm text-slate-700 dark:text-slate-200 dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow active:scale-95 flex-1 justify-center sm:flex-none">
                                    <PlusCircleIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> Reg. Non-Klinis
                                </Link>
                                <button className="inline-flex items-center px-4 py-2.5 text-sm font-bold transition-all bg-white border rounded-xl shadow-sm text-slate-700 dark:text-slate-200 dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow active:scale-95 flex-1 justify-center sm:flex-none">
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> Export Laporan
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>
        </div>
    );
}

Dashboard.layout = (page) => <App children={page} />;