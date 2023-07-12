import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import DatePicker from "react-datepicker";

export default function LarsDHP({ setIsOpenAddDialog }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        name: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loadingLars, setLoadingLars] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = "/riskregisterklinislarsdhp";
        const data = { startDate, endDate };
        setLoadingLars(true);

        axios
            .post(url, data, { responseType: "blob" })
            .then((response) => {
                const downloadUrl = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute(
                    "download",
                    "Form Manajemen Risiko LARS DHP.xlsx"
                );
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
    return (
        <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 px-3 py-4 text-base font-semibold text-gray-700 rounded shadow">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx={12} cy={12} r={9} />
                            <line x1={12} y1={8} x2="12.01" y2={8} />
                            <polyline points="11 12 12 12 12 16 13 16" />
                        </svg>
                        Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal
                        Sampai Sekarang.
                    </div>
                    <div className="col-span-6">
                        <InputLabel className={"text-base font-semibold"}  for="startDate" value="Start Date" />
                        <DatePicker
                            dateFormat="dd-MM-yyyy"
                            value={data.startDate}
                            id="startDate"
                            name="startDate"
                            autoComplete="off"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(date) => {
                                setStartDate(date);
                                const d = new Date(date).toLocaleDateString(
                                    "en-CA"
                                );
                                setData("startDate", d);
                            }}
                        />
                    </div>

                    <div className="col-span-6">
                        <InputLabel className={"text-base font-semibold"} for="endDate" value="End Date" />
                        <DatePicker
                            dateFormat="dd-MM-yyyy"
                            value={data.endDate}
                            id="endDate"
                            name="endDate"
                            autoComplete="off"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(date) => {
                                setEndDate(date);
                                const d = new Date(date).toLocaleDateString(
                                    "en-CA"
                                );
                                setData("endDate", d);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {loadingLars ? (
                    <button
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={true}
                    >
                        Exporting...
                    </button>
                ) : (
                    <PrimaryButton>Export</PrimaryButton>
                )}
                <SecondaryButton className="mx-2" onClick={closeButton}>
                    Close
                </SecondaryButton>
            </div>
        </form>
    );
}
