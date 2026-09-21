import React, { useId, useState } from 'react';
import { ChevronRightIcon, DocumentTextIcon, FolderIcon, FolderOpenIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const control = 'rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800';

export default function CascadingFolderTree({ roots, getChildren, getKey, getDetails, onEdit, expandAll = false, summary }) {
    const id = useId();
    const [expansion, setExpansion] = useState(expandAll ? 'all' : 'initial');
    const [expanded, setExpanded] = useState({});
    const setAll = value => { setExpansion(value); setExpanded({}); };

    const renderNode = (node, depth = 0, last = true) => {
        const key = getKey(node);
        const children = getChildren(node);
        const details = getDetails(node);
        const open = expanded[key] ?? (expansion === 'all' || (expansion === 'initial' && depth < 2));
        const regionId = `${id}-${key}`;
        const Icon = children.length ? (open ? FolderOpenIcon : FolderIcon) : DocumentTextIcon;
        const content = <>
            <span className="flex h-6 shrink-0 items-center gap-1.5">
                {children.length ? <ChevronRightIcon aria-hidden="true" className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} /> : <span className="w-4" />}
                <Icon aria-hidden="true" className={`h-5 w-5 ${children.length ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
            </span>
            <span className="block min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className={`rounded px-1.5 py-0.5 font-semibold ${details.badgeClass}`}>{details.label}</span>
                    {details.code && <span className="break-all font-mono text-slate-500 dark:text-slate-400">{details.code}</span>}
                    {children.length > 0 && <span className="text-slate-400 dark:text-slate-500">{children.length} turunan</span>}
                </span>
                <span className="mt-1 block whitespace-pre-line break-words text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-100">{details.name}</span>
                {(details.office || details.meta) && <span className="mt-1 block break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400">{[details.office, details.meta].filter(Boolean).join(' · ')}</span>}
            </span>
        </>;

        return <li key={key} className={`relative min-w-0 ${depth ? 'pl-2 sm:pl-5' : ''}`}>
            {depth > 0 && <>
                <span aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 w-px bg-slate-200 dark:bg-slate-700 ${last ? 'h-6' : 'h-full'}`} />
                <span aria-hidden="true" className="pointer-events-none absolute left-0 top-6 h-px w-2 bg-slate-200 dark:bg-slate-700 sm:w-5" />
            </>}
            <div className="rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-start gap-1">
                    {children.length ? <button type="button" aria-expanded={open} aria-controls={regionId} onClick={() => setExpanded(current => ({ ...current, [key]: !open }))} className="flex min-w-0 flex-1 items-start gap-2 rounded-lg px-2 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500">{content}</button> : <div className="flex min-w-0 flex-1 items-start gap-2 px-2 py-3">{content}</div>}
                    {onEdit && <button type="button" onClick={() => onEdit(node)} aria-label={`Edit ${details.name}`} title="Edit" className="my-2 mr-1 shrink-0 rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-700 dark:hover:text-sky-300"><PencilSquareIcon aria-hidden="true" className="h-4 w-4" /></button>}
                </div>
                {details.description && <p className="pb-3 pl-14 pr-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{details.description}</p>}
                {details.note && <p className="mb-2 ml-14 mr-3 whitespace-pre-line break-words rounded-lg bg-amber-50 p-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">{details.note}</p>}
            </div>
            {children.length > 0 && <ul id={regionId} hidden={!open} className="ml-2 list-none p-0 sm:ml-4">{open && children.map((child, index) => renderNode(child, depth + 1, index === children.length - 1))}</ul>}
        </li>;
    };

    return <div className="min-w-0 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{summary || 'Klik folder untuk membuka atau menutup turunannya.'}</p>
            <div className="flex shrink-0 gap-2"><button type="button" className={control} disabled={!roots.length} onClick={() => setAll('all')}>Buka semua</button><button type="button" className={control} disabled={!roots.length} onClick={() => setAll('none')}>Tutup semua</button></div>
        </div>
        {roots.length ? <ul aria-label="Hierarki cascading" className="list-none p-2 sm:p-4">{roots.map(node => renderNode(node))}</ul> : <p className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">Tidak ada data yang sesuai filter.</p>}
    </div>;
}
