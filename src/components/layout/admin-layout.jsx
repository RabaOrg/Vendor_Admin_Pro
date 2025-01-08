import React, { useState } from "react";

import Sidebar from "../shared/sidebar"
import Navbar from "../shared/navbar"
import { Outlet } from 'react-router-dom'


function AdminLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden">

            <div
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 left-0 z-50 w-44 bg-gray-800 transform transition-transform duration-300 md:translate-x-0 md:static md:w-44`}
            >
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>


            <div className="flex flex-1 flex-col overflow-hidden md:ml-20">

                <Navbar toggleSidebar={toggleSidebar} />


                <main className="relative flex-1 overflow-y-auto bg-[#f5f6fa] focus:outline-none border-2">
                    <Outlet />
                </main>
            </div>
        </div>

    );
}

export default AdminLayout;
