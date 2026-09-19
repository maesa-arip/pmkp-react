import DirectorActivities from './DirectorActivities';
import FeatureIndicators, { featureIndicators } from './FeatureIndicators';
import { ikuColors, validColor, colorStyle } from './cascadingColors';
import React, { useEffect, useId, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowDownTrayIcon, ArrowPathIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, FolderOpenIcon, LockClosedIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, Squares2X2Icon, XMarkIcon } from '@heroicons/react/24/outline';
import App from '@/Layouts/App';
import CascadingChart from './CascadingChart';
import CascadingConcepts from './CascadingConcepts';
import useCascadingExport from './useCascadingExport';
import KinerjaSelect from './KinerjaSelect';
import KinerjaModal from './KinerjaModal';
import ResponsiblePositions from './ResponsiblePositions';
import { Disclosure } from '@headlessui/react';

const input = 'w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-400';
const action = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
const button = `${action} bg-sky-600 text-white shadow-sm hover:bg-sky-700`;
const secondary = `${action} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800`;
const panel = 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';
const muted = 'text-sm leading-relaxed text-slate-500 dark:text-slate-400';
const featureLevels = { 1: 'IKU Direktur (fitur 1)', 2: 'Kegiatan Wadir (fitur 2)', 3: 'Kegiatan Kabag/Kabid (fitur 3)', 4: 'Indikator mutu (fitur 4)' };
const parents = { 2: ['indikator_fitur1_id', '1'], 3: ['indikator_fitur2_id', '2'], 4: ['indikator_fitur3_id', '3'] };
const levelOrder = ['1', '2', '3', '4'];
const strategicLevels = { tujuan_strategis: 'Tujuan', program: 'Program', sasaran_strategis: 'Sasaran Strategis' };
const colorClasses = 'bg-[var(--iku-color)] text-[color:var(--iku-text)] dark:bg-[var(--iku-color)] dark:text-[color:var(--iku-text)]';
const ikuSurface = 'border border-[color:var(--iku-border)] bg-[var(--iku-surface)] text-inherit';
const ikuBlockStyle = color => {
    const style = colorStyle(color);
    if (!style) return undefined;
    const foreground = style['--iku-text'];
    return { ...style, '--iku-surface': foreground + '0F', '--iku-border': foreground + '33', '--iku-hover': foreground + '1F' };
};
const statusLabels = { draft: 'Draft', aktif: 'Aktif', ditutup: 'Ditutup' };
const Field = ({ label, children }) => {
    const id = useId();
    return <div className="min-w-0 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300"><label htmlFor={id} className="block">{label}</label>{React.cloneElement(children, { id })}</div>;
};
const Errors = ({ errors }) => Object.keys(errors).length > 0 && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">{Object.values(errors).map((v, i) => <p key={i}>{v}</p>)}</div>;
const Status = ({ status, tonal = false }) => <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tonal ? ikuSurface : status === 'aktif' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : status === 'draft' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabels[status] || 'Tidak aktif'}</span>;

