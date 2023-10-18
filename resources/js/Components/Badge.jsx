import React from "react";

export default function Badge({ className = "", children, color = "blue" }) {
    const colorVariants = {
        blue: "bg-blue-50 text-blue-600 ring-blue-500/10",
        red: "bg-red-50 text-red-600 ring-red-500/10",
        yellow: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
        amber: "bg-amber-50 text-amber-600 ring-amber-500/10",
        teal: "bg-teal-50 text-teal-600 ring-teal-500/10",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
        cyan: "bg-cyan-50 text-cyan-600 ring-cyan-500/10",
        sky: "bg-sky-50 text-sky-600 ring-sky-500/10",
        gray: "bg-gray-50 text-gray-600 ring-gray-500/10",
        green: "bg-green-50 text-green-600 ring-green-500/10",
        violet: "bg-violet-50 text-violet-600 ring-violet-500/10",
        fuchsia: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-500/10",
    };
    return (
        <span
            className={
                `${colorVariants[color]} inline-flex items-center rounded-md px-2 py-1 mr-1 text-xs font-medium ring-1 ring-inset ` +
                className
            }
        >
            {children}
        </span>
    );
}