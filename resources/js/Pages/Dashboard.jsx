import Dropdown from "@/Components/Dropdown";

import App from "@/Layouts/App";
import { Head, router, usePage } from "@inertiajs/react";
import { debounce, pickBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

const UpIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
        />
    </svg>
);
const DownIcon = () => (
    <svg
        className="w-5 h-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

export default function Dashboard(props) {
    const { auth, notifications, updatestatus } = usePage().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="px-2 py-12 bg-white border rounded-xl">
                <div className="mx-auto sm:px-6 lg:px-8">
                    {/* Card Section */}
                    <div className="px-4 py-10 mx-auto sm:px-6 lg:px-8 lg:py-14">
                        {/* Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-6">
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Total Risiko
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {props.riskRegisterKlinis + props.riskRegisterNonKlinis} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                             {/* Card */}
                             <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Risiko Klinis
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            {props.riskRegisterKlinis} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Risiko Non Klinis
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            {props.riskRegisterNonKlinis} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Risiko Sedang Terjadi
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {notifications} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Request Perubahan Status
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {updatestatus} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Perlu RCA
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            {props.priorityRisk} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Belum Verifikasi Manajemen
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            {props.occuringManagement} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                            {/* Card */}
                            <a
                                className="flex flex-col transition bg-white border shadow-sm group rounded-xl hover:shadow-md dark:bg-slate-900 dark:border-gray-800"
                                href="#"
                            >
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 dark:group-hover:text-gray-400 dark:text-gray-200">
                                                Belum Verifikasi Admin
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                            {props.occuringAdmin} Risiko
                                            </p>
                                        </div>
                                        <div className="pl-3">
                                            <svg
                                                className="w-3.5 h-3.5 text-gray-500"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            {/* End Card */}
                           
                        </div>
                        {/* End Grid */}
                    </div>
                    {/* End Card Section */}
                </div>
            </div>
        </>
    );
}
Dashboard.layout = (page) => <App children={page} />;
