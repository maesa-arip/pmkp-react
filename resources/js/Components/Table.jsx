import React from "react";

const Table = ({ children }) => {
    return (
        <>
            <div className="flex flex-col overflow-x-auto">
                <div className="rounded-lg">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="min-w-full border rounded-lg border-slate-300">
                            <table className="min-w-full border-separate rounded-lg ">
                                {children}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const Thead = ({ children }) => {
    return (
        <>
            <thead className="bg-gray-50">{children}</thead>
        </>
    );
};
const Th = ({ children, onClick, className = "text-left", width }) => {
    return (
        <>
            <th
                scope="col"
                className={
                    "px-6 py-3 text-xs font-semibold tracking-normal text-gray-800 uppercase border rounded-lg border-slate-300 " +
                    className
                }
            >
                <div
                    className={
                        "flex items-center cursor-pointer gap-x-1 " +
                        width
                    }
                    onClick={onClick}
                >
                    {children}
                </div>
            </th>
        </>
    );
};
const Tbody = ({ children }) => {
    return (
        <>
            <tbody className="bg-white divide-y divide-gray-200">
                {children}
            </tbody>
        </>
    );
};
const Td = ({ children, className = "" }) => {
    return (
        <>
            <td
                className={
                    "px-6 py-4 text-sm font-normal tracking-normal border border-slate-300 rounded-lg " +
                    className
                }
            >
                {children}
            </td>
        </>
    );
};
const Tr = ({ children }) => {
    return <tr>{children}</tr>;
};

Table.Thead = Thead;
Table.Th = Th;
Table.Tbody = Tbody;
Table.Td = Td;
Table.Tr = Tr;

export default Table;