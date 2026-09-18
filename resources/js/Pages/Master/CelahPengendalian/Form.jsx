import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import TextAreaInput from "@/Components/TextAreaInput";

export default function Form({ data, setData, errors, processing, submit, closeButton }) {
    const inputClass = "mt-1 block w-full dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
    return (
        <div className="space-y-5 p-4 sm:p-6">
            <div>
                <InputLabel forInput="celah-name" value="Nama Celah Pengendalian" className="dark:text-slate-200" />
                <TextInput id="celah-name" value={data.name} handleChange={e => setData("name", e.target.value)} required isFocused className={inputClass} />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div>
                <InputLabel forInput="celah-description" value="Keterangan (opsional)" className="dark:text-slate-200" />
                <TextAreaInput id="celah-description" value={data.description} handleChange={e => setData("description", e.target.value)} className={inputClass} />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <input id="celah-active" type="checkbox" checked={data.is_active} onChange={e => setData("is_active", e.target.checked)} className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900" />
                    Aktif
                </label>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Pilihan aktif tersedia pada Risk Register Klinis dan Non Klinis. Nilai yang sudah tersimpan tetap dipertahankan.</p>
                <InputError message={errors.is_active} className="mt-2" />
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                <SecondaryButton processing={processing} onClick={closeButton}>Batal</SecondaryButton>
                <PrimaryButton processing={processing}>{processing ? "Menyimpan..." : submit}</PrimaryButton>
            </div>
        </div>
    );
}
