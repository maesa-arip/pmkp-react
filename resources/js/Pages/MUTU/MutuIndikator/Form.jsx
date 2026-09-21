import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import { CalculatorIcon, TagIcon } from "@heroicons/react/24/outline";

const inputClass = "block w-full min-w-0 rounded-lg border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

function Field({ id, label, error, children, className = "" }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
            {children}
            <div id={`${id}-error`}><InputError message={error} className="mt-1.5" /></div>
        </div>
    );
}

export default function Form({ errors, submit, data, setData, model, ShouldMap, closeButton, processing = false }) {
    const [year, setYear] = useState(Number(model?.tahun || ShouldMap.tahun || new Date().getFullYear()));
    const periods = ShouldMap.Periods || [];
    const period = periods.find(p => Number(p.tahun) === year);
    const findOption = (items, value) => (items || []).find(x => String(x.id) === String(value)) || { name: "" };
    // The same indicator name is used by several units, so the unit rides along as a badge.
    const indicators = (ShouldMap.IndikatorFitur4 || []).filter(x => String(x.periode_kinerja_id) === String(period?.id) && (x.is_active || String(x.id) === String(data.indikator_fitur4_id)))
        .map(x => ({ ...x, badge: x.unit_names || 'Unit belum diisi' }));
    const indicator = indicators.find(x => String(x.id) === String(data.indikator_fitur4_id));
    // The responsible person rides along as a badge instead of being glued to the name.
    const activities = (ShouldMap.IndikatorFitur3 || []).filter(x => String(x.periode_kinerja_id) === String(period?.id) && x.is_active)
        .map(x => ({ ...x, badge: x.penanggung_jawab || 'Penanggung jawab belum diisi' }));
    const activity = activities.find(x => String(x.id) === String(data.indikator_fitur3_id));
    const isNew = !model && Number(data.IndikatorBaru) === 1;

    useEffect(() => {
        setYear(Number(model?.tahun || ShouldMap.tahun || new Date().getFullYear()));
    }, [model?.id, model?.tahun, ShouldMap.tahun]);
    useEffect(() => {
        if (period && String(data.periode_kinerja_id) !== String(period.id)) setData('periode_kinerja_id', period.id);
    }, [period?.id, data.periode_kinerja_id]);

    const selectIndicator = indicator => setData({ ...data, indikator_fitur4_id: indicator.id, periode_kinerja_id: indicator.periode_kinerja_id });
    const select = (field, options, placeholder, onChange) => (
        <ComboboxPage
            inputId={field}
            emptyMessage={field === 'indikator_fitur4_id' ? `Tidak ada indikator aktif yang dapat Anda akses pada tahun ${year}. Periksa tahun atau pemetaan unit/tim kerja Anda.` : undefined}
            invalid={!!errors[field]}
            describedBy={errors[field] ? `${field}-error` : undefined}
            ShouldMap={options || []}
            selected={findOption(options, data[field])}
            onChange={onChange || (option => setData(field, option.id))}
            placeholder={placeholder}
            wrapOptions
        />
    );

    return (
        <div className="w-full min-w-0 space-y-5">
            <section aria-labelledby="mutu-information-title" className="relative z-20 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <header className="flex items-start gap-3 rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:px-5">
                    <TagIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
                    <div className="min-w-0">
                        <h3 id="mutu-information-title" className="text-sm font-bold text-slate-900 dark:text-white">Informasi Kamus Indikator</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Pilih indikator dan kategori mutu yang akan diukur.</p>
                    </div>
                </header>
                <div className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-5">
                    <Field id="mutu-year" label="Tahun indikator" error={errors.periode_kinerja_id}>
                        <p id="mutu-year" className="px-4 py-2.5 text-sm font-bold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{year}</p>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Mengikuti filter tahun pada daftar indikator mutu.</p>
                    </Field>
                    {!model && (
                        <Field id="IndikatorBaru" label="Buat indikator baru?" error={errors.IndikatorBaru} className="relative z-40">
                            {select('IndikatorBaru', ShouldMap.IndikatorBaru, 'Pilih jenis indikator')}
                        </Field>
                    )}
                    {isNew ? (
                        <>
                            <Field id="indikator" label="Nama indikator baru" error={errors.indikator} className="sm:col-span-2">
                                <TextInput id="indikator" value={data.indikator || ''} handleChange={e => setData('indikator', e.target.value)} className={inputClass} placeholder="Masukkan nama indikator mutu" />
                            </Field>
                            <Field id="indikator_fitur3_id" label="Kegiatan Kabag/Kabid (Fitur 3) *" error={errors.indikator_fitur3_id} className="relative z-30 sm:col-span-2">
                                {select('indikator_fitur3_id', activities, 'Cari dan pilih kegiatan induk')}
                                {activity && (
                                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-5">
                                        <span className="font-semibold text-slate-500 dark:text-slate-400">Penanggung jawab</span>
                                        <span className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold leading-4 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">{activity.badge}</span>
                                    </p>
                                )}
                                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Indikator baru wajib langsung ditempatkan di bawah satu kegiatan tahun {year}. Pemindahan berikutnya dilakukan di menu Indikator Tahunan &amp; Cascading.</p>
                                {activities.length === 0 && <p className="mt-2 text-xs leading-5 text-amber-600 dark:text-amber-400">Belum ada kegiatan Kabag/Kabid aktif pada tahun {year}.</p>}
                            </Field>
                        </>
                    ) : (
                        <Field id="indikator_fitur4_id" label="Indikator mutu" error={errors.indikator_fitur4_id} className="relative z-30 sm:col-span-2">
                            {select('indikator_fitur4_id', indicators, 'Cari dan pilih indikator mutu', selectIndicator)}
                            {indicator && <p className="mt-2 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">{indicator.name}</p>}
                            {indicator && (
                                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-5">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Unit</span>
                                    <span className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold leading-4 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">{indicator.badge}</span>
                                </p>
                            )}
                            {indicators.length === 0 && <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Tidak ada indikator aktif yang dapat Anda akses pada tahun {year}. Periksa tahun atau pemetaan unit/tim kerja Anda.</p>}
                        </Field>
                    )}
                    <Field id="mutu_kategori_id" label="Kategori mutu" error={errors.mutu_kategori_id} className="relative z-20 sm:col-span-2">
                        {select('mutu_kategori_id', ShouldMap.MutuKategori, 'Pilih kategori mutu')}
                    </Field>
                </div>
            </section>

            <section aria-labelledby="mutu-measurement-title" className="relative z-10 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <header className="flex items-start gap-3 rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50 sm:px-5">
                    <CalculatorIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
                    <div className="min-w-0">
                        <h3 id="mutu-measurement-title" className="text-sm font-bold text-slate-900 dark:text-white">Formula & Standar Pengukuran</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Lengkapi pembilang, penyebut, dan target pencapaian.</p>
                    </div>
                </header>
                <div className="space-y-5 p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field id="num_name" label="Numerator (pembilang)" error={errors.num_name}>
                            <TextAreaInput id="num_name" value={data.num_name || ''} handleChange={e => setData('num_name', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                        </Field>
                        <Field id="denum_name" label="Denominator (penyebut)" error={errors.denum_name}>
                            <TextAreaInput id="denum_name" value={data.denum_name || ''} handleChange={e => setData('denum_name', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                        </Field>
                    </div>
                    <fieldset className="min-w-0 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <legend className="pr-3 text-sm font-bold text-slate-900 dark:text-white">Target standar pencapaian</legend>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Field id="operator" label="Operator" error={errors.operator} className="relative z-20">
                                {select('operator', ShouldMap.Operator, 'Pilih operator')}
                            </Field>
                            <Field id="standar" label="Nilai target" error={errors.standar}>
                                <input id="standar" type="number" step="any" value={data.standar ?? ''} onChange={e => setData('standar', e.target.value)} className={`${inputClass} mt-1`} placeholder="Contoh: 100" aria-invalid={!!errors.standar || undefined} aria-describedby={errors.standar ? 'standar-error' : undefined} />
                            </Field>
                            <Field id="penyebut" label="Satuan / penyebut" error={errors.penyebut} className="relative z-10">
                                {select('penyebut', ShouldMap.Penyebut, 'Pilih satuan')}
                            </Field>
                        </div>
                    </fieldset>
                </div>
            </section>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeButton} disabled={processing} className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900">Batal</button>
                <button type="submit" disabled={processing} aria-busy={processing} className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:focus:ring-offset-slate-900">{processing ? 'Menyimpan...' : submit}</button>
            </footer>
        </div>
    );
}
