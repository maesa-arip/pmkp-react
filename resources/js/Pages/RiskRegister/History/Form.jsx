import ComboboxPage from "@/Components/ComboboxPage";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import RadioCard from "@/Components/RadioCard";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "@/Components/DatePicker/DatePicker";

export default function Form({
    errors,
    submit,
    data,
    setData,
    ShouldMap,
    model,
    closeButton,
}) {
    const defaultValue = [{ name: "" }];
    console.log(data)
    const [selectedProses, setSelectedProses] = useState(() => {
        if (model) {
            return ShouldMap.proses.find((x) => x.id === model.proses_id);
        }
        return defaultValue[0];
    });
    const [selectedCurrently, setSelectedCurrently] = useState(() => {
        if (model) {
            return ShouldMap.currently.find((x) => x.id === model.currently_id);
        }
        return defaultValue[0];
    });
    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (model) {
            return ShouldMap.riskCategories.find(
                (x) => x.id === model.risk_category_id
            );
        }
        return defaultValue[0];
    });
    // console.log(data)
    const [selectedSource, setSelectedSource] = useState(() => {
        if (model) {
            return ShouldMap.identificationSources.find(
                (x) => x.id === model.identification_source_id
            );
        }
        return defaultValue[0];
    });
    const [selectedLocation, setSelectedLocation] = useState(() => {
        if (model) {
            return ShouldMap.locations.find((x) => x.id === model.location_id);
        }
        return defaultValue[0];
    });
    const [selectedVariety, setSelectedVariety] = useState(() => {
        if (model) {
            return ShouldMap.riskVarieties.find(
                (x) => x.id === model.risk_variety_id
            );
        }
        return defaultValue[0];
    });
    const [selectedType, setSelectedType] = useState(() => {
        if (model) {
            return ShouldMap.riskTypes.find((x) => x.id === model.risk_type_id);
        }
        return defaultValue[0];
    });
    const [selectedImpact1, setSelectedImpact1] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(
                (x) => x.id === model.osd1_dampak
            );
        }
        return defaultValue[0];
    });
    const [selectedProbability1, setSelectedProbability1] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(
                (x) => x.id === model.osd1_probabilitas
            );
        }
        return defaultValue[0];
    });
    const [selectedControl1, setSelectedControl1] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(
                (x) => x.id === model.osd1_controllability
            );
        }
        return defaultValue[0];
    });
    const [selectedImpact2, setSelectedImpact2] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(
                (x) => x.id === model.osd2_dampak
            );
        }
        return defaultValue[0];
    });
    const [selectedProbability2, setSelectedProbability2] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(
                (x) => x.id === model.osd2_probabilitas
            );
        }
        return defaultValue[0];
    });
    const [selectedControl2, setSelectedControl2] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(
                (x) => x.id === model.osd2_controllability
            );
        }
        return defaultValue[0];
    });
    const [selectedPic, setSelectedPic] = useState(() => {
        if (model) {
            return ShouldMap.pics.find((x) => x.id === model.pic_id);
        }
        return defaultValue[0];
    });
    const [selectedIndikatorFitur04, setSelectedIndikatorFitur04] = useState(
        () => {
            if (model) {
                return ShouldMap.indikatorFitur04s.find(
                    (x) => x.id === model.indikator_fitur04_id
                );
            }
            return defaultValue[0];
        }
    );
    const [selectedPengawasan, setSelectedPengawasan] = useState(() => {
        if (model) {
            return ShouldMap.pengawasan.find(
                (x) => x.id === model.pengawasan_id
            );
        }
        return defaultValue[0];
    });
    useEffect(() => {
        setData({
            ...data,
            ["pernyataan_risiko"]:
                "Karena " +
                data.sebab +
                " Kemungkinan " +
                data.resiko +
                " Sehingga " +
                data.dampak,
        });
        // const setPernyataanResiko = 'Karena ' + data.sebab + 'Kemungkinan ' + data.resiko + 'Sehingga ' + data.dampak;
    }, [data.sebab, data.resiko, data.dampak]);

    const [tglRegister, setTglRegister] = useState(null);
    const [tglSelesai, setTglSelesai] = useState(null);
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="px-2 py-12 bg-white border rounded-xl">
                    <div className="mx-auto sm:px-6 lg:px-8">
                        <div>
                            <h3 className="mb-6 ml-3 text-2xl font-bold text-gray-700">
                                History
                            </h3>
                            <ol>
                                {/* {data.risk_register_histories} */}
                                {data.risk_register_histories?.map(
                                    (history, index) => (
                                        <li
                                            key={index}
                                            className="border-l-2 border-sky-600"
                                        >
                                            <div className="md:flex flex-start">
                                                <div className="bg-sky-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5">
                                                    <svg
                                                        aria-hidden="true"
                                                        focusable="false"
                                                        data-prefix="fas"
                                                        className="w-3 h-3 text-white"
                                                        role="img"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="block max-w-xl p-6 mb-10 ml-6 bg-white rounded-lg shadow-lg">
                                                    <div className="flex justify-between mb-4">
                                                        <a
                                                            href="#!"
                                                            className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                                        >
                                                            {history.currently_id ==
                                                            1 ? (
                                                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                                                                    KEJADIAN di {data.user_name}
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                                                                    {history.created_at == data.created_at ? 'RISIKO BARU DIBUAT' : 'SELESAI PERBAIKAN di' + data.user_name}
                                                                    {/* {history.created_at} {data.created_at} */}
                                                                </span>
                                                            )}
                                                        </a>
                                                        <a
                                                            href="#!"
                                                            className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                                        >
                                                            {new Date(history.created_at).toLocaleString('id','ID')}
                                                        </a>
                                                    </div>
                                                    <p className="mb-6 text-gray-700">
                                                        {data.pernyataan_risiko}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        className="inline-block text-justify px-4 py-1.5 bg-sky-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out"
                                                        data-mdb-ripple="true"
                                                    >
                                                        SEBAB : {data.sebab}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                )}

                                {/* <li className="border-l-2 border-emerald-600">
                                <div className="md:flex flex-start">
                                    <div className="bg-emerald-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5">
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            className="w-3 h-3 text-white"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="block max-w-xl p-6 mb-10 ml-6 bg-white rounded-lg shadow-lg">
                                        <div className="flex justify-between mb-4">
                                            <a
                                                href="#!"
                                                className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                            >
                                                21 000 Job Seekers
                                            </a>
                                            <a
                                                href="#!"
                                                className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                            >
                                                12 / 01 / 2022
                                            </a>
                                        </div>
                                        <p className="mb-6 text-gray-700">
                                            Libero expedita explicabo eius
                                            fugiat quia aspernatur autem
                                            laudantium error architecto
                                            recusandae natus sapiente sit nam
                                            eaque, consectetur porro molestiae
                                            ipsam an deleniti.
                                        </p>
                                        <button
                                            type="button"
                                            className="inline-block px-4 py-1.5 bg-sky-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out"
                                            data-mdb-ripple="true"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </li>
                            <li className="border-l-2 border-emerald-600">
                                <div className="md:flex flex-start">
                                    <div className="bg-emerald-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5">
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fas"
                                            className="w-3 h-3 text-white"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="block max-w-xl p-6 mb-10 ml-6 bg-white rounded-lg shadow-lg">
                                        <div className="flex justify-between mb-4">
                                            <a
                                                href="#!"
                                                className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                            >
                                                Awesome Employers
                                            </a>
                                            <a
                                                href="#!"
                                                className="text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800"
                                            >
                                                21 / 12 / 2021
                                            </a>
                                        </div>
                                        <p className="mb-6 text-gray-700">
                                            Voluptatibus temporibus esse illum
                                            eum aspernatur, fugiat suscipit
                                            natus! Eum corporis illum nihil
                                            officiis tempore. Excepturi illo
                                            natus libero sit doloremque, laborum
                                            molestias rerum pariatur quam ipsam
                                            necessitatibus incidunt, explicabo.
                                        </p>
                                        <button
                                            type="button"
                                            className="inline-block px-4 py-1.5 bg-sky-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out"
                                            data-mdb-ripple="true"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </li> */}
                                <li className="border-l-2 border-emerald-600">
                                    <div className="md:flex flex-start">
                                        <div className="bg-emerald-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5"></div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* <PrimaryButton>{submit}</PrimaryButton> */}
                <SecondaryButton className="mx-2" onClick={closeButton}>
                    Close
                </SecondaryButton>
            </div>
        </>
    );
}
