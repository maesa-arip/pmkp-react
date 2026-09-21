import DirectorActivities from './DirectorActivities';
import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import App from '@/Layouts/App';
import KinerjaSelect from './KinerjaSelect';
import KinerjaModal from './KinerjaModal';
const input='w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900';
const button='rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40';
export default function Performance({period,periods,activities,indicators,directorNodes=[]}){
 const [editing,setEditing]=useState(null);const [query,setQuery]=useState('');const [filter,setFilter]=useState('');
 const form=useForm({periode_kinerja_id:period?.id||'',level:2,activity_id:'',name:'',kode_cascading:''});
 const writable=period&&period.status!=='ditutup';
 const activityOf=row=>activities.find(a=>a.level===(row.indikator_fitur2_id?2:3)&&a.id===(row.indikator_fitur2_id||row.indikator_fitur3_id));
 const begin=(row={})=>{const a=activityOf(row);form.setData({periode_kinerja_id:period.id,level:a?.level||2,activity_id:a?.id||'',name:row.name||'',kode_cascading:row.kode_cascading||''});form.clearErrors();setEditing(row);};
 const rows=indicators.filter(r=>(!filter||String(r.indikator_fitur2_id?'2':'3')===filter)&&(!query||r.name.toLowerCase().includes(query.toLowerCase())));
 return <main className="space-y-6 text-slate-800 dark:text-slate-100"><Head title="Indikator Kinerja Kegiatan"/>
  <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">Indikator Kinerja Kegiatan</h1><p className="mt-2 text-sm text-slate-500">Kelola kegiatan dan indikator kinerja sesuai tanggung jawab pada tahun yang dipilih.</p></div><div className="flex gap-3"><a href={route('MutuIndikator.index',{tahun:period?.tahun})} className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">Indikator mutu unit / KATIM</a>{writable&&activities.length>0&&<button className={button} onClick={()=>begin()}>Tambah indikator kinerja</button>}</div></header>
  <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
   <div><label className="mb-2 block text-sm">Tahun</label><KinerjaSelect value={period?.tahun||''} onChange={tahun=>router.get(route('kinerja.performance.index'),{tahun})} options={periods.map(p=>({value:p.tahun,label:p.tahun+' · '+p.status}))}/></div>
   {activities.length>0&&<div><label className="mb-2 block text-sm">Kegiatan Wadir / Kabag / Kabid</label><KinerjaSelect value={filter} onChange={setFilter} options={[{value:'',label:'Semua kegiatan saya'},{value:'2',label:'Kegiatan Wadir'},{value:'3',label:'Kegiatan Kabag/Kabid'}]}/></div>}
   {activities.length>0&&<div><label htmlFor="performance-search" className="mb-2 block text-sm">Cari indikator</label><input id="performance-search" className={input} value={query} onChange={e=>setQuery(e.target.value)}/></div>}
  </section>
  {period && directorNodes.length > 0 && <DirectorActivities key={period.id} period={period} nodes={directorNodes} />}
  {(activities.length>0||!directorNodes.length)&&<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"><table className="w-full text-left text-sm"><thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4">Kegiatan induk</th><th className="p-4">Indikator kinerja</th><th className="p-4">Penanggung jawab</th>{writable&&<th className="p-4">Tindakan</th>}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{rows.map(r=><tr key={r.id}><td className="min-w-[220px] max-w-md p-4 align-top">{activityOf(r)?.name}<p className="mt-2 text-xs text-slate-500">{r.indikator_fitur2_id?'Wadir · fitur 2':'Kabag/Kabid · fitur 3'}</p></td><td className="min-w-[220px] max-w-md p-4 align-top"><span className="mb-1 block font-mono text-xs text-slate-500">{r.kode_cascading}</span>{r.name}</td><td className="p-4 align-top text-xs">{r.jabatan}</td>{writable&&<td className="p-4 align-top"><button className="font-semibold text-sky-600" onClick={()=>begin(r)}>Edit</button></td>}</tr>)}</tbody></table>{!rows.length&&<p className="p-8 text-center text-sm text-slate-500">Belum ada indikator kinerja untuk kegiatan yang dapat Anda kelola.</p>}</div>}
  <KinerjaModal show={editing!==null} onClose={()=>setEditing(null)} busy={form.processing} title={editing?.id?'Edit indikator kinerja':'Tambah indikator kinerja'}>
   <form className="space-y-4" onSubmit={e=>{e.preventDefault();const opts={preserveScroll:true,onSuccess:()=>setEditing(null)};editing.id?form.put(route('kinerja.performance.update',editing.id),opts):form.post(route('kinerja.performance.store'),opts);}}>
    <div><label className="mb-2 block text-sm">Tingkat kegiatan</label><KinerjaSelect value={form.data.level} onChange={v=>form.setData({...form.data,level:v,activity_id:''})} options={[{value:2,label:'Kegiatan Wadir (fitur 2)'},{value:3,label:'Kegiatan Kabag/Kabid (fitur 3)'}]}/></div>
    <div><label className="mb-2 block text-sm">Kegiatan induk</label><KinerjaSelect value={form.data.activity_id} onChange={v=>form.setData('activity_id',v)} options={[{value:'',label:'Pilih kegiatan'},...activities.filter(a=>a.level===Number(form.data.level)).map(a=>({value:a.id,label:a.name+' · '+a.jabatan}))]}/></div>
    <div><label htmlFor="performance-code" className="mb-2 block text-sm">Kode</label><input id="performance-code" className={input} value={form.data.kode_cascading} maxLength={50} onChange={e=>form.setData('kode_cascading',e.target.value)}/></div>
    <div><label htmlFor="performance-name" className="mb-2 block text-sm">Indikator kinerja</label><textarea id="performance-name" className={input} rows={3} required maxLength={255} value={form.data.name} onChange={e=>form.setData('name',e.target.value)}/></div>
    {Object.keys(form.errors).length>0&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{Object.values(form.errors).join(' ')}</p>}
    <div className="flex justify-end"><button className={button} disabled={form.processing||!form.data.activity_id}>Simpan</button></div>
   </form>
  </KinerjaModal>
 </main>;
}
Performance.layout=page=><App>{page}</App>;