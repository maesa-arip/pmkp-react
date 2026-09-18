import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import KinerjaModal from './KinerjaModal';
import KinerjaSelect from './KinerjaSelect';
import InputError from '@/Components/InputError';

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
const button = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-40 dark:border-slate-700 dark:text-sky-300 dark:hover:bg-slate-800';

export default function DirectorActivities({ period, nodes }) {
    const [editing, setEditing] = useState(null);
    const form = useForm({ kind: 'kegiatan', parent_id: '', name: '', code: '' });
    const ikus = nodes.filter(n => n.kind === 'iku' && n.is_active);
    const activities = nodes.filter(n => n.tier === 'direktur' && n.kind === 'kegiatan' && n.is_active);
    const writable = ['draft', 'aktif'].includes(period.status);
    const indicator = form.data.kind === 'indikator_kinerja';
    const parents = indicator ? activities : ikus;
    const begin = (kind, parentId = '', row = {}) => {
        form.clearErrors();
        form.setData({ kind, parent_id: row.parent_id || parentId, name: row.name || '', code: row.code || '' });
        setEditing(row);
    };
    return <section className="min-w-0 space-y-4 text-slate-800 dark:text-slate-100">
        <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div><h2 className="text-lg font-bold">Kegiatan Direktur</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Kelola kegiatan di bawah IKU Direktur beserta indikator kinerjanya. Ekspor mengikuti data yang disimpan.</p></div>
            {writable && <button type="button" className={button} disabled={!ikus.length} onClick={() => begin('kegiatan')}><PlusIcon className="h-4 w-4" />Tambah kegiatan Direktur</button>}
        </header>
        {!writable && <p className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">Periode sudah ditutup. Data hanya dapat dilihat.</p>}
        {!activities.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">Belum ada kegiatan Direktur pada periode ini.</p>}
        {activities.map(activity => {
            const indicators = nodes.filter(n => n.tier === 'direktur' && n.kind === 'indikator_kinerja' && n.is_active && n.parent_id === activity.id);
            return <article key={activity.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1"><p className="text-xs text-slate-500 dark:text-slate-400">IKU: {ikus.find(n => n.id === activity.parent_id)?.name || 'Tidak tersedia'}</p><p className="mt-2 text-xs font-mono text-slate-500">{activity.code}</p><h3 className="mt-1 whitespace-pre-line break-words font-semibold">{activity.name}</h3></div>
                    {writable && <button type="button" className={button} aria-label={'Edit kegiatan ' + activity.name} onClick={() => begin('kegiatan', '', activity)}><PencilSquareIcon className="h-4 w-4" />Edit kegiatan</button>}
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="text-sm font-semibold">{indicators.length} indikator kinerja</h4>{writable && <button type="button" className={button} aria-label={'Tambah indikator untuk ' + activity.name} onClick={() => begin('indikator_kinerja', activity.id)}><PlusIcon className="h-4 w-4" />Tambah indikator kinerja</button>}</div>
                    <ul className="mt-3 space-y-3">{indicators.map(row => <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><div className="min-w-0 flex-1"><p className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.code}</p><p className="mt-1 whitespace-pre-line break-words text-sm">{row.name}</p></div>{writable && <button type="button" className={button} aria-label={'Edit indikator Direktur ' + row.name} onClick={() => begin('indikator_kinerja', '', row)}><PencilSquareIcon className="h-4 w-4" />Edit</button>}</li>)}</ul>
                    {!indicators.length && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Belum ada indikator kinerja.</p>}
                </div>
            </article>;
        })}
        <KinerjaModal show={editing !== null} onClose={() => setEditing(null)} busy={form.processing} title={(editing?.id ? 'Edit ' : 'Tambah ') + (indicator ? 'indikator kinerja Direktur' : 'kegiatan Direktur')}>
            <form className="space-y-4" onSubmit={event => {
                event.preventDefault();
                const options = { preserveScroll: true, onSuccess: () => setEditing(null) };
                editing.id ? form.put(route('kinerja.director.update', [period.id, editing.id]), options) : form.post(route('kinerja.director.store', period.id), options);
            }}>
                <div><label htmlFor="director-parent" className="mb-2 block text-sm font-semibold">{indicator ? 'Kegiatan induk' : 'IKU induk'}</label><KinerjaSelect id="director-parent" value={form.data.parent_id} onChange={value => form.setData('parent_id', value)} options={[{ value: '', label: indicator ? 'Pilih kegiatan' : 'Pilih IKU' }, ...parents.map(n => ({ value: n.id, label: n.name }))]} /><InputError message={form.errors.parent_id} className="mt-2" /></div>
                <div><label htmlFor="director-code" className="mb-2 block text-sm font-semibold">Kode (opsional)</label><input id="director-code" className={input} maxLength={80} value={form.data.code} onChange={event => form.setData('code', event.target.value)} /><InputError message={form.errors.code} className="mt-2" /></div>
                <div><label htmlFor="director-name" className="mb-2 block text-sm font-semibold">{indicator ? 'Indikator kinerja' : 'Nama kegiatan'}</label><textarea id="director-name" required maxLength={10000} rows={5} className={input} value={form.data.name} onChange={event => form.setData('name', event.target.value)} /><InputError message={form.errors.name} className="mt-2" /></div>
                <InputError message={form.errors.kind} />
                <div className="flex justify-end gap-3"><button type="button" className={button} disabled={form.processing} onClick={() => setEditing(null)}>Batal</button><button disabled={form.processing || !form.data.parent_id} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">{form.processing ? 'Menyimpan…' : 'Simpan'}</button></div>
            </form>
        </KinerjaModal>
    </section>;
}
