import React from 'react'

export default function Container({children}) {
    return (
        // Menghapus bg-white agar transparan dan menyesuaikan dengan tema global (App.jsx)
        // Jika Anda tetap ingin ada warna dasarnya, gunakan: bg-white dark:bg-[#020817]
        <div className="px-1 mx-auto bg-transparent">
            {children}
        </div>
    )
}