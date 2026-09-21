import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function KinerjaModal({ show, onClose, busy = false, title, description, children }) {
    return <Dialog open={show} onClose={() => !busy && onClose()} className="relative z-[60]">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
                <Dialog.Panel className="relative w-full min-w-0 max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div><Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>{description && <Dialog.Description className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</Dialog.Description>}</div>
                        <button type="button" disabled={busy} onClick={onClose} aria-label="Tutup modal" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 dark:hover:bg-slate-800"><XMarkIcon className="h-5 w-5" /></button>
                    </div>
                    {children}
                </Dialog.Panel>
            </div>
        </div>
    </Dialog>;
}
