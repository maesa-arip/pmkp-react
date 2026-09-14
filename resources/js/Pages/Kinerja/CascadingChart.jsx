import React, { useState } from 'react';
import { ChevronDownIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const colors = {
    1: 'border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/30',
    2: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
    3: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
    4: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
};
const labels = { 1: 'Sasaran', 2: 'Program', 3: 'Kegiatan', 4: 'Indikator' };

function Card({ node }) {
    return <div className={`rounded-xl border p-4 text-left ${colors[node.level]}`}>
        <div className="mb-2 flex items-start justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{labels[node.level]}</span><span className="break-all rounded-md bg-white/80 px-2 py-1 font-mono text-xs font-bold text-sky-800 dark:bg-slate-800 dark:text-sky-300">{node.display_code}</span></div>
        {node.jabatan && <p className="mb-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">{node.jabatan}</p>}
        <p className="break-words text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{node.name}</p>
        {node.tujuan && node.tujuan.trim() !== node.name.trim() && <p className="mt-2 break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400">{node.tujuan}</p>}
    </div>;
}

export default function CascadingChart({ tree = [], period }) {
    const [rootId, setRootId] = useState('');
    const [allIndicators, setAllIndicators] = useState(false);
    const roots = rootId ? tree.filter(node => String(node.id) === rootId) : tree;
    return <section className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-semibold">Bagan Cascading {period.tahun}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sasaran → Program → Kegiatan → Indikator. Kode sama dengan yang ditampilkan di Excel.</p></div><div className="flex flex-wrap items-center gap-3"><label className="text-sm"><span className="sr-only">Pilih sasaran bagan</span><select aria-label="Pilih sasaran bagan" value={rootId} onChange={e => setRootId(e.target.value)} className="max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="">Semua sasaran</option>{tree.map(node => <option key={node.id} value={node.id}>{node.display_code} — {node.name}</option>)}</select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allIndicators} onChange={e => setAllIndicators(e.target.checked)} className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900" />Buka semua indikator</label></div></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Bagan menampilkan data aktif. Geser ke samping untuk melihat cabang lainnya; buka kegiatan untuk melihat indikatornya.</p>
        {!roots.length && <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><Squares2X2Icon className="mx-auto mb-3 h-9 w-9 text-slate-400" /><p>Belum ada sasaran aktif pada periode ini.</p></div>}
        {roots.map(root => <article key={root.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/20 sm:p-6">
            <div className="mx-auto max-w-xl"><Card node={root} /></div>
            {root.children.length > 0 && <><div className="mx-auto h-7 w-px bg-slate-300 dark:bg-slate-600" /><div className="relative overflow-x-auto pb-4"><div className="flex min-w-max justify-center gap-6 border-t border-slate-300 px-3 pt-7 dark:border-slate-600">
                {root.children.map(program => <div key={program.id} className="relative w-80 shrink-0 before:absolute before:-top-7 before:left-1/2 before:h-7 before:border-l before:border-slate-300 dark:before:border-slate-600"><Card node={program} />
                    {program.children.length > 0 && <div className="ml-3 mt-4 space-y-4 border-l border-slate-300 pl-4 dark:border-slate-600">{program.children.map(activity => <div key={activity.id} className="relative before:absolute before:-left-4 before:top-6 before:w-4 before:border-t before:border-slate-300 dark:before:border-slate-600"><Card node={activity} />
                        {activity.children.length > 0 && <details key={`${activity.id}-${allIndicators}`} open={allIndicators} className="group mt-2"><summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-sky-500 dark:text-sky-300 dark:hover:bg-sky-900/20 [&::-webkit-details-marker]:hidden"><ChevronDownIcon className="h-4 w-4 transition group-open:rotate-180" />{activity.children.length} indikator</summary><div className="mt-2 space-y-2">{activity.children.map(indicator => <Card key={indicator.id} node={indicator} />)}</div></details>}
                    </div>)}</div>}
                </div>)}
            </div></div></>}
        </article>)}
    </section>;
}
