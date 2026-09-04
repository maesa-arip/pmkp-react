import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ComboboxMultipleWithOutSemuaUnit from "@/Components/ComboboxMultipleWithOutSemuaUnit";
import ComboboxPage from "@/Components/ComboboxPage";
import { InformationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function LarsDHP({ setIsOpenAddDialog }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        name: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userId, setUserId] = useState(null);
    const [loadingLars, setLoadingLars] = useState(false);
    const [currently_id, setCurrently_id] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = "/riskregisterklinislarsdhp";
        const payload = { startDate, endDate, userId }; // Payload asli Anda
        setLoadingLars(true);

        axios
            .post(url, payload, { responseType: "blob" })
            .then((response) => {
                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", "Form Manajemen Risiko LARS DHP.xlsx");
                document.body.appendChild(link);
                link.click();
                link.remove();
                setIsOpenAddDialog(false);
                setLoadingLars(false);
            })
            .catch((error) => {
                console.error(error);
                setLoadingLars(false);
            });
    };

    const { users, auth, permissionNames } = usePage().props;
    const permission_name = permissionNames ? permissionNames.map((p) => p.name) : [];
    
    let ShouldMap = {
        currently: [
            { id: 1, name: "Sedang Terjadi" },
            { id: 2, name: "Tidak Sedang Terjadi" },
            { id: 3, name: "Risiko Prioritas" },
        ],
    };

    const inputClass = "w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-slate-900 dark:text-white transition-all shadow-sm outline-none placeholder:text-slate-400";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
            
            <div className="flex items-start gap-3 p-4 text-sm font-medium border shadow-sm text-amber-700 bg-amber-50 border-amber-200 rounded-xl dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30">
                <InformationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Kosongkan Tanggal dan langsung tekan Export jika ingin menarik seluruh data dari awal sampai sekarang.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="startDate" value="Tanggal Mulai" />
                    <DatePicker
                        dateFormat="dd-MM-yyyy"
                        selected={startDate}
                        id="startDate"
                        name="startDate"
                        autoComplete="off"
                        placeholderText="Pilih Tanggal Mulai"
                        className={inputClass}
                        onChange={(date) => {
                            setStartDate(date);
                            if(date) setData("startDate", new Date(date).toLocaleDateString("en-CA"));
                        }}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <InputLabel className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="endDate" value="Tanggal Akhir" />
                    <DatePicker
                        dateFormat="dd-MM-yyyy"
                        selected={endDate}
                        id="endDate"
                        name="endDate"
                        autoComplete="off"
                        placeholderText="Pilih Tanggal Akhir"
                        className={inputClass}
                        onChange={(date) => {
                            setEndDate(date);
                            if(date) setData("endDate", new Date(date).toLocaleDateString("en-CA"));
                        }}
                    />
                </div>
            </div>

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

            <div className="flex flex-col-reverse justify-end gap-3 pt-4 mt-2 border-t sm:flex-row border-slate-100 dark:border-slate-800">
                <SecondaryButton onClick={closeButton} className="justify-center py-2.5">
                    Batal
                </SecondaryButton>
                {loadingLars ? (
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