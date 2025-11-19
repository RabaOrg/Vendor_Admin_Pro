import React, { useState } from "react";
import { Icons } from "../icons/icon";
import { useAuthStore } from "../../../store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

const SidebarComponent = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logOut } = useAuthStore();

    const menuItems = [
        { name: "Dashboard", icon: <Icons.Dashboard />, path: "/" },
        { name: "Customer", icon: <Icons.Customer />, path: "/customer" },
        { name: "Vendor Management", icon: <Icons.Activation />, path: "/vendor_management" },
        { name: "Products", icon: <Icons.Product />, path: "/products" },
        { name: "Applications", icon: <Icons.Application />, path: "/application" },
        { name: "Guarantor Management", icon: <Icons.RepaymentPlan />, path: "/guarantor_list" },
        // { name: "Payment Details", icon: <Icons.Order />, path: "/payment_details" },
        // { name: "Recurring Debits", icon: <Icons.Transaction />, path: "/recurring_debits" },
        { name: "Transaction", icon: <Icons.Transaction />, path: "/transaction_details" },
        { name: "Agent Management", icon: <Icons.Transaction />, path: "/agent_management" },

        { name: "Repayment Schedules", icon: <Icons.Category />, path: "/repayment-plan" },
    ];

    const [activeItem, setActiveItem] = useState(() => {
        const currentPath = location.pathname;
        const currentItem = menuItems.find((item) => item.path === currentPath);
        return currentItem ? currentItem.name : "Dashboard";
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);


    const handleItemClick = (item, path) => {
        setActiveItem(item);
        setIsSettingsOpen(false);
        setIsPaymentOpen(false);
        setIsMarketplaceOpen(false);

        toggleSidebar();
        navigate(path);
    };

    const handleSettingsToggle = () => {
        setIsSettingsOpen(prev => !prev);
        setActiveItem("Settings");
        setIsPaymentOpen(false);
        setIsMarketplaceOpen(false);
    };
    
    const handlePaymentToggle = () => {
        setIsSettingsOpen(false);
        setIsPaymentOpen(!isPaymentOpen);
        setActiveItem("Payment");
        setIsMarketplaceOpen(false);
    };
    
    const handleMarketplaceToggle = () => {
        setIsSettingsOpen(false);
        setIsPaymentOpen(false);
        setIsMarketplaceOpen(!isMarketplaceOpen);
        setActiveItem("Marketplace");
    };


    return (
        <div
            className={`${isOpen ? "block" : "hidden"} fixed top-0 left-0 w-64 h-full bg-white z-50 md:block overflow-y-auto md:overflow-y-visible pb-20 md:pb-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
        >




            <div className="flex flex-col justify-between h-full p-5">


                <div>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden mb-4 p-2 text-2xl text-gray-700 hover:bg-gray-200 rounded focus:outline-none"
                        aria-label="Close sidebar"
                    >
                        &times;
                    </button>

                    <div className="flex justify-center">
                        <img src="/raba.png" alt="Logo" className="h-9 w-auto" />
                    </div>


                    <ul className="space-y-1 mt-14">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`flex items-center font-medium text-sm space-x-2 px-4 py-3 rounded cursor-pointer 
                                    ${activeItem === item.name
                                        ? "bg-[#0f5d30] text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                onClick={() => handleItemClick(item.name, item.path)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </li>
                        ))}
                        <li
                            className={`text-sm px-4 py-3 rounded cursor-pointer transition-colors
    ${activeItem === "Payment"
                                    ? "text-[#0f5d30] font-semibold"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <div onClick={handlePaymentToggle} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg"><Icons.Transaction /></span>
                                    <span>Payment</span>
                                </div>
                                {isPaymentOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {isPaymentOpen && (
                                <ul className="ml-6 mt-2 space-y-1 text-xs text-gray-700">
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("Payment Details", "/payment_details")}
                                    >
                                        Payment Details
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("Recurring Debit", "/recurring_debits")}
                                    >
                                        Recurring Debit
                                    </li>
                                </ul>
                            )}
                        </li>


                        <li
                            className={`text-sm px-4 py-3 rounded cursor-pointer transition-colors
    ${activeItem === "Settings"
                                    ? "text-[#0f5d30] font-semibold"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <div onClick={handleSettingsToggle} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg"><Icons.Category /></span>
                                    <span>Settings</span>
                                </div>
                                {isSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {isSettingsOpen && (
                                <ul className="ml-6 mt-2 space-y-1 text-xs text-gray-700">
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("Lease Calculator", "/lease-calculator")}
                                    >
                                        Lease Calculator
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("Notification", "/notification")}
                                    >
                                        Admin Notification Management
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("SMS Notification", "/email_notification")}
                                    >
                                        SMS Notification
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer"
                                        onClick={() => handleItemClick("Marketplace Settings", "/marketplace-settings")}
                                    >
                                        Marketplace Settings
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li
                            className={`text-sm px-4 py-3 rounded cursor-pointer transition-colors
    ${activeItem === "Marketplace"
                                    ? "text-[#0f5d30] font-semibold"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <div onClick={handleMarketplaceToggle} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg"><Icons.Category /></span>
                                    <span>Marketplace</span>
                                </div>
                                {isMarketplaceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {isMarketplaceOpen && (
                                <ul className="ml-6 mt-2 space-y-2 text-sm text-gray-700">
                                    <li
                                        className="hover:text-green-500 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                                        onClick={() => handleItemClick("Dealer Reviews", "/marketplace/reviews")}
                                    >
                                        Dealer Reviews
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                                        onClick={() => handleItemClick("Categories", "/marketplace/categories")}
                                    >
                                        Product Categories
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                                        onClick={() => handleItemClick("Repayment Plans", "/marketplace/repayment-plans")}
                                    >
                                        Repayment Plans
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                                        onClick={() => handleItemClick("KYC Management", "/marketplace/kyc")}
                                    >
                                        KYC Management
                                    </li>
                                    <hr className="my-1 border-gray-300 w-5/6" />
                                    <li
                                        className="hover:text-green-500 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                                        onClick={() => handleItemClick("Eligibility Settings", "/marketplace/eligibility")}
                                    >
                                        Eligibility Settings
                                    </li>
                                </ul>
                            )}
                        </li>

                    </ul>
                </div>


                <div
                    onClick={logOut}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-700 hover:text-red-600 transition-colors"
                >
                    <FaSignOutAlt className="text-lg" />
                    <p className="text-sm font-medium">Logout</p>
                </div>
            </div>
        </div>
    );
};

export default SidebarComponent;
