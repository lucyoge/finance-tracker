import AppLayout from '@/layouts/app-layout'
import httpClient from '@/lib/axios';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/notifications' },
];

interface Notification {
    id: number;
    data: {
        category: string;
        notification_type: string;
        message: string;
        budgetted_amount: number;
        remaining_budget: number;
    };
    read_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
};


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const fetchNotifications = async () => {
        setFetching(true);
        try {
            const response = await httpClient.get(route('api.fetch-unread-notifications'));
            setNotifications(response.data.body.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        // Set notification to read
        httpClient.post(route('api.mark-as-read', { id: notification.id }))
            .then(response => {
                if (response.status === 200) {
                    fetchNotifications();
                }
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Notifications</h2>

                {!fetching && notifications.length === 0 && (
                    <p className="text-gray-500">No new notifications found.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">All Notifications</h3>
                        <ul className="divide-y divide-gray-200">
                            {notifications.map((notification : Notification) => (
                                <li
                                    key={notification.id}
                                    className="p-3 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-800 font-medium">
                                            {notification.data.category} - {notification.data.notification_type}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">Notification Details</h3>
                        {!selectedNotification ? (
                            <p className="text-gray-500">Select a notification to view details</p>
                        ) : (
                            <div>
                                <p className="mb-4 text-gray-800">
                                    {selectedNotification.data.message}
                                </p>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><strong>Category:</strong> {selectedNotification.data.category}</p>
                                    <p><strong>Type:</strong> {selectedNotification.data.notification_type}</p>
                                    <p><strong>Budgeted Amount:</strong> ₦{selectedNotification.data.budgetted_amount}</p>
                                    <p><strong>Remaining Budget:</strong> ₦{selectedNotification.data.remaining_budget}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Notifications
