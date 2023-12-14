import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ComboboxMultipleWithOutSemuaUnit from "@/Components/ComboboxMultipleWithOutSemuaUnit";
import ComboboxMultiple from "@/Components/ComboboxMultiple copy";
import ListBoxPage from "@/Components/ListBoxPage";
import ComboboxPage from "@/Components/ComboboxPage";
import RadioCard from "@/Components/RadioCard";

export default function IndikatorMutu({ setIsOpenAddDialog }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        startDate: "",
        endDate: "",
        userId: "",
    });
    const closeButton = (e) => setIsOpenAddDialog(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userId, setUserId] = useState(null);
    const [loadingLars, setLoadingLars] = useState(false);
    const formatDate = {
        year: 'numeric',
        month: 'long',
      };
    const handleSubmit = (e) => {
        e.preventDefault();
        // post(route('export.printPDSA'), { onSuccess: () => reset() });
        const url = "/print-indikator-mutu";
        const data = { startDate, endDate, userId };
        setLoadingLars(true);
        const formattedStartDate = data.startDate ? new Date(data.startDate).toLocaleDateString("en-CA", formatDate) : '';
        const formattedEndDate = data.startDate ? new Date(data.endDate).toLocaleDateString("en-CA", formatDate) : '';
        // const formattedStartDate = new Intl.DateTimeFormat('en-CA', formatDate).format(data.startDate);
        // console.log(formattedStartDate);

        axios
            .post(url, data, { responseType: "blob" })
            .then((response) => {
                const downloadUrl = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download","Form Indikator Mutu "+formattedStartDate+"-"+formattedEndDate+".pdf");
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
    const { users } = usePage().props;
    const { pics } = usePage().props;

    // console.log(pics)
    const { auth, permissionNames } = usePage().props;
    const permission_name = permissionNames
        ? permissionNames.map((permission) => permission.name)
        : "null";
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
                        Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin
                        Export Data Dari Awal Sampai Sekarang.
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            className={"text-base font-semibold"}
                            for="startDate"
                            value="Start Date"
                        />
                        <DatePicker
                            // dateFormat="dd-MM-yyyy"
                            // value={data.startDate}
                            dateFormat="MMMM yyyy"
                            value={data.startDate ? new Date(data.startDate).toLocaleDateString("en-CA", formatDate) : null}
                            showMonthYearPicker
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
                        <InputLabel
                            className={"text-base font-semibold"}
                            for="endDate"
                            value="End Date"
                        />
                        <DatePicker
                            dateFormat="MMMM yyyy"
                            value={data.endDate ? new Date(data.endDate).toLocaleDateString("en-CA", formatDate) : null}
                            showMonthYearPicker
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
                    {/* <div className="col-span-12">
                        <InputLabel
                            className={"text-base font-semibold"}
                            for="Pilih Kejadian"
                            value="Pilih Kejadian"
                        />
                        <div className="col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded">
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
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <circle cx={12} cy={12} r={9} />
                                <line x1={12} y1={8} x2="12.01" y2={8} />
                                <polyline points="11 12 12 12 12 16 13 16" />
                            </svg>
                            Kosongkan dan Langsung Tekan Export Jika Ingin
                            Menarik Semua Kejadian.
                        </div>
                        <ComboboxPage
                            ShouldMap={ShouldMap.currently}
                            selected={currently_id}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    ["currently_id"]: e.id,
                                });
                                setCurrently_id(e);
                            }}
                        />
                    </div> */}
                    {permission_name.indexOf("lihat semua data indikator mutu") >
                        -1 && (
                        <div className="col-span-12">
                            <InputLabel
                                className={"text-base font-semibold"}
                                for="Pilih Unit"
                                value="Pilih Unit"
                            />
                            <div className="col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded">
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
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <circle cx={12} cy={12} r={9} />
                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                    <polyline points="11 12 12 12 12 16 13 16" />
                                </svg>
                                Kosongkan dan Langsung Tekan Export Jika Ingin
                                Menarik Semua Unit.
                            </div>
                            <ComboboxMultipleWithOutSemuaUnit
                                ShouldMap={pics}
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
