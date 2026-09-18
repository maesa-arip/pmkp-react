import React, { useId } from 'react';
import { usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from '@/Components/ui/Select';
import ComboboxPage from '@/Components/ComboboxPage';
import InputError from '@/Components/InputError';

export default function RiskRegisterAnnualFields({ data, setData, errors, indicators = [], model, inputClass, labelClass }) {
    const { annualPeriods = [] } = usePage().props;
    const id = useId();
    const year = data.tahun ?? (data.tgl_register ? String(data.tgl_register).slice(0, 4) : '');
    const period = annualPeriods.find(p => String(p.tahun) === String(year));
    const writable = period?.status === 'aktif';
    const options = year ? indicators.filter(item => Number(item.tahun) === Number(year) &&
        ((item.is_active && item.can_select !== false) || item.id === model?.indikator_fitur4_id)) : [];
    const date = data.tgl_register ? new Date(String(data.tgl_register).slice(0, 10) + 'T00:00:00') : null;
    const statuses = { aktif: 'Aktif', draft: 'Draft', ditutup: 'Ditutup' };

    return <>
        <div className="relative z-[70] col-span-12 rounded-xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
            <label htmlFor={id} className={labelClass}>Tahun Data</label>
            <Select id={id} className="w-full md:max-w-xs" value={year} placeholder="Pilih tahun terlebih dahulu"
                options={annualPeriods.map(p => ({ value: String(p.tahun), label: p.tahun + ' — ' + (statuses[p.status] || p.status), disabled: p.status !== 'aktif' }))}
                onChange={tahun => {
                    if (String(tahun) !== String(year)) setData(previous => ({ ...previous, tahun, indikator_fitur4_id: '', tgl_register: '' }));
                }} />
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Pilih tahun aktif untuk menampilkan indikator. Tahun draft atau ditutup tidak menerima input baru.</p>
            <InputError message={errors.tahun} className="mt-1" />
            <InputError message={errors.periode_kinerja_id} className="mt-1" />
        </div>
        <div className="relative z-[60] col-span-12 flex flex-col md:col-span-6">
            <label className={labelClass}>Indikator</label>
            {!year ? <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Pilih tahun data terlebih dahulu.</p> : <>
                <ComboboxPage key={year} ShouldMap={options} placeholder="Pilih indikator"
                    selected={options.find(item => String(item.id) === String(data.indikator_fitur4_id)) || null}
                    onChange={item => setData('indikator_fitur4_id', item.id)} />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{options.length ? 'Indikator mengikuti tahun, PIC akun, dan tanggung jawab jabatan. PIC risiko harus sesuai cakupan indikator.' : 'Tidak ada indikator yang dapat dipilih untuk tahun dan PIC akun ini.'}</p>
            </>}
            <InputError message={errors.indikator_fitur4_id} className="mt-1" />
        </div>
        <div className="relative z-[59] col-span-12 flex flex-col md:col-span-6">
            <label htmlFor={id + '-date'} className={labelClass}>Tanggal Register</label>
            <DatePicker key={year} id={id + '-date'} name="tgl_register" dateFormat="dd-MM-yyyy" autoComplete="off" strictParsing
                selected={date && !Number.isNaN(date.getTime()) ? date : null}
                disabled={!year || !writable} placeholderText={year ? 'Pilih tanggal di tahun ' + year : 'Pilih tahun terlebih dahulu'}
                minDate={year ? new Date(Number(year), 0, 1) : undefined}
                maxDate={year ? new Date(Number(year), 11, 31) : undefined}
                className={inputClass + ' disabled:cursor-not-allowed disabled:opacity-60'}
                onBlur={event => {
                    const [day, month, typedYear] = event.target.value.split('-').map(Number);
                    const typedDate = new Date(typedYear, month - 1, day);
                    if (typedYear !== Number(year) || typedDate.getFullYear() !== typedYear || typedDate.getMonth() !== month - 1 || typedDate.getDate() !== day) {
                        setData('tgl_register', '');
                    }
                }}
                onChange={value => {
                    if (!value) return setData('tgl_register', '');
                    if (value.getFullYear() !== Number(year)) return;
                    setData('tgl_register', [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-'));
                }} />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Tanggal register harus berada dalam tahun data yang dipilih.</p>
            <InputError message={errors.tgl_register} className="mt-1" />
        </div>
    </>;
}
