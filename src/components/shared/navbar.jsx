import React, { useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { Bell } from "lucide-react";
import { useAuthStore } from "../../../store/store";
import { useFetchUnreadCount, useFetchAdminNotifications } from "../../hooks/queries/adminNotification";
import { useNavigate } from "react-router-dom";

const NavbarComponent = ({ toggleSidebar }) => {
    const { logOut } = useAuthStore();
    const { isLoggedIn, user } = useAuthStore();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    
    const { data: unreadData } = useFetchUnreadCount();
    const unreadCount = unreadData?.count || 0;
    
    const { data: recentNotifications } = useFetchAdminNotifications(1, 5, { is_read: false });
    const notifications = Array.isArray(recentNotifications) ? recentNotifications : [];

    return (
        <Navbar fluid rounded className="bg-white shadow-sm border-gray-200 p-4">
            <div className="flex items-center justify-between w-full">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-xl text-gray-700"
                >
                    &#9776;
                </button>

                {/* Spacer for Large Screens */}
                <div className="flex-1"></div>

                {/* Notification Bell */}
                <div className="relative mr-4">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => {
                                                setShowNotifications(false);
                                                navigate('/notifications');
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center gap-3">
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="User settings"
                                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                rounded
                            />
                        }
                    >
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>
                    </Dropdown>

                    <div>
                        <p className="text-gray-700 font-semibold">{user?.username}</p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                </div>
            </div>
            
            {/* Click outside to close notifications */}
            {showNotifications && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                ></div>
            )}
        </Navbar>
    );
};

export default NavbarComponent;
