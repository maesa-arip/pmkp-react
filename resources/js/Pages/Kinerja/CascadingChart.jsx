import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { ChevronDownIcon, ArrowsRightLeftIcon, PencilSquareIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import KinerjaSelect from './KinerjaSelect';

const colors = {
    1: 'border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900',
    2: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900',
    3: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900',
    4: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
};
const labels = { 1: 'Sasaran', 2: 'Program', 3: 'Kegiatan', 4: 'Indikator' };
const line = 'pointer-events-none absolute bg-slate-300 dark:bg-slate-600';

function Card({ node, children, onEdit }) {
    return <div data-cascading-card={`${node.level}-${node.id}`} className={`relative rounded-xl border p-4 text-left shadow-sm ${colors[node.level]}`}>
        <div className="mb-2 flex items-start justify-between gap-3">
            <span className="pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{labels[node.level]}</span>
            <span className="max-w-[65%] break-all rounded-md bg-white/80 px-2 py-1 font-mono text-xs font-bold text-sky-800 dark:bg-slate-800 dark:text-sky-300">{node.display_code}</span>
        </div>
        {node.jabatan && <p className="mb-2 break-words text-xs font-bold uppercase text-slate-600 dark:text-slate-300">{node.jabatan}</p>}
        <p className="break-words text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{node.name}</p>
        {node.tujuan && node.tujuan.trim() !== node.name.trim() && <p className="mt-2 break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400">{node.tujuan}</p>}
        {children}
        {onEdit && <button type="button" onClick={() => onEdit(node)} aria-label={`Edit ${labels[node.level].toLowerCase()} ${node.display_code}`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-200 dark:hover:bg-slate-800">
            <PencilSquareIcon className="h-4 w-4" />Edit {labels[node.level].toLowerCase()}
        </button>}
    </div>;
}

// Rails end at the last child's entry point, independent of text or branch height.
function Branches({ nodes, render }) {
    return <ul className="ml-4 list-none p-0">
        {nodes.map((node, index) => <li key={node.id} className="relative pl-6 pt-4">
            <span aria-hidden="true" className={`${line} left-0 top-0 w-px ${index === nodes.length - 1 ? 'h-10' : 'h-full'}`} />
            <span aria-hidden="true" className={`${line} left-0 top-10 h-px w-6`} />
            {render(node)}
        </li>)}
    </ul>;
}

export default function CascadingChart({ tree = [], period, onEdit }) {
    const [rootId, setRootId] = useState('');
    const [allIndicators, setAllIndicators] = useState(false);
    const [expanded, setExpanded] = useState({});
    const roots = rootId ? tree.filter(node => String(node.id) === String(rootId)) : tree;

    const activityCard = activity => {
        const children = activity.children || [];
        const isOpen = expanded[activity.id] ?? allIndicators;
        const regionId = `cascading-indicators-${period.id}-${activity.id}`;
        return <>
            <Card node={activity} onEdit={onEdit}>
                {children.length > 0 && <button type="button" aria-expanded={isOpen} aria-controls={regionId}
                    onClick={() => setExpanded(current => ({ ...current, [activity.id]: !isOpen }))}
                    className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white/80 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800">
                    <span>{children.length} indikator</span><ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>}
            </Card>
            {children.length > 0 && <div id={regionId} hidden={!isOpen} className="min-w-0">
                {isOpen && <Branches nodes={children} render={indicator => <Card node={indicator} onEdit={onEdit} />} />}
            </div>}
        </>;
    };

    return <section className="min-w-0 space-y-4 text-slate-800 dark:text-slate-100">
        <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div><h2 className="text-lg font-bold">Bagan Cascading {period.tahun}</h2><p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Sasaran → Program → Kegiatan → Indikator</p></div>
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="w-full sm:w-72"><label htmlFor="cascading-root" className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Pilih sasaran bagan</label>
                        <KinerjaSelect id="cascading-root" value={rootId} onChange={setRootId} options={[{ value: '', label: 'Semua sasaran' }, ...tree.map(node => ({ value: String(node.id), label: `${node.display_code} — ${node.name}` }))]} />
                    </div>
                    <Switch.Group as="div" className="flex min-h-[44px] shrink-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <Switch checked={allIndicators} onChange={value => { setAllIndicators(value); setExpanded({}); }} className={`${allIndicators ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`}>
                            <span className={`${allIndicators ? 'translate-x-6' : 'translate-x-1'} h-4 w-4 rounded-full bg-white shadow-sm transition-transform`} />
                        </Switch><Switch.Label className="cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">Buka semua indikator</Switch.Label>
                    </Switch.Group>
                </div>
            </div>
        </div>
        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400"><ArrowsRightLeftIcon className="h-4 w-4 shrink-0" />Geser bagan untuk melihat cabang lainnya. Klik jumlah indikator pada kegiatan untuk membuka rinciannya.</p>
        {!roots.length && <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700"><Squares2X2Icon className="mx-auto mb-3 h-9 w-9 text-slate-400" /><p className="text-sm text-slate-500 dark:text-slate-400">Belum ada sasaran aktif pada periode ini.</p></div>}
        {roots.map(root => <article key={root.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"><span className="rounded-md bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Sasaran {root.display_code}</span><span>{root.children.length} program</span></div>
            <div tabIndex={0} role="region" aria-label={`Bagan sasaran ${root.display_code}`} className="overflow-x-auto overscroll-x-contain p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 sm:p-6">
                <div className="mx-auto w-max min-w-full pb-2">
                    <div className="mx-auto w-72"><Card node={root} onEdit={onEdit} /></div>
                    {root.children.length > 0 && <>
                        <div aria-hidden="true" className="mx-auto h-8 w-px bg-slate-300 dark:bg-slate-600" />
                        <ul className="flex list-none justify-center p-0">
                            {root.children.map((program, index) => <li key={program.id} className="relative w-80 shrink-0 px-4 pt-8">
                                {index > 0 && <span aria-hidden="true" className={`${line} left-0 top-0 h-px w-1/2`} />}
                                {index < root.children.length - 1 && <span aria-hidden="true" className={`${line} right-0 top-0 h-px w-1/2`} />}
                                <span aria-hidden="true" className={`${line} left-1/2 top-0 h-8 w-px -translate-x-1/2`} />
                                <Card node={program} onEdit={onEdit} />
                                {program.children.length > 0 && <Branches nodes={program.children} render={activityCard} />}
                            </li>)}
                        </ul>
                    </>}
                </div>
            </div>
        </article>)}
    </section>;
}
