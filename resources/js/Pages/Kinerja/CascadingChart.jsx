import React, { useState } from 'react';
import KinerjaSelect from './KinerjaSelect';
import CascadingFolderTree from './CascadingFolderTree';

const colors = {
    1: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    2: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    3: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    4: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};
const labels = { 1: 'Sasaran', 2: 'Program', 3: 'Kegiatan', 4: 'Indikator' };
const getNodeDetails = node => ({
    name: node.name, code: node.display_code, label: labels[node.level],
    office: node.jabatan, badgeClass: colors[node.level],
    description: node.tujuan?.trim() !== node.name?.trim() ? node.tujuan : '',
});

export default function CascadingChart({ tree = [], period, onEdit }) {
    const [rootId, setRootId] = useState('');
    const roots = rootId ? tree.filter(node => String(node.id) === String(rootId)) : tree;

    return <section className="min-w-0 space-y-4 text-slate-800 dark:text-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><h2 className="text-lg font-bold">Bagan Cascading {period.tahun}</h2><p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Sasaran → Program → Kegiatan → Indikator</p></div>
                <div className="w-full sm:w-72"><label htmlFor="cascading-root" className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Pilih sasaran bagan</label>
                    <KinerjaSelect id="cascading-root" value={rootId} onChange={setRootId} options={[{ value: '', label: 'Semua sasaran' }, ...tree.map(node => ({ value: String(node.id), label: `${node.display_code} — ${node.name}` }))]} />
                </div>
            </div>
        </div>
        {!tree.length ? <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Belum ada sasaran aktif pada periode ini.</div> : <CascadingFolderTree roots={roots} getChildren={node => node.children || []} getKey={node => `${node.level}-${node.id}`} getDetails={getNodeDetails} onEdit={onEdit} />}
    </section>;
}
