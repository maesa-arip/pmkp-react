import React, { useId } from 'react';
import { router, usePage } from '@inertiajs/react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Select from '@/Components/ui/Select';

export default function AnnualYearFilter({ value, onChange }) {
    const { annualPeriods = [] } = usePage().props;
    const id = useId();
    const statuses = { aktif: 'Aktif', draft: 'Draft', ditutup: 'Ditutup' };
    return (
        <div className="relative z-20 my-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"><CalendarDaysIcon className="h-5 w-5" /></div>
                <div>
                    <label htmlFor={id} className="block text-sm font-bold text-slate-900 dark:text-white">Tahun Data</label>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tampilkan data sesuai periode yang dipilih.</p>
                </div>
            </div>
            <Select id={id} className="w-full sm:w-56" value={value || new Date().getFullYear()}
                placeholder="Pilih tahun data"
                options={annualPeriods.map(p => ({ value: String(p.tahun), label: p.tahun + ' — ' + (statuses[p.status] || p.status) }))}
                onChange={tahun => onChange ? onChange(tahun) : router.get(route(route().current()), { tahun })} />
        </div>
    );
}
