import React from 'react';
import { router, usePage } from '@inertiajs/react';

export default function AnnualYearFilter({ value, onChange }) {
    const { annualPeriods = [] } = usePage().props;
    return <label className="my-4 flex items-center gap-3 text-sm font-semibold">Tahun data
        <select className="rounded border-slate-300 dark:bg-slate-900" value={value || new Date().getFullYear()} onChange={e => onChange ? onChange(e.target.value) : router.get(route(route().current()), { tahun: e.target.value })}>
            {annualPeriods.map(p => <option key={p.id} value={p.tahun}>{p.tahun} — {p.status}</option>)}
        </select>
    </label>;
}
