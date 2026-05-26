import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// PASTIKAN PROPS INI DITANGKAP DI SINI
export default function DestroyModal({
    title = "Konfirmasi Hapus", // Fallback jika title tidak dikirim
    warning = "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.", // Fallback warning
    size = "max-w-md", // Fallback size
    isOpenDestroyDialog,
    setIsOpenDestroyDialog,
    children,
}) {
    return (
        <Transition appear show={isOpenDestroyDialog} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[100]"
                open={isOpenDestroyDialog}
                onClose={() => setIsOpenDestroyDialog(false)}
            >
                {/* --- BACKDROP BLUR --- */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 transition-opacity bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                {/* --- MODAL POSITIONING --- */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                // PROP SIZE DIEKSEKUSI DI SINI
                                className={`relative w-full text-left align-middle transition-all transform bg-white dark:bg-[#0f172a] shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 sm:my-8 ${size}`}
                            >
                                {/* PENANGKAL AUTO-FOCUS */}
                                <button type="button" className="sr-only" autoFocus>
                                    Tutup Modal
                                </button>

                                {/* --- MODAL BODY --- */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto border rounded-full shrink-0 bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon 
                                                className="w-6 h-6 text-rose-600 dark:text-rose-400 sm:w-5 sm:h-5" 
                                                aria-hidden="true" 
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            
                                            {/* PROP TITLE DIEKSEKUSI DI SINI */}
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-black tracking-tight text-slate-900 dark:text-white"
                                            >
                                                {title}
                                            </Dialog.Title>
                                            
                                            {/* PROP WARNING DIEKSEKUSI DI SINI */}
                                            <div className="mt-2">
                                                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                                    {warning}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* --- MODAL FOOTER ACTIONS --- */}
                                <div className="px-4 py-4 bg-slate-50 dark:bg-[#1e293b]/50 border-t border-slate-100 dark:border-slate-800/80 sm:px-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center items-center w-full px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50 sm:w-auto"
                                        onClick={() => setIsOpenDestroyDialog(false)}
                                    >
                                        Batal
                                    </button>
                                    
                                    {/* PROP CHILDREN (TOMBOL HAPUS) DIEKSEKUSI DI SINI */}
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}