import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import KinerjaModal from './KinerjaModal';
import DestroyModal from '@/Components/Modal/DestroyModal';
import DangerButton from '@/Components/DangerButton';

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
const button = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-40 dark:border-slate-700 dark:text-sky-300 dark:hover:bg-slate-800';

export function featureIndicators(level, item, indicators, legacy = false) {
    if (legacy || String(level) === '1' || String(level) === '4') return [item];
    return indicators.filter(indicator => indicator.is_active !== false && indicator.is_active !== 0 && String(indicator['indikator_fitur' + level + '_id']) === String(item.id));
}

export default function FeatureIndicators({ level, item, indicators, period, onClose, onEditNode }) {
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const destroyForm = useForm({ periode_kinerja_id: period.id, level: Number(level), activity_id: item.id });
    const form = useForm({ periode_kinerja_id: period.id, level: Number(level), activity_id: item.id, name: '', kode_cascading: '' });
    const legacy = Number(period.feature_schema_version || 1) !== 2;
    const rows = featureIndicators(level, item, indicators, legacy);
    const canEdit = ['draft', 'aktif'].includes(period.status);
    const activity = !legacy && ['2', '3'].includes(String(level));
    const label = legacy ? 'data historis' : String(level) === '4' ? 'indikator mutu' : String(level) === '1' ? 'indikator kinerja utama' : 'indikator kinerja';
    const begin = (row = {}) => {
        if (!activity) { onClose(); onEditNode({ ...row, level }); return; }
        form.clearErrors();
        form.setData({ periode_kinerja_id: period.id, level: Number(level), activity_id: item.id, name: row.name || '', kode_cascading: row.kode_cascading || '' });
        setEditing(row);
    };
    return <><KinerjaModal show onClose={onClose} busy={form.processing || destroyForm.processing} title={editing ? (editing.id ? 'Edit indikator kinerja' : 'Tambah indikator kinerja') : rows.length + ' ' + label} description={'Fitur ' + level + ' · Tahun ' + period.tahun + ' · ' + item.name}>
        {editing ? <form className="space-y-5" onSubmit={event => {
            event.preventDefault();
            const options = { preserveScroll: true, onSuccess: () => setEditing(null) };
            editing.id ? form.put(route('kinerja.performance.update', editing.id), options) : form.post(route('kinerja.performance.store'), options);
        }}>
            <div><label htmlFor="feature-indicator-name" className="mb-2 block text-sm font-semibold">Nama indikator kinerja</label><textarea autoFocus id="feature-indicator-name" required maxLength={255} rows={4} className={input} value={form.data.name} onChange={event => form.setData('name', event.target.value)} /></div>
            <div><label htmlFor="feature-indicator-code" className="mb-2 block text-sm font-semibold">Kode cascading (opsional)</label><input id="feature-indicator-code" maxLength={50} className={input} value={form.data.kode_cascading} onChange={event => form.setData('kode_cascading', event.target.value)} /></div>
            {Object.keys(form.errors).length > 0 && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">{Object.entries(form.errors).map(([key, error]) => <p key={key}>{error}</p>)}</div>}
            <div className="flex flex-wrap justify-end gap-3"><button type="button" className={button} disabled={form.processing} onClick={() => setEditing(null)}>Kembali ke daftar</button><button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50" disabled={form.processing}>{form.processing ? 'Menyimpan…' : 'Simpan indikator'}</button></div>
        </form> : <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{activity ? 'Indikator kinerja yang terhubung langsung ke kegiatan ini pada cascading.' : 'Indikator pada baris ini sesuai cascading.'}</p>
            {activity && canEdit && <button type="button" className={button} disabled={!item.is_active} onClick={() => begin()}><PlusIcon className="h-4 w-4" />Tambah indikator kinerja</button>}
            {!canEdit && <p className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">Periode sudah ditutup. Indikator hanya dapat dilihat.</p>}
            {activity && !item.is_active && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">Aktifkan kegiatan terlebih dahulu untuk mengedit indikator kinerjanya.</p>}
            {rows.length ? <ul className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">{rows.map(row => <li key={row.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-start">
                <div className="min-w-0"><p className="text-xs text-slate-500 dark:text-slate-400">{row.kode_cascading || row.display_code || '#' + row.id}{!row.is_active && ' · Tidak aktif'}</p><p className="mt-1 whitespace-pre-line break-words text-sm font-medium leading-relaxed">{row.name}</p></div>
                {canEdit && <div className="flex shrink-0 flex-wrap gap-2 self-start">
                    <button type="button" className={button} disabled={activity && !item.is_active} aria-label={'Edit indikator ' + row.name} onClick={() => begin(row)}><PencilSquareIcon className="h-4 w-4" />Edit</button>
                    {activity && <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-900/20" disabled={!item.is_active} aria-label={'Hapus indikator ' + row.name} onClick={() => { destroyForm.clearErrors(); setDeleting(row); }}><TrashIcon className="h-4 w-4" />Hapus</button>}
                </div>}
            </li>)}</ul> : <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Belum ada indikator kinerja yang terhubung ke kegiatan ini.</p>}
            <div className="flex justify-end"><button type="button" className={button} onClick={onClose}>Tutup</button></div>
        </div>}
    </KinerjaModal>
        <DestroyModal isOpenDestroyDialog={Boolean(deleting)} setIsOpenDestroyDialog={open => { if (!open && !destroyForm.processing) setDeleting(null); }} title="Hapus indikator kinerja" warning={`Hapus "${deleting?.name || ''}" dari kegiatan ini? Indikator tidak akan ditampilkan pada ekspor berikutnya. Arsip yang sudah dibuat tetap tersedia.`}>
            {Object.keys(destroyForm.errors).length > 0 && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{Object.values(destroyForm.errors).join(' ')}</p>}
            <DangerButton type="button" processing={destroyForm.processing} onClick={() => { if (deleting) destroyForm.delete(route('kinerja.performance.destroy', deleting.id), { preserveScroll: true, onSuccess: () => setDeleting(null) }); }}>Hapus indikator</DangerButton>
        </DestroyModal>
    </>;
}
