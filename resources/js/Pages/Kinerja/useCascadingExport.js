import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export default function useCascadingExport(periodId) {
    const [status, setStatus] = useState(null);
    const request = useRef(null);

    useEffect(() => {
        setStatus(null);
        return () => {
            request.current?.abort();
            request.current = null;
        };
    }, [periodId]);

    const download = async (url, archiveId = null) => {
        if (request.current) return;
        const controller = new AbortController();
        request.current = controller;
        setStatus({ type: 'loading', archiveId, message: 'Menyiapkan file Excel Cascading. Proses dapat memerlukan waktu untuk hierarki yang besar. Unduhan akan dimulai otomatis; tetap di halaman ini.' });

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!response.ok) {
                let message = 'Ekspor gagal diproses. Silakan coba lagi.';
                if (response.status === 401 || response.status === 419) {
                    message = 'Sesi Anda telah berakhir. Muat ulang halaman dan masuk kembali sebelum mengekspor.';
                } else if (response.status === 422) {
                    const data = await response.json();
                    message = Object.values(data.errors || {}).flat().join(' ') || data.message || message;
                } else if (response.status === 403) {
                    message = 'Anda tidak memiliki akses untuk mengunduh Cascading.';
                }
                throw new Error(message);
            }
            if (response.redirected || !response.headers.get('content-type')?.includes(excelType)) {
                throw new Error('Server tidak mengembalikan file Excel. Muat ulang halaman dan coba lagi.');
            }
            const blob = await response.blob();
            // A streaming response can fail after its successful headers were sent.
            const signature = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
            const trailer = new Uint8Array(await blob.slice(-65557).arrayBuffer());
            let completeZip = false;
            for (let i = trailer.length - 22; i >= 0; i--) {
                if (trailer[i] === 0x50 && trailer[i + 1] === 0x4b && trailer[i + 2] === 0x05 && trailer[i + 3] === 0x06
                    && i + 22 + trailer[i + 20] + (trailer[i + 21] << 8) === trailer.length) {
                    completeZip = true;
                    break;
                }
            }
            if (!completeZip || signature[0] !== 0x50 || signature[1] !== 0x4b || signature[2] !== 0x03 || signature[3] !== 0x04) {
                throw new Error('File Excel gagal dibuat. Silakan coba lagi.');
            }
            if (controller.signal.aborted) return;
            const filename = response.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/i)?.[1] || 'Cascading.xlsx';
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
            setStatus({ type: 'success', message: 'File Cascading siap. Unduhan telah dimulai; periksa folder unduhan browser Anda.' });
            if (archiveId === null) router.reload({ only: ['exports'] });
        } catch (error) {
            if (!controller.signal.aborted) {
                setStatus({ type: 'error', message: error instanceof TypeError ? 'Koneksi terputus saat mengunduh. Periksa koneksi Anda lalu coba lagi.' : error.message });
            }
        } finally {
            if (request.current === controller) request.current = null;
        }
    };

    return { status, download, busy: status?.type === 'loading' };
}