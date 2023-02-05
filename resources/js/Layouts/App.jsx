import Container from "@/Components/Container";
import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function App({ auth, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const { flash } = usePage().props;
    useEffect(() => {
        flash.type && toast[flash.type](flash.message);
    });
    return (
        <div className="min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <Container>
            <div className="grid grid-cols-12">
                <Sidebar />
                <div className="min-h-screen col-span-12 col-start-1 bg-white md:col-span-10 md:col-start-3">
                    <Navbar />
                    <main>{children}</main>
                </div>
            </div>
            </Container>
        </div>
    );
}
