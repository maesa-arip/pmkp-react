import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function ExportModal({ title, children, isOpenExportDialog, setIsOpenExportDialog, size = 'max-w-4xl' }) {
    return (
        // z-[110] memastikan modal ini juga menjadi prioritas tertinggi di atas Navbar
        <Transition appear show={isOpenExportDialog} as={Fragment}>
            <Dialog as="div" className="relative z-[110]" open={isOpenExportDialog} onClose={() => { }}>
                
                {/* --- BACKDROP / OVERLAY KACA --- */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" />
                </Transition.Child>

                {/* --- POSISI MODAL --- */}
                <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-6">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
                        >
                            <Dialog.Panel className={`w-full transform rounded-2xl bg-white dark:bg-[#0f172a] border border-transparent dark:border-slate-800/80 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all sm:my-8 ${size}`}>
                                
                                {/* JUDUL MODAL */}
                                <Dialog.Title
                                    as="h3"
                                    className="pb-4 mb-4 text-lg font-black leading-6 border-b text-slate-900 dark:text-white border-slate-100 dark:border-slate-800"
                                >
                                    {title}
                                </Dialog.Title>
                                
                                {/* KONTEN MODAL */}
                                <div className="mt-2 text-slate-700 dark:text-slate-300">
                                    {children}
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}