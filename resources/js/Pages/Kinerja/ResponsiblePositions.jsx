import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import KinerjaModal from './KinerjaModal';

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
const button = 'rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50';
const secondary = 'rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800';

export default function ResponsiblePositions({ positions, locations }) {
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [unitSearch, setUnitSearch] = useState('');
    const form = useForm({ id: '', name: '', is_active: true, location_ids: [] });
    const begin = (position = {}) => {
        form.clearErrors();
        form.setData({ id: position.id || '', name: position.name || '', is_active: position.is_active === undefined ? true : !!position.is_active, location_ids: (position.location_ids || []).map(Number) });
        setUnitSearch('');
        setEditing(true);
    };
    const unitNames = ids => locations.filter(unit => ids.map(Number).includes(Number(unit.id))).map(unit => unit.name);
    const rows = positions.filter(position => (position.name + ' ' + unitNames(position.location_ids).join(' ')).toLowerCase().includes(search.toLowerCase()));
    return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Master jabatan penanggung jawab</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">Atur unit bawahan setiap jabatan. Unit fitur 4 mengikuti jabatan yang dipilih. Master ini digunakan bersama antarperiode.</p></div><button type="button" className={button} onClick={() => begin()}>Tambah jabatan</button></div>
        <input className={input} aria-label="Cari jabatan atau unit" placeholder="Cari jabatan atau unit…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="grid gap-3 lg:grid-cols-2">{rows.map(position => <article key={position.id} className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3"><div><h3 className="break-words font-semibold">{position.name}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{position.is_active ? 'Aktif' : 'Tidak aktif'} · {position.location_ids.length} unit bawahan</p></div><button type="button" className={secondary} aria-label={`Edit jabatan ${position.name}`} onClick={() => begin(position)}>Edit</button></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{unitNames(position.location_ids).join(', ') || 'Unit bawahan belum diatur.'}</p>
        </article>)}</div>
        {!rows.length && <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">{search ? 'Tidak ada jabatan yang sesuai pencarian.' : 'Belum ada master jabatan. Tambahkan jabatan dan unit bawahannya terlebih dahulu.'}</p>}
        <KinerjaModal show={editing} busy={form.processing} onClose={() => setEditing(false)} title={`${form.data.id ? 'Edit' : 'Tambah'} jabatan penanggung jawab`} description="Perubahan nama dan unit diterapkan ke indikator yang memakai jabatan ini pada periode draft dan aktif. Periode ditutup serta arsip lama tetap tersimpan.">
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); form.post(route('kinerja.responsible'), { preserveScroll: true, onSuccess: () => setEditing(false) }); }}>
                <label className="block space-y-2 text-sm font-medium"><span>Nama jabatan *</span><input autoFocus required maxLength={255} className={input} value={form.data.name} onChange={e => form.setData('name', e.target.value)} /></label>
                <fieldset><legend className="mb-2 text-sm font-medium">Unit bawahan *</legend><input className={input} aria-label="Cari unit bawahan" placeholder="Cari unit…" value={unitSearch} onChange={e => setUnitSearch(e.target.value)} />
                    <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-2">{locations.filter(unit => unit.name.toLowerCase().includes(unitSearch.toLowerCase())).map(unit => <label key={unit.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"><input type="checkbox" className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900" checked={form.data.location_ids.includes(Number(unit.id))} onChange={e => form.setData('location_ids', e.target.checked ? [...form.data.location_ids, Number(unit.id)] : form.data.location_ids.filter(id => id !== Number(unit.id)))} /><span>{unit.name}</span></label>)}</div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{form.data.location_ids.length} unit dipilih</p>
                </fieldset>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900" checked={form.data.is_active} onChange={e => form.setData('is_active', e.target.checked)} />Jabatan aktif</label>
                {Object.keys(form.errors).length > 0 && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{Object.values(form.errors).map((error, i) => <p key={i}>{error}</p>)}</div>}
                <div className="flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-700"><button className={button} disabled={form.processing}>{form.processing ? 'Menyimpan…' : 'Simpan jabatan'}</button><button type="button" className={secondary} disabled={form.processing} onClick={() => setEditing(false)}>Batal</button></div>
            </form>
        </KinerjaModal>
    </section>;
}
