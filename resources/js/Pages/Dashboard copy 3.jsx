import App from "@/Layouts/App";
import { Head, usePage, Link } from "@inertiajs/react";
import React from "react";
import { 
    ExclamationTriangleIcon, 
    DocumentChartBarIcon, 
    ShieldExclamationIcon,
    PlusCircleIcon,
    ArrowDownTrayIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckBadgeIcon,
    ShieldCheckIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

// Import Recharts
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard(props) {
    const { auth, notifications, updatestatus } = usePage().props;

    // --- DATA DUMMY (Ganti dengan props asli nantinya) ---
    const trendData = props.trendData || [
        { name: 'Des', ikp: 2, risiko: 5 }, { name: 'Jan', ikp: 4, risiko: 7 },
        { name: 'Feb', ikp: 1, risiko: 3 }, { name: 'Mar', ikp: 5, risiko: 8 },
        { name: 'Apr', ikp: 2, risiko: 4 }, { name: 'Mei', ikp: 3, risiko: 6 },
    ];

    const ikpTipeData = props.ikpTipeData || [
        { name: 'KTD', value: 12, color: '#e11d48' },
        { name: 'KNC', value: 25, color: '#f59e0b' },
        { name: 'KTC', value: 10, color: '#3b82f6' },
        { name: 'Sentinel', value: 2, color: '#334155' },
    ];

    const heatmapCounts = props.heatmapCounts || { '0-4': 2, '1-3': 4, '2-2': 8, '3-1': 15, '4-0': 5 };

    const heatmapMatrix = [
        [5, 10, 15, 20, 25], [4,  8, 12, 16, 20], [3,  6,  9, 12, 15], [2,  4,  6,  8, 10], [1,  2,  3,  4,  5]
    ];

    const getHeatmapColor = (score) => {
        if (score <= 3) return "bg-emerald-500 text-white"; 
        if (score <= 6) return "bg-amber-500 text-white"; 
        if (score <= 12) return "bg-orange-500 text-white"; 
        return "bg-rose-600 text-white"; 
    };

    const recentActivities = (props.recentActivities || [
        { id: 1, event: 'created', log_name: 'IKP', desc: 'Melaporkan insiden jatuh', time: '10 mnt lalu', user: 'dr. Andi' },
        { id: 2, event: 'updated', log_name: 'Risiko', desc: 'Update pernyataan risiko', time: '1 jam lalu', user: 'Kepala IGD' },
        { id: 3, event: 'verified', log_name: 'RCA', desc: 'Verifikasi investigasi', time: '3 jam lalu', user: 'Admin Risiko' },
        { id: 4, event: 'deleted', log_name: 'Mutu', desc: 'Hapus data opsi', time: '1 hr lalu', user: 'Super Admin' },
        { id: 5, event: 'created', log_name: 'Risiko', desc: 'Tambah risiko IPSRS', time: '2 hr lalu', user: 'Teknisi' },
    ]).slice(0, 5); 

    const renderActivityIcon = (event) => {
        switch(event) {
            case 'created': return { icon: <PlusCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" };
            case 'updated': return { icon: <PencilSquareIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />, bg: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20" };
            case 'deleted': return { icon: <TrashIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />, bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" };
            case 'verified': return { icon: <CheckBadgeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20" };
            default: return { icon: <DocumentTextIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />, bg: "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" };
        }
    };

    const kpiStats = [
        { title: "Total Insiden (IKP)", value: props.totalIkp || 49, color: "sky", icon: <ShieldExclamationIcon className="w-5 h-5" />, link: route('IkpPasien.index') },
        { title: "Total Daftar Risiko", value: (props.riskRegisterKlinis || 34) + (props.riskRegisterNonKlinis || 12), color: "slate", icon: <DocumentChartBarIcon className="w-5 h-5" />, link: route('riskRegisterKlinis.index') },
        { title: "Insiden Aktif", value: notifications || 3, color: "destructive", icon: <ExclamationTriangleIcon className="w-5 h-5" />, link: route('rca.sedangterjadi') },
        { title: "Risiko Prioritas (RCA)", value: props.priorityRisk || 5, color: "destructive", icon: <ShieldCheckIcon className="w-5 h-5" />, link: route('rca.risikoprioritas') },
    ];

    return (
        <div className="relative min-h-screen p-0 font-sans bg-transparent dark:bg-transparent text-slate-900 dark:text-slate-100 sm:p-2">
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 mx-auto max-w-[1600px]">
                
               

                {/* --- 4 KPI CARDS --- */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiStats.map((stat, index) => (
                        <Link key={index} href={stat.link} className="flex flex-col bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 hover:border-sky-400 dark:hover:border-sky-500/50 transition-colors shadow-sm group">
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">{stat.title}</span>
                                <div className={`p-1.5 rounded-lg border ${stat.color === 'sky' ? 'bg-sky-50 text-sky-600 border-sky-100 dark:border-sky-500/20' : stat.color === 'destructive' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:border-rose-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 dark:border-slate-700'} dark:bg-white/5`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        </Link>
                    ))}
                </div>

                {/* --- CHARTS ROW --- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-8 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Tren Laporan (6 Bulan Terakhir)</h2>
                        </div>
                        <div className="flex-1 p-4 sm:p-5 min-h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                                    <RechartsTooltip cursor={{fill: '#f1f5f9', opacity: 0.5}} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Bar dataKey="ikp" name="Insiden (IKP)" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="risiko" name="Register Risiko" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-4 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent text-[11px] font-bold uppercase tracking-widest text-slate-500">Sebaran Tipe IKP</div>
                        <div className="flex flex-col flex-1 p-5">
                            <div className="w-full h-[150px] mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={ikpTipeData} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                                            {ikpTipeData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-2 mt-auto">
                                {ikpTipeData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs font-medium">
                                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span><span>{item.name}</span></div>
                                        <span className="font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- HEATMAP & LOG --- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-6 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent text-[11px] font-bold uppercase tracking-widest text-slate-500">Matriks Risiko Aktif</div>
                        <div className="flex flex-col flex-1 p-5 items-center justify-center min-h-[300px]">
                            <div className="flex flex-col items-center">
                                <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 dark:bg-[#0b1120] rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
                                    {heatmapMatrix.map((row, rIndex) => row.map((score, cIndex) => {
                                        const count = heatmapCounts[`${rIndex}-${cIndex}`] || "";
                                        return (
                                            <div key={`${rIndex}-${cIndex}`} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg shadow-sm ${getHeatmapColor(score)}`}>
                                                {count && <span className="text-sm font-black drop-shadow-md">{count}</span>}
                                            </div>
                                        )
                                    }))}
                                </div>
                                <div className="mt-4 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>&larr; Dampak &rarr;</span>
                                    <span className="text-slate-200">|</span>
                                    <span>&uarr; Probabilitas &darr;</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-white border shadow-sm lg:col-span-6 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-transparent">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Aktivitas Terakhir</h2>
                            <Link href="#" className="text-[10px] font-bold text-sky-600 hover:text-sky-700">Lihat Semua</Link>
                        </div>
                        <div className="flex flex-col gap-4 p-5">
                            {recentActivities.map((act, i) => {
                                const style = renderActivityIcon(act.event);
                                return (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${style.bg}`}>{style.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                                                <span className="font-bold text-slate-900 dark:text-white">{act.user}</span> {act.desc}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{act.log_name} • {act.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

Dashboard.layout = (page) => <App children={page} />;