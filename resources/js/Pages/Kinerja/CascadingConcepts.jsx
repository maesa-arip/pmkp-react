import React, { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import KinerjaSelect from './KinerjaSelect';
import KinerjaModal from './KinerjaModal';
import CascadingFolderTree from './CascadingFolderTree';

const kinds = { tujuan_strategis: 'Tujuan strategis', program: 'Program', sasaran_strategis: 'Sasaran strategis', iku: 'Indikator Kinerja Utama', sasaran: 'Sasaran jabatan', kegiatan: 'Kegiatan', indikator_kinerja: 'Indikator kinerja', indikator_mutu: 'Indikator mutu' };
const tiers = { organisasi: 'Organisasi', direktur: 'Direktur', wadir: 'Wakil direktur', kabag_kabid: 'Kabag / Kabid', tim_kerja: 'Tim kerja' };
const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
const button = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-sky-500 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800';
const badge = 'rounded-md px-2 py-1 text-xs font-semibold';
const branchLabels = { grey: 'IKU abu-abu', yellow: 'IKU kuning', pink: 'IKU pink' };
const color = branch => branch === 'yellow' ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200' : branch === 'pink' ? 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100';

const getNodeDetails = node => ({
    name: node.name, code: node.code, label: kinds[node.kind], office: node.office,
    meta: [tiers[node.tier], branchLabels[node.iku_branch]].filter(Boolean).join(' · '),
    badgeClass: color(node.iku_branch), note: node.relation_note,
});

export default function CascadingConcepts({ nodes, period, mode, kindFilter = null }) {
    const [kind, setKind] = useState('');
    const [office, setOffice] = useState('');
    const [query, setQuery] = useState('');
    const [issuesOnly, setIssuesOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(null);
    const form = useForm({ name: '', code: '' });
    const canEdit = period.status !== 'ditutup';
    const byId = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);
    const counts = useMemo(() => nodes.reduce((result, n) => ({ ...result, [n.kind]: (result[n.kind] || 0) + 1 }), {}), [nodes]);
    const selectedKind = kindFilter || kind;
    const strategicView = ['tujuan_strategis', 'program', 'sasaran_strategis'].includes(kindFilter);
    const filtered = nodes.filter(n => (!selectedKind || n.kind === selectedKind) && (!office || n.office === office) && (!issuesOnly || n.relation_note) && (!query || [n.name, n.code, ...(strategicView ? [] : [n.office])].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase())));
    const pages = Math.max(1, Math.ceil(filtered.length / 25));
    const currentPage = Math.min(page, pages);
    const hasFilter = Boolean(kind || office || query || issuesOnly);
    const childrenById = useMemo(() => nodes.reduce((result, n) => {
        if (n.parent_id && byId[n.parent_id]) (result[n.parent_id] ||= []).push(n);
        return result;
    }, {}), [nodes, byId]);
    // Keep matching nodes connected to their ancestors while filtering the tree.
    const visibleIds = new Set();
    filtered.forEach(node => {
        let current = node;
        while (current && !visibleIds.has(current.id)) {
            visibleIds.add(current.id);
            current = byId[current.parent_id];
        }
    });
    const roots = nodes.filter(n => (!n.parent_id || !byId[n.parent_id]) && (!hasFilter || visibleIds.has(n.id)));
    const begin = node => { setEditing(node); form.setData({ name: node.name, code: node.code || '' }); form.clearErrors(); };
    const rows = filtered.slice((currentPage - 1) * 25, currentPage * 25);
    return <section className="min-w-0 space-y-5 text-slate-800 dark:text-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold">{kindFilter ? kinds[kindFilter] : `Cascading lengkap ${period.tahun}`}</h2>
            {!kindFilter && <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Tujuan diturunkan menjadi sasaran, lalu IKU Direktur. Kegiatan Wadir mengikuti jalur IKU abu-abu, kuning, atau pink; kegiatan Kabag/Kabid diturunkan dari kegiatan Wadir. Setiap kegiatan memiliki indikator kinerjanya. Target serta unit pada indikator mutu mengikuti uraian sumber.</p>}
            {kindFilter && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{counts[kindFilter] || 0} data pada periode {period.tahun}.</p>}
            {!kindFilter && <div className="mt-4 flex flex-wrap gap-2">{Object.entries(kinds).filter(([key]) => counts[key]).map(([key, label]) => <button key={key} type="button" aria-pressed={kind === key} onClick={() => { setKind(kind === key ? '' : key); setPage(1); }} className={badge + ' ' + (kind === key ? 'bg-sky-600 text-white ring-2 ring-sky-300' : color(key))}>{label} · {counts[key] || 0}</button>)}</div>}
            <div className={`mt-5 grid gap-3 ${strategicView ? '' : 'lg:grid-cols-2'}`}>
                <div><label htmlFor="concept-search" className="mb-2 block text-xs font-semibold">Cari uraian atau kode</label><div className="relative"><MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><input id="concept-search" className={input + ' pl-10'} value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Cari pada seluruh jenis data…" /></div></div>
                {!strategicView && <div><label htmlFor="concept-office" className="mb-2 block text-xs font-semibold">Jabatan / tim kerja</label><KinerjaSelect id="concept-office" value={office} onChange={v => { setOffice(v); setPage(1); }} options={[{ value: '', label: 'Semua jabatan' }, ...Array.from(new Set(nodes.map(n => n.office))).sort().map(v => ({ value: v, label: v }))]} /></div>}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">{!strategicView && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={issuesOnly} onChange={e => { setIssuesOnly(e.target.checked); setPage(1); }} className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />Tampilkan catatan sumber ({nodes.filter(n => n.relation_note).length})</label>}{hasFilter && <button type="button" className={button} onClick={() => { setKind(''); setOffice(''); setQuery(''); setIssuesOnly(false); setPage(1); }}>Hapus filter</button>}</div>
        </div>
        {mode === 'tree' ? <CascadingFolderTree
            key={JSON.stringify([kind, office, query, issuesOnly])}
            roots={roots}
            getChildren={node => (childrenById[node.id] || []).filter(child => !hasFilter || visibleIds.has(child.id))}
            getKey={node => node.id}
            getDetails={getNodeDetails}
            onEdit={canEdit ? begin : null}
            expandAll={hasFilter}
            summary={hasFilter ? `${filtered.length} hasil ditemukan · Jalur induk tetap ditampilkan.` : 'Klik folder untuk membuka atau menutup turunannya.'}
        /> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{kindFilter ? kinds[kindFilter] : 'Data cascading lengkap'} tahun {period.tahun}</caption><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Jenis / Kode</th><th className="px-4 py-3">{strategicView ? 'Uraian' : 'Uraian / Induk'}</th>{!strategicView && <th className="px-4 py-3">Penanggung jawab / Sumber</th>}{canEdit && <th className="px-4 py-3">Tindakan</th>}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map(n => <tr key={n.id}><td className="min-w-[150px] px-4 py-4 align-top"><span className={badge + ' inline-block ' + color(n.iku_branch)}>{kinds[n.kind]}</span><p className="mt-2 break-all font-mono text-xs">{n.code}</p><p className="mt-1 text-xs text-slate-500">{tiers[n.tier]}</p>{n.iku_branch && <p className="mt-1 text-xs font-medium">{branchLabels[n.iku_branch]}</p>}</td><td className="min-w-[250px] max-w-xl px-4 py-4 align-top"><p className="whitespace-pre-line break-words leading-relaxed">{n.name}</p>{!strategicView && n.parent_id && <p className="mt-3 text-xs leading-relaxed text-slate-500">Induk: {byId[n.parent_id]?.name || 'Tidak tersedia'}</p>}{!strategicView && n.relation_note && <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">{n.relation_note}</p>}</td>{!strategicView && <td className="min-w-[170px] px-4 py-4 align-top"><p className="text-xs leading-relaxed">{n.office}</p><p className="mt-2 text-xs text-slate-400">{n.source_sheet.trim()} · {n.source_cell}</p></td>}{canEdit && <td className="px-4 py-4 align-top"><button type="button" aria-label={'Edit ' + n.name} className={button} onClick={() => begin(n)}><PencilSquareIcon className="h-4 w-4" />Edit</button></td>}</tr>)}</tbody></table></div>
            {!filtered.length && <p className="p-10 text-center text-sm text-slate-500">Tidak ada data yang sesuai filter.</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 dark:border-slate-800"><p className="text-xs text-slate-500">{filtered.length} data · halaman {currentPage} / {pages}</p><div className="flex gap-2"><button type="button" className={button} disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>Sebelumnya</button><button type="button" className={button} disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}>Berikutnya</button></div></div>
        </div>}
        <KinerjaModal show={Boolean(editing)} onClose={() => setEditing(null)} busy={form.processing} title={editing ? 'Edit ' + kinds[editing.kind] : ''} description={strategicView ? undefined : editing?.office}>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); form.put(route('kinerja.concepts.update', [period.id, editing.id]), { preserveScroll: true, onSuccess: () => setEditing(null) }); }}>
                <div><label htmlFor="concept-code" className="mb-2 block text-sm font-semibold">Kode</label><input id="concept-code" className={input} value={form.data.code} onChange={e => form.setData('code', e.target.value)} /></div>
                <div><label htmlFor="concept-name" className="mb-2 block text-sm font-semibold">Uraian</label><textarea id="concept-name" rows={5} required className={input} value={form.data.name} onChange={e => form.setData('name', e.target.value)} /></div>
                {Object.values(form.errors).length > 0 && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">{Object.values(form.errors).join(' ')}</div>}
                <div className="flex justify-end gap-3"><button type="button" className={button} disabled={form.processing} onClick={() => setEditing(null)}>Batal</button><button disabled={form.processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">{form.processing ? 'Menyimpan…' : 'Simpan'}</button></div>
            </form>
        </KinerjaModal>
    </section>;
}