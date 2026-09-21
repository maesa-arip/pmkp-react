import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import ExportPeriodPicker, { isSingleYearRange, exportErrorMessage } from "@/Components/ExportPeriodPicker";
import ComboboxMultipleWithOutSemuaUnit from "@/Components/ComboboxMultipleWithOutSemuaUnit";
import ComboboxPage from "@/Components/ComboboxPage";
import { InformationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function KeterjadianRisiko({ setIsOpenAddDialog }) {
    const { data, setData } = useForm({
        name: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const [period, setPeriod] = useState({ startDate: "", endDate: "" });
    const [exportError, setExportError] = useState("");
    const [userId, setUserId] = useState(null);
    const [loadingKeterjadian, setLoadingKeterjadian] = useState(false);
    const [currently_id, setCurrently_id] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isSingleYearRange(period)) {
            setExportError("Pilih tahun lalu tekan Setahun penuh atau salah satu Triwulan. Satu berkas hanya boleh memuat satu tahun.");
            return;
        }
        setExportError("");
        const url = "/riskregisterketerjadian";
        const payload = { ...period, userId, currently_id };
        setLoadingKeterjadian(true);

        axios
            .post(url, payload, { responseType: "blob" })
            .then((response) => {
                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", "Format Keterjadian Risiko " + period.startDate.slice(0, 4) + ".xlsx");
                document.body.appendChild(link);
                link.click();
                link.remove();
                setIsOpenAddDialog(false);
                setLoadingKeterjadian(false);
            })
            .catch(async (error) => {
                setExportError(await exportErrorMessage(error));
                setLoadingKeterjadian(false);
            });
    };

    const { users, permissionNames } = usePage().props;
    const permission_name = permissionNames ? permissionNames.map((p) => p.name) : [];

    let ShouldMap = {
        currently: [
            { id: 1, name: "Sedang Terjadi" },
            { id: 2, name: "Tidak Sedang Terjadi" },
            { id: 3, name: "Risiko Prioritas" },
        ],
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">

            <ExportPeriodPicker value={period} onChange={setPeriod} />

            <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-1.5">
                    <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" value="Pilih Kejadian" />
                    <ComboboxPage
                        ShouldMap={ShouldMap.currently}
                        selected={currently_id}
                        onChange={(e) => {
                            setData({ ...data, currently_id: e.id });
                            setCurrently_id(e);
                        }}
                    />
                </div>

                {permission_name.indexOf("lihat data semua risk register") > -1 && (
                    <div className="flex flex-col gap-1.5 p-5 border rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                        <InputLabel className="mb-2 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" value="Filter Unit (Opsional)" />
                        <div className="flex items-start gap-2 mb-3 text-xs font-medium text-sky-700 dark:text-sky-400">
                            <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>Kosongkan bagian ini jika ingin menarik data dari Semua Unit.</p>
                        </div>
                        <ComboboxMultipleWithOutSemuaUnit
                            ShouldMap={users}
                            name={"userId"}
                            onChange={(selectedIdsString) => {
                                setUserId(selectedIdsString);
                                setData("userId", selectedIdsString);
                            }}
                            defaultValues={[]}
                        />
                    </div>
                )}
            </div>

            {exportError && (
                <p role="alert" className="p-3 text-sm font-semibold border text-rose-700 bg-rose-50 border-rose-200 rounded-xl dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30">{exportError}</p>
            )}

            <div className="flex flex-col-reverse justify-end gap-3 pt-4 mt-2 border-t sm:flex-row border-slate-100 dark:border-slate-800">
                <SecondaryButton onClick={closeButton} className="justify-center py-2.5">
                    Batal
                </SecondaryButton>
                {loadingKeterjadian ? (
                    <button disabled className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-sky-600 rounded-xl opacity-70 cursor-not-allowed">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" /> Sedang Mengekspor...
                    </button>
                ) : (
                    <PrimaryButton className="justify-center py-2.5 bg-sky-600 hover:bg-sky-700 focus:ring-sky-500">
                        Export Data
                    </PrimaryButton>
                )}
            </div>
        </form>
    );
}
