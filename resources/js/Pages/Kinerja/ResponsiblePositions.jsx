import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import KinerjaModal from './KinerjaModal';
import KinerjaSelect from './KinerjaSelect';

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
const button = 'rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50';
const secondary = 'rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800';

export default function ResponsiblePositions({ positions, locations, pics = [] }) {
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [unitSearch, setUnitSearch] = useState('');
    const form = useForm({ id: '', name: '', is_active: true, location_ids: [], pic_id: '', parent_id: '', can_use_descendant_indicators: false });
    const begin = (position = {}) => {
        form.clearErrors();
        form.setData({
            id: position.id || '', name: position.name || '', is_active: position.is_active === undefined ? true : !!position.is_active,
            location_ids: (position.location_ids || []).map(Number), pic_id: position.pic_id || '', parent_id: position.parent_id || '',
            can_use_descendant_indicators: !!position.can_use_descendant_indicators,
        });
        setUnitSearch('');
        setEditing(true);
    };
    const unitNames = ids => locations.filter(unit => ids.map(Number).includes(Number(unit.id))).map(unit => unit.name);
    const rows = positions.filter(position => (position.name + ' ' + unitNames(position.location_ids).join(' ')).toLowerCase().includes(search.toLowerCase()));
    const linkedPic = pics.find(pic => String(pic.id) === String(form.data.pic_id));
    const selectPic = id => form.setData({
        ...form.data, pic_id: id, name: pics.find(pic => String(pic.id) === String(id))?.name || form.data.name,
        can_use_descendant_indicators: id ? form.data.can_use_descendant_indicators : false,
    });
    return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Master jabatan penanggung jawab</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">Hubungkan jabatan dengan PIC yang sudah ada. Atur atasan, akses indikator bawahan, dan unit pelaksana. PIC unit seperti Instalasi Farmasi tetap dapat menjadi pelaksana.</p></div><button type="button" className={button} onClick={() => begin()}>Tambah jabatan</button></div>
        <input className={input} aria-label="Cari jabatan atau unit" placeholder="Cari jabatan atau unit…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="grid gap-3 lg:grid-cols-2">{rows.map(position => <article key={position.id} className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3"><div><h3 className="break-words font-semibold">{position.name}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{position.is_active ? 'Aktif' : 'Tidak aktif'} · {position.pic_id ? 'PIC jabatan terhubung' : 'PIC jabatan belum dihubungkan'}</p></div><button type="button" className={secondary} aria-label={'Edit jabatan ' + position.name} onClick={() => begin(position)}>Edit</button></div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Atasan: {positions.find(parent => String(parent.id) === String(position.parent_id))?.name || 'Belum diatur'}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Akses indikator bawahan: {position.can_use_descendant_indicators ? 'Diizinkan' : 'Belum diizinkan'}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Unit pelaksana: {unitNames(position.location_ids).join(', ') || 'Belum ditambahkan'}</p>
        </article>)}</div>
        {!rows.length && <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">{search ? 'Tidak ada jabatan yang sesuai pencarian.' : 'Belum ada master jabatan. Tambahkan jabatan dan hubungkan PIC yang sesuai.'}</p>}
        <KinerjaModal show={editing} busy={form.processing} onClose={() => setEditing(false)} title={(form.data.id ? 'Edit' : 'Tambah') + ' jabatan penanggung jawab'} description="Perubahan diterapkan pada indikator periode draft dan aktif. Riwayat risiko dan arsip periode ditutup tetap tersimpan.">
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); form.post(route('kinerja.responsible'), { preserveScroll: true, onSuccess: () => setEditing(false) }); }}>
                <div className="space-y-2"><label htmlFor="position-pic" className="block text-sm font-medium">PIC jabatan</label><KinerjaSelect id="position-pic" value={form.data.pic_id} onChange={selectPic} options={[{ value: '', label: 'Belum dihubungkan' }, ...pics.filter(pic => !positions.some(position => String(position.id) !== String(form.data.id) && String(position.pic_id) === String(pic.id))).map(pic => ({ value: pic.id, label: pic.name + ' (#' + pic.id + ')' }))]} /><p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Pilih PIC yang mewakili jabatan ini, misalnya Wakil Direktur. Akun yang memakai PIC tersebut dapat memilih indikator milik jabatan ini. Unit Farmasi dipilih pada cakupan unit pelaksana.</p></div>
                <label className="block space-y-2 text-sm font-medium"><span>Nama jabatan *</span><input required readOnly={!!linkedPic} maxLength={255} className={input + (linkedPic ? ' bg-slate-50 dark:bg-slate-800' : '')} value={form.data.name} onChange={e => form.setData('name', e.target.value)} />{linkedPic && <span className="block text-xs font-normal text-slate-500">Nama mengikuti master PIC yang dihubungkan.</span>}</label>
                <div className="space-y-2"><label htmlFor="position-parent" className="block text-sm font-medium">Atasan langsung</label><KinerjaSelect id="position-parent" value={form.data.parent_id} onChange={id => form.setData('parent_id', id)} options={[{ value: '', label: 'Tanpa atasan / belum diatur' }, ...positions.filter(position => String(position.id) !== String(form.data.id)).map(position => ({ value: position.id, label: position.name, disabled: !position.is_active }))]} /></div>
                <label className="flex items-start gap-3 rounded-xl bg-sky-50 p-4 text-sm dark:bg-sky-900/20"><input type="checkbox" disabled={!form.data.pic_id} className="mt-1 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900" checked={form.data.can_use_descendant_indicators} onChange={e => form.setData('can_use_descendant_indicators', e.target.checked)} /><span><span className="block font-medium">Izinkan PIC jabatan ini memakai indikator jabatan bawahan</span><span className="mt-1 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">Mengikuti atasan langsung yang telah diatur, termasuk seluruh tingkat bawahan aktif. Pengaturan ini mengatur pilihan indikator; hak melihat risk register tetap mengikuti izin akun.</span></span></label>
                <fieldset><legend className="mb-2 text-sm font-medium">Cakupan unit pelaksana</legend><p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">PIC pada unit yang dicentang dapat memakai indikator fitur 4 milik jabatan ini. Boleh kosong jika PIC jabatan sudah dihubungkan.</p><input className={input} aria-label="Cari unit pelaksana" placeholder="Cari unit…" value={unitSearch} onChange={e => setUnitSearch(e.target.value)} />
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