export default function Index({ periods, period, nodes, locations, exports, cascadingTree = [], cascadingConcepts = [], cascadingIssues = [], unplacedIndicators = 0, responsiblePositions = [], pics = [], performanceIndicators = [] }) {
    const legacyFeatures = Number(period?.feature_schema_version || 1) !== 2;
    const levels = legacyFeatures ? {1: 'Sasaran (fitur 1)', 2: 'Program (fitur 2)', 3: 'Kegiatan (fitur 3)', 4: 'Indikator (fitur 4)'} : { ...featureLevels, ...strategicLevels };
    const navigationLevels = legacyFeatures ? levelOrder : [...Object.keys(strategicLevels), ...levelOrder];
    const { status: exportStatus, download: downloadExport, busy: exporting } = useCascadingExport(period?.id);
    const [indicatorSelection, setIndicatorSelection] = useState(null);
    const [level, setLevel] = useState('1');
    const strategicLevel = !legacyFeatures && Boolean(strategicLevels[level]);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const [tab, setTab] = useState('bagan');
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(!period);
    const [showMaster, setShowMaster] = useState(false);
    const [parentPath, setParentPath] = useState({});
    const create = useForm({ tahun: (periods[0]?.tahun || new Date().getFullYear()) + 1, source_period_id: period?.id || '' });
    const metadata = useForm({ nama_organisasi: period?.nama_organisasi || '', tujuan: period?.tujuan || '', status: period?.status || 'draft' });
    const node = useForm({});
    const mapping = useForm({ source_indicator_id: '', target_period_id: period?.id || '', target_indicator_id: '' });
    useEffect(() => {
        metadata.setData({ nama_organisasi: period?.nama_organisasi || '', tujuan: period?.tujuan || '', status: period?.status || 'draft' });
        mapping.setData({ source_indicator_id: '', target_period_id: period?.id || '', target_indicator_id: '' });
        create.setData('source_period_id', period?.id || '');
        setEditing(false);
        setIndicatorSelection(null);
        setPage(1);
    }, [period?.id, period?.status, period?.tujuan, period?.nama_organisasi]);
    useEffect(() => { setPage(1); }, [level, search]);
    useEffect(() => { setLevel('1'); }, [period?.id]);
    const begin = (item = {}) => {
        const selectedLevel = String(item.level || level);
        setLevel(selectedLevel);
        const path = {};
        let child = item;
        for (let parentLevel = Number(selectedLevel) - 1; parentLevel >= 1; parentLevel--) {
            const id = child?.['indikator_fitur'+parentLevel+'_id'] || '';
            path[parentLevel] = id;
            child = (nodes[parentLevel] || []).find(row => String(row.id) === String(id));
        }
        setParentPath(path);
        node.clearErrors();
        node.setData({ sasaran_baru: '', sasaran_strategis_id: item.sasaran_strategis_id || '', id: item.id || '', name: item.name || '', tujuan: item.tujuan || '', penanggung_jawab_id: item.penanggung_jawab_id || '', kode_cascading: item.kode_cascading || '', sort_order: item.sort_order || 0, is_active: item.is_active === undefined ? true : !!item.is_active,
            ...(selectedLevel === '1' ? { cascading_color: item.cascading_color || null } : {}),
            ...(parents[selectedLevel] ? { [parents[selectedLevel][0]]: item[parents[selectedLevel][0]] || '' } : {}) });
        setEditing(true);
    };
    const changeParent = (id, value) => {
        const path = {...parentPath, [id]: value};
        for (let child = Number(id) + 1; child < Number(level); child++) path[child] = '';
        setParentPath(path);
        node.setData(parents[level][0], path[Number(level)-1] || '');
    };
    const responsible = responsiblePositions.find(position => String(position.id) === String(node.data.penanggung_jawab_id));
    // An existing level-four indicator keeps its master's units; a new one takes them from the position.
    const editingRow = level === '4' && node.data.id ? (nodes['4'] || []).find(x => String(x.id) === String(node.data.id)) : null;
    const savedUnits = editingRow ? [].concat(typeof editingRow.location_id === 'string' ? JSON.parse(editingRow.location_id || '[]') : (editingRow.location_id ?? [])).map(Number) : null;
    const responsibleUnits = locations.filter(unit => (savedUnits ?? (responsible?.location_ids || []).map(Number)).includes(Number(unit.id)));
    const options = items => [{ value: '', label: 'Pilih indikator' }, ...(items || []).map(x => ({ value: x.id, label: `${x.display_code || x.kode_cascading || '#' + x.id} — ${x.name}` }))];
    const isDraft = period?.status === 'draft';
    const canEdit = isDraft || period?.status === 'aktif';
    const rows = (nodes[level] || []).filter(x => `${x.name} ${x.jabatan || ''} ${x.display_code || x.kode_cascading || ''} ${x.id}`.toLowerCase().includes(search.toLowerCase()));
    const pageCount = Math.max(1, Math.ceil(rows.length / 15));
    const currentPage = Math.min(page, pageCount);
    const visibleRows = rows.slice((currentPage - 1) * 15, currentPage * 15);
    const ikuBranches = Object.fromEntries(cascadingConcepts
        .filter(item => item.kind === 'iku' && item.legacy_table === 'indikator_fitur1s' && item.legacy_id)
        .map(item => [item.legacy_id, item.iku_branch]));
    const defaultIkuColor = id => ikuColors[ikuBranches[id]] || null;
    const ikuRowColor = item => !legacyFeatures && level === '1' ? validColor(item.cascading_color) || defaultIkuColor(item.id) : null;
    const editingColor = validColor(node.data.cascading_color) || defaultIkuColor(node.data.id) || '#FFFFFF';
    const conceptsById = Object.fromEntries(cascadingConcepts.map(item => [item.id, item]));
    const selectedGoal = cascadingConcepts.find(item => item.kind === 'sasaran_strategis' && item.legacy_table === 'sasaran_strategis' && String(item.legacy_id) === String(node.data.sasaran_strategis_id));
    const goalAncestors = [];
    let goalAncestor = selectedGoal;
    const visitedAncestors = new Set();
    while (goalAncestor && !visitedAncestors.has(goalAncestor.id)) {
        visitedAncestors.add(goalAncestor.id);
        goalAncestors.push(goalAncestor);
        goalAncestor = conceptsById[goalAncestor.parent_id];
    }
    const purposes = cascadingConcepts.filter(item => item.kind === 'tujuan_strategis');
    const purpose = goalAncestors.find(item => item.kind === 'tujuan_strategis') || (purposes.length === 1 ? purposes[0] : null);
    const parentProgram = goalAncestors.find(item => item.kind === 'program');
    const programs = parentProgram ? [parentProgram] : cascadingConcepts.filter(item => item.kind === 'program' && purpose && String(item.parent_id) === String(purpose.id));
    const levelCount = id => strategicLevels[id] ? cascadingConcepts.filter(item => item.kind === id).length : nodes[id]?.length || 0;
    const indicatorCount = levelOrder.reduce((sum, key) => sum + (nodes[key]?.length || 0), 0);
    const selectedIndicatorParent = indicatorSelection && (nodes[indicatorSelection.level] || []).find(item => item.id === indicatorSelection.id);
    return <div className="min-w-0 space-y-6 text-slate-800 dark:text-slate-100">
        <Head title="Indikator Tahunan dan Cascading" />
        <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div className="min-w-0 space-y-2"><p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Master data / Kinerja</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Indikator Tahunan & Cascading</h1><p className={muted}>Kelola sasaran dan indikator setiap tahun, lalu susun dokumen Cascading.</p></div>
            <div className="flex shrink-0 flex-wrap gap-2"><a className={secondary} href={route('kinerja.performance.index', {tahun: period?.tahun})}>Indikator kinerja kegiatan</a><button type="button" className={secondary} aria-expanded={showMaster} onClick={() => setShowMaster(!showMaster)}>Master penanggung jawab</button><button type="button" className={secondary} aria-expanded={showCreate} aria-controls="create-period" onClick={() => setShowCreate(!showCreate)}><PlusIcon className="h-4 w-4" />Buat tahun baru</button>{period && <button type="button" className={button} disabled={exporting} aria-busy={exporting} onClick={() => downloadExport(route('kinerja.export', period.id))}>{exporting && exportStatus.archiveId === null ? <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />}{exporting && exportStatus.archiveId === null ? 'Menyiapkan Excel…' : 'Ekspor Cascading'}</button>}</div>
        </header>
        {exportStatus && <div role={exportStatus.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${exportStatus.type === 'error' ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200' : exportStatus.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200' : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-900/20 dark:text-sky-200'}`}>
            {exporting && <ArrowPathIcon className="mt-0.5 h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />}<p>{exportStatus.message}</p>
        </div>}
        {selectedIndicatorParent && <FeatureIndicators key={period.id + '-' + indicatorSelection.level + '-' + indicatorSelection.id} level={indicatorSelection.level} item={selectedIndicatorParent} indicators={performanceIndicators} period={period} onClose={() => setIndicatorSelection(null)} onEditNode={begin} />}
        {showMaster && <ResponsiblePositions positions={responsiblePositions} locations={locations} pics={pics} />}
            {editing && canEdit && <KinerjaModal show={editing} busy={node.processing} onClose={() => setEditing(false)} title={(node.data.id ? 'Edit ' : 'Tambah ') + levels[level].toLowerCase()} description={'Perubahan disimpan pada ' + (isDraft ? 'draft' : 'periode aktif') + ' tahun ' + period.tahun + '.'}><form className="space-y-5" onSubmit={e => { e.preventDefault(); node.post(route('kinerja.nodes', [period.id, level]), { preserveScroll: true, onSuccess: () => setEditing(false) }); }}>
                <div className="grid gap-3 md:grid-cols-2">
                    {level === '1' && !legacyFeatures && <div className="space-y-4 md:col-span-2">
                        <Field label="Tujuan"><textarea readOnly rows={2} className={`${input} bg-slate-50 dark:bg-slate-800/50`} value={purpose?.name || period.tujuan || ''} placeholder="Tujuan belum tersedia" /></Field>
                        <Field label="Program"><textarea readOnly rows={2} className={`${input} bg-slate-50 dark:bg-slate-800/50`} value={programs.map(item => item.name).join('\n')} placeholder="Program belum tersedia" /></Field>
                        <Field label="Sasaran Strategis"><KinerjaSelect value={node.data.sasaran_strategis_id} onChange={v => node.setData('sasaran_strategis_id', v)} options={[{ value: '', label: 'Pilih Sasaran Strategis' }, ...(nodes.sasaran || []).map(item => ({ value: item.id, label: item.name }))]} /></Field>
                        {!node.data.sasaran_strategis_id && isDraft && <Field label="Sasaran Strategis baru (jika belum tersedia)"><textarea rows={2} className={input} maxLength={255} value={node.data.sasaran_baru} onChange={e => node.setData('sasaran_baru', e.target.value)} /></Field>}
                    </div>}
                    <div className="md:col-span-2"><Field label={['2', '3'].includes(level) ? 'Nama kegiatan *' : level === '1' ? 'Nama indikator kinerja utama *' : 'Nama indikator mutu *'}><textarea autoFocus rows={3} className={input} value={node.data.name} maxLength={255} onChange={e => node.setData('name', e.target.value)} required /></Field></div>
                    <div className="min-w-0 space-y-2"><Field label={level === '4' && !node.data.id ? 'Jabatan penanggung jawab *' : 'Jabatan penanggung jawab'}><KinerjaSelect value={node.data.penanggung_jawab_id} onChange={value => node.setData('penanggung_jawab_id', value)} options={[{value:'',label:'Pilih jabatan'}, ...responsiblePositions.filter(position => position.is_active || String(position.id) === String(node.data.penanggung_jawab_id)).map(position => ({value:position.id,label:position.name + (position.is_active ? '' : ' (tidak aktif)'),disabled:!position.is_active}))]} /></Field><button type="button" className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400" onClick={() => { setEditing(false); setShowMaster(true); }}>Atur master penanggung jawab</button></div>
                    <Field label="Kode Cascading khusus (opsional)"><input className={input} placeholder="Kosongkan untuk kode otomatis" value={node.data.kode_cascading} onChange={e => node.setData('kode_cascading', e.target.value)} /></Field>
                    {level === '1' && !legacyFeatures && <div className="space-y-2 md:col-span-2">
                        <label htmlFor="iku-color" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Warna IKU / Ekspor Cascading</label>
                        <div className="flex flex-wrap items-center gap-3">
                            <input id="iku-color" type="color" value={editingColor} onChange={event => node.setData('cascading_color', event.target.value.toUpperCase())} className="h-11 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900" />
                            <span style={colorStyle(editingColor)} className={`rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm ${colorClasses}`}>{editingColor}</span>
                            <button type="button" className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300" onClick={() => node.setData('cascading_color', null)}>Gunakan warna bawaan</button>
                        </div>
                        <p className={muted}>Warna ini digunakan pada IKU dan bagian cabangnya yang berwarna saat Ekspor Cascading. Simpan perubahan sebelum mengekspor.</p>
                    </div>}
                    <Field label="Urutan tampil"><input type="number" min="0" className={input} value={node.data.sort_order} onChange={e => node.setData('sort_order', e.target.value)} /></Field>
                    {parents[level] && <fieldset className="min-w-0 space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 md:col-span-2"><legend className="px-1 text-sm font-semibold">Indikator induk mulai dari fitur 1</legend>{levelOrder.filter(id => Number(id) < Number(level)).map(id => {
                        const available = (nodes[id] || []).filter(item => (isDraft || item.is_active) && (id === '1' || String(item['indikator_fitur'+(Number(id)-1)+'_id']) === String(parentPath[Number(id)-1])));
                        return <Field key={id} label={levels[id] + ' *'}><KinerjaSelect value={parentPath[id] || ''} disabled={id !== '1' && !parentPath[Number(id)-1]} onChange={value => changeParent(id, value)} options={options(available)} /></Field>;
                    })}</fieldset>}
                    {level === '4' && <section aria-label="PIC dan unit yang dapat memakai indikator" className="min-w-0 rounded-xl bg-sky-50 p-4 dark:bg-sky-900/20 md:col-span-2"><h4 className="text-sm font-semibold">PIC dan unit yang dapat memakai indikator</h4><p className={muted}>{editingRow ? 'Unit indikator tetap sama di setiap tahun dan tidak berubah saat penanggung jawab diganti.' : 'PIC jabatan pemilik indikator dan unit pelaksana yang diatur pada master dapat memakai indikator ini.'}</p>{responsible?.pic_id && <p className="mt-2 text-sm font-medium text-sky-700 dark:text-sky-300">PIC jabatan: {responsible.name}</p>}{responsibleUnits.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{responsibleUnits.map(unit => <li key={unit.id} className="rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm dark:border-sky-900 dark:bg-slate-900">{unit.name}</li>)}</ul> : <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400">{node.data.penanggung_jawab_id ? (responsible?.pic_id ? 'Belum ada tambahan unit pelaksana.' : 'Hubungkan PIC jabatan atau lengkapi unit pelaksana sebelum menyimpan.') : 'Pilih penanggung jawab untuk menampilkan unit.'}</p>}</section>}
                </div>
                <p className={muted}>Kode otomatis mengikuti induk dan urutan: 1 → 1.1 → 1.1.a → 1.1.a.1. Isi kode khusus untuk mengikuti penomoran dokumen, misalnya 1.1.b.</p>
                <label className="flex items-center gap-2.5 text-sm"><input className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900" type="checkbox" checked={node.data.is_active} onChange={e => node.setData('is_active', e.target.checked)} />Indikator aktif</label>
                <Errors errors={node.errors} /><div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"><button className={button} disabled={node.processing || (level === '4' && !responsibleUnits.length && !responsible?.pic_id)}>{node.processing ? 'Menyimpan…' : 'Simpan indikator'}</button><button type="button" className={secondary} disabled={node.processing} onClick={() => setEditing(false)}>Batal</button></div>
            </form></KinerjaModal>}
        {showCreate && <section id="create-period" className={`${panel} border-sky-200 p-5 dark:border-sky-900 sm:p-6`}>
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="font-semibold">Siapkan periode tahun baru</h2><p className={`mt-1 ${muted}`}>Salin struktur tahun sebelumnya atau mulai kosong. Periode baru disimpan sebagai draft.</p></div><button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-800" aria-label="Tutup formulir tahun baru" onClick={() => setShowCreate(false)}><XMarkIcon className="h-5 w-5" /></button></div>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); create.post(route('kinerja.store'), { onSuccess: () => setShowCreate(false) }); }}>
                <div className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-3"><Field label="Tahun baru"><input className={input} type="number" min="2000" max="2100" value={create.data.tahun} onChange={e => create.setData('tahun', e.target.value)} required /></Field><Field label="Salin hierarki dari"><KinerjaSelect value={create.data.source_period_id} onChange={value => create.setData('source_period_id', value)} options={[{ value: '', label: 'Mulai kosong' }, ...periods.map(p => ({ value: p.id, label: `${p.tahun} — ${statusLabels[p.status]}` }))]} /></Field><button className={`${button} justify-self-start`} disabled={create.processing}><PlusIcon className="h-4 w-4" />{create.processing ? 'Membuat draft…' : 'Buat draft'}</button></div><Errors errors={create.errors} />
            </form>
        </section>}
        <section className={panel}>
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-center gap-4"><div className="hidden rounded-2xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 sm:block"><CalendarDaysIcon className="h-7 w-7" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold">{period ? `Periode ${period.tahun}` : 'Pilih periode kinerja'}</h2>{period && <Status status={period.status} />}</div><p className={`mt-1 break-words ${muted}`}>{period?.nama_organisasi || 'Sasaran dan indikator dikelompokkan berdasarkan tahun.'}</p></div></div><div className="w-full shrink-0 lg:w-52"><Field label="Tahun data"><KinerjaSelect value={period?.tahun || ''} placeholder="Pilih tahun" onChange={value => router.get(route('kinerja.index'), { tahun: value })} options={periods.map(p => ({ value: p.tahun, label: `${p.tahun} — ${statusLabels[p.status]}` }))} /></Field></div></div>
            {period && <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/30">{[{ label: cascadingConcepts.length ? 'Indikator Kinerja Utama' : 'Sasaran (fitur 1)', count: cascadingConcepts.length ? cascadingConcepts.filter(n => n.kind === 'iku').length : nodes['1']?.length || 0 }, { label: 'Total data hierarki', count: cascadingConcepts.length || indicatorCount }, { label: 'Arsip tersedia', count: exports.length }].map(({ label, count }) => <div key={label} className="p-3 sm:px-6 sm:py-4"><p className="text-xl font-bold tabular-nums">{count.toLocaleString('id-ID')}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p></div>)}</div>}
        </section>
        {period?.rekonstruksi && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200"><p className="font-semibold">Data historis perlu verifikasi</p>{period.rekonstruksi && <p className="mt-1">Periode ini direkonstruksi dari master sebelumnya. Cocokkan redaksi indikator dengan arsip tahun asal.</p>}</div>}
        {!period && <div className={`${panel} px-6 py-14 text-center`}><CalendarDaysIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" /><h2 className="mt-4 text-lg font-semibold">Periode belum tersedia</h2><p className={`mx-auto mt-2 max-w-md ${muted}`}>Pilih tahun yang sudah tersedia atau buat periode baru untuk mulai menyusun indikator.</p><button type="button" className={`${button} mt-5`} onClick={() => setShowCreate(true)}><PlusIcon className="h-4 w-4" />Buat tahun baru</button></div>}
        {period && <>
            <Disclosure key={`${period.id}-${isDraft}`} as="section" className={panel} defaultOpen={isDraft}>
                {({ open }) => <>
                <Disclosure.Button className="flex w-full items-center justify-between gap-3 rounded-2xl p-5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-800"><div><h2 className="font-semibold">Informasi & status periode</h2><p className={`mt-1 ${muted}`}>{isDraft ? 'Lengkapi tujuan dan hierarki sebelum mengaktifkan periode.' : 'Lihat tujuan organisasi dan pengaturan status periode.'}</p></div><ChevronRightIcon className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} /></Disclosure.Button>
            <Disclosure.Panel>
            <form className="space-y-5 border-t border-slate-200 p-5 dark:border-slate-800" onSubmit={e => { e.preventDefault(); metadata.put(route('kinerja.update', period.id)); }}>
                <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Nama organisasi"><input className={input} value={metadata.data.nama_organisasi} disabled={!isDraft} onChange={e => metadata.setData('nama_organisasi', e.target.value)} /></Field>
                <Field label="Tujuan organisasi"><textarea rows={3} className={input} value={metadata.data.tujuan} disabled={!isDraft} onChange={e => metadata.setData('tujuan', e.target.value)} placeholder="Tujuan yang ditampilkan pada dokumen Cascading" /></Field>
                </div>
                {period.status !== 'ditutup' && <div className="flex flex-wrap items-end gap-3"><div className="w-full sm:w-60"><Field label="Status"><KinerjaSelect value={metadata.data.status} onChange={value => metadata.setData('status', value)} options={isDraft ? [{ value: 'draft', label: 'Draft' }, { value: 'aktif', label: 'Aktif' }] : [{ value: 'aktif', label: 'Aktif' }, { value: 'ditutup', label: 'Ditutup (baca saja)' }]} /></Field></div><button className={button} disabled={metadata.processing || (!isDraft && metadata.data.status !== 'ditutup')}>Simpan periode</button></div>}
                <Errors errors={metadata.errors} />
                <p className={muted}>{isDraft ? 'Setelah aktif, periode dapat digunakan untuk transaksi dan indikator yang sudah ada tetap dapat diedit.' : 'Periode yang ditutup menjadi baca saja dan tidak dapat dibuka kembali melalui halaman ini.'}</p>
            </form>
            </Disclosure.Panel>
                </>}
            </Disclosure>
            <nav aria-label="Bagian pengelolaan indikator" className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">{[{ id: 'bagan', label: 'Bagan Cascading', icon: Squares2X2Icon }, { id: 'fitur', label: 'Fitur 1–4', icon: Squares2X2Icon }, { id: 'pemetaan', label: 'Pemetaan copy', icon: ArrowPathIcon }, { id: 'arsip', label: 'Arsip Cascading', icon: FolderOpenIcon }].map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition focus-visible:outline-sky-500 ${tab === id ? 'border-sky-600 text-sky-700 dark:border-sky-400 dark:text-sky-400' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
            {unplacedIndicators > 0 && <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-200"><p className="font-semibold">{unplacedIndicators} indikator mutu unit belum ditempatkan di kegiatan</p><p className="mt-1">Indikator ini sudah bisa dipakai input risiko dan MUTU tahun {period.tahun}. Tempatkan di bawah kegiatan Fitur 3 melalui tab Fitur 1–4 agar tampil di bagan.</p></div>}
            {cascadingIssues.length > 0 && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"><p className="font-semibold">{cascadingIssues.length} data aktif belum terhubung ke bagan</p><p className="mt-1">Perbaiki induk yang tidak aktif atau belum tersedia melalui tab Fitur 1–4 sebelum ekspor.</p><ul className="mt-2 list-inside list-disc">{cascadingIssues.slice(0, 10).map(item => <li key={`${item.level}-${item.id}`}>Fitur {item.level} #{item.id}: {item.name}</li>)}</ul></div>}
            {tab === 'bagan' && (cascadingConcepts.length ? <CascadingConcepts key={period.id} nodes={cascadingConcepts} period={period} mode="tree" /> : <CascadingChart key={period.id} tree={cascadingTree} period={period} onEdit={canEdit ? begin : undefined} />)}

            {tab === 'fitur' && <section className="grid min-w-0 gap-5 xl:grid-cols-[210px_minmax(0,1fr)]">
                <aside className="min-w-0"><div className={`${panel} p-3`}><p className="mb-3 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Tingkat hierarki</p><div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">{navigationLevels.map(id => <button type="button" key={id} aria-pressed={level === id} onClick={() => { setLevel(id); setEditing(false); setSearch(''); }} className={`flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-sm transition focus-visible:outline-sky-500 ${level === id ? 'bg-sky-50 font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}><span>{levels[id]}</span><span className={`rounded-md px-2 py-0.5 text-xs tabular-nums ${level === id ? 'bg-sky-100 dark:bg-sky-900' : 'bg-slate-100 dark:bg-slate-800'}`}>{levelCount(id)}</span></button>)}</div></div></aside>
                <div className="min-w-0 space-y-4">
            {!canEdit && <div className="flex gap-2.5 rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"><LockClosedIcon className="mt-0.5 h-4 w-4 shrink-0" /><p>Periode tahun {period.tahun} sudah ditutup. Indikator bersifat baca saja.</p></div>}

            {strategicLevel ? <CascadingConcepts key={period.id + '-' + level} nodes={cascadingConcepts} period={period} mode="table" kindFilter={level} /> : <div className={`${panel} overflow-hidden`}>
                <div className="space-y-4 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">{levels[level]}</h2><p className={`mt-1 ${muted}`}>{nodes[level]?.length || 0} data pada periode {period.tahun}.{level !== '1' && ' Klik jumlah indikator untuk melihat dan mengedit indikatornya.'}</p></div>{isDraft && <button type="button" className={button} onClick={() => begin()}><PlusIcon className="h-4 w-4" />Tambah</button>}</div><div className="relative"><MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" /><input className={`${input} pl-10`} aria-label="Cari indikator" placeholder="Cari nama, jabatan, kode, atau ID…" value={search} onChange={e => setSearch(e.target.value)} /></div></div>
                <div className="relative overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{levels[level]} tahun {period.tahun}</caption><thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"><tr><th scope="col" className="px-5 py-3">Nama / Kode Cascading</th>{!['1', '4'].includes(level) && <th scope="col" className="px-4 py-3">Indikator kinerja</th>}<th scope="col" className="px-4 py-3">Penanggung jawab</th><th scope="col" className="px-4 py-3">Status</th>{canEdit && <th scope="col" className="px-4 py-3"><span className="sr-only">Tindakan</span></th>}</tr></thead><tbody className={!legacyFeatures && level === '1' ? '' : 'divide-y divide-slate-100 dark:divide-slate-800'}>{visibleRows.map(x => <tr key={x.id} style={ikuBlockStyle(ikuRowColor(x))} className={`transition ${ikuRowColor(x) ? colorClasses + ' border-b border-[color:var(--iku-border)] last:border-b-0' : 'border-b border-slate-100 last:border-b-0 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'}`}><td className="min-w-[220px] px-5 py-4 align-top"><div className={`mb-1.5 flex flex-wrap items-center gap-2 text-xs ${ikuRowColor(x) ? 'text-inherit' : 'text-slate-400'}`}><span className={ikuRowColor(x) ? 'opacity-70' : undefined}>#{x.id}</span>{(x.display_code || x.kode_cascading) && <span className={`rounded-md px-2 py-0.5 font-medium ${ikuRowColor(x) ? ikuSurface : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{x.display_code || x.kode_cascading}</span>}</div><p className="max-w-xl whitespace-normal break-words font-medium leading-relaxed">{x.name}</p></td>{!['1', '4'].includes(level) && <td className="px-4 py-4 align-top"><button type="button" className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-500 ${ikuRowColor(x) ? 'dark:bg-sky-50 dark:text-sky-700 dark:hover:bg-sky-100' : 'dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/40'}`} aria-label={'Lihat indikator ' + x.name} onClick={() => setIndicatorSelection({ level, id: x.id })}>{featureIndicators(level, x, performanceIndicators, legacyFeatures).length} {legacyFeatures ? 'data historis' : level === '4' ? 'indikator mutu' : level === '1' ? 'IKU' : 'indikator kinerja'}</button></td>}<td className={`min-w-[160px] px-4 py-4 align-top ${ikuRowColor(x) ? 'text-inherit' : 'text-slate-600 dark:text-slate-400'}`}><p className="max-w-xs whitespace-normal break-words leading-relaxed">{x.jabatan || <span className={`italic ${ikuRowColor(x) ? 'text-inherit' : 'text-slate-400'}`}>Belum diisi</span>}</p></td><td className="px-4 py-4 align-top"><Status status={x.is_active ? 'aktif' : 'nonaktif'} tonal={Boolean(ikuRowColor(x))} /></td>{canEdit && <td className="px-4 py-4 align-top"><button type="button" className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${ikuRowColor(x) ? ikuSurface + ' hover:bg-[var(--iku-hover)] focus-visible:ring-[color:var(--iku-text)]' : 'text-sky-600 hover:bg-sky-50 focus-visible:ring-sky-500 dark:text-sky-400 dark:hover:bg-sky-900/30'}`} aria-label={`Edit ${x.name}`} onClick={() => begin(x)}><PencilSquareIcon className="h-4 w-4" />{['2', '3'].includes(level) ? 'Edit kegiatan' : 'Edit'}</button></td>}</tr>)}</tbody></table></div>
                {rows.length === 0 && <div className="px-5 py-12 text-center"><MagnifyingGlassIcon className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" /><p className="mt-3 font-semibold">{search ? 'Indikator tidak ditemukan' : 'Belum ada data pada tingkat ini'}</p><p className={`mt-1 ${muted}`}>{search ? 'Coba kata kunci lain atau kosongkan pencarian.' : isDraft ? 'Gunakan tombol Tambah untuk menyusun hierarki periode ini.' : 'Pilih tingkat hierarki lain untuk melihat indikator.'}</p>{search && <button type="button" className="mt-3 text-sm font-semibold text-sky-600 dark:text-sky-400" onClick={() => setSearch('')}>Hapus pencarian</button>}</div>}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800"><p className="text-xs text-slate-500 dark:text-slate-400">{rows.length ? `${(currentPage - 1) * 15 + 1}–${Math.min(currentPage * 15, rows.length)} dari ${rows.length} data` : '0 data'}</p><div className="flex items-center gap-2"><button type="button" className={`${secondary} p-2`} aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeftIcon className="h-4 w-4" /></button><span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{currentPage} / {pageCount}</span><button type="button" className={`${secondary} p-2`} aria-label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRightIcon className="h-4 w-4" /></button></div></div>
            </div>}
            {!legacyFeatures && level === '1' && <DirectorActivities key={period.id} period={period} nodes={cascadingConcepts} />}
            </div></section>}
            {tab === 'pemetaan' && <section className={`${panel} p-5 sm:p-6`}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h2 className="text-lg font-semibold">Pemetaan indikator pengganti</h2><p className={`mt-2 max-w-2xl ${muted}`}>Hubungkan indikator sumber dengan indikator tahun {period.tahun} jika indikator berubah. Gunakan ID sumber dari preview copy risk register.</p></div><a className={`${secondary} shrink-0`} href={route('riskRegisterCopy.index')}>Buka copy risiko</a></div>
                {period.status === 'ditutup' ? <div className="mt-6 flex gap-3 rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"><LockClosedIcon className="h-5 w-5 shrink-0" />Periode sudah ditutup. Pemetaan indikator tidak dapat diubah.</div> : <form className="mt-6 space-y-5" onSubmit={e => { e.preventDefault(); mapping.post(route('kinerja.mapping')); }}><div className="grid items-end gap-4 lg:grid-cols-3"><Field label="ID indikator sumber"><input required min="1" type="number" className={input} placeholder="ID dari preview copy" value={mapping.data.source_indicator_id} onChange={e => mapping.setData('source_indicator_id', e.target.value)} /></Field><div className="min-w-0 lg:col-span-2"><Field label={`Indikator tujuan ${period.tahun}`}><KinerjaSelect value={mapping.data.target_indicator_id} onChange={value => mapping.setData('target_indicator_id', value)} options={options((nodes['4'] || []).filter(x => x.is_active))} /></Field></div></div><p className={muted}>Pemetaan berlaku untuk copy berikutnya. Risk register yang sudah tersimpan tetap menggunakan indikatornya.</p><Errors errors={mapping.errors} /><button className={button} disabled={mapping.processing}><ArrowPathIcon className="h-4 w-4" />{mapping.processing ? 'Menyimpan…' : 'Simpan pemetaan'}</button></form>}
            </section>}
            {tab === 'arsip' && <section className={`${panel} overflow-hidden`}><div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6"><h2 className="text-lg font-semibold">Arsip Cascading {period.tahun}</h2><p className={`mt-2 ${muted}`}>Unduh kembali dokumen dengan data yang tersimpan saat ekspor dibuat. Menampilkan hingga 20 arsip terbaru.</p></div>{exports.length ? <ul className="divide-y divide-slate-100 dark:divide-slate-800">{exports.map(x => <li key={x.id} className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><FolderOpenIcon className="h-5 w-5" /></div><div><p className="text-sm font-semibold">Cascading {period.tahun} <span className="font-normal text-slate-400">#{x.id}</span></p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{x.created_at} · Excel</p></div></div><button type="button" className={secondary} disabled={exporting} aria-busy={exporting && exportStatus.archiveId === x.id} onClick={() => downloadExport(route('kinerja.exportArchive', x.id), x.id)}>{exporting && exportStatus.archiveId === x.id ? <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />}{exporting && exportStatus.archiveId === x.id ? 'Menyiapkan Excel…' : 'Unduh'}</button></li>)}</ul> : <div className="px-5 py-12 text-center"><FolderOpenIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" /><h3 className="mt-4 font-semibold">Belum ada arsip ekspor</h3><p className={`mt-2 ${muted}`}>Buat ekspor pertama untuk menyimpan dokumen Cascading periode ini.</p><button type="button" className={`${button} mt-5`} disabled={exporting} aria-busy={exporting} onClick={() => downloadExport(route('kinerja.export', period.id))}>{exporting && exportStatus.archiveId === null ? <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />}{exporting && exportStatus.archiveId === null ? 'Menyiapkan Excel…' : 'Ekspor Cascading'}</button></div>}</section>}
        </>}
    </div>;
}
Index.layout = page => <App>{page}</App>;
