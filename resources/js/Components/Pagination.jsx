import { Link } from "@inertiajs/react";
import React from "react";

export default function Pagination({ meta }) {
    if (!meta || !meta.links || meta.links.length <= 3) return null;

    return (
        <ul className="flex items-center gap-1.5 mt-4">
            {meta.links.map((item, index) => {
                const isActive = item.active;
                const isDisabled = item.url === null;

                return (
                    <li key={index}>
                        <Link
                            as="button"
                            disabled={isDisabled}
                            href={item.url || "#"}
                            className={`
                                flex items-center justify-center min-w-[2.25rem] h-9 px-3 text-sm font-medium rounded-lg transition-all duration-200 outline-none
                                ${isDisabled 
                                    ? "text-gray-400 dark:text-zinc-600 cursor-not-allowed" 
                                    : isActive 
                                        ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600" 
                                        : "bg-white dark:bg-[#09090b] text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 focus:ring-2 focus:ring-blue-500/20"
                                }
                            `}
                            dangerouslySetInnerHTML={{ __html: item.label }}
                        />
                    </li>
                );
            })}
        </ul>
    );
}