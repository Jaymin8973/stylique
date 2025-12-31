import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, CheckCheck, ArrowLeft, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';

const SellerNotifications: React.FC = () => {
    const navigate = useNavigate();
    const {
        notifications,
        isLoadingNotifications,
        markAsRead,
        markAllAsRead,
        clearAllNotifications
    } = useNotifications();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['notifications', 'seller'] });
    };

    const handleClearAll = async () => {
        if (!window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            return;
        }
        await clearAllNotifications();
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredNotifications = notifications.filter((n: any) => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500 mt-1">
                            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingNotifications ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="flex items-center px-4 py-2 bg-[#1A2A4F] text-white rounded-lg hover:bg-[#0f1a33] transition-colors"
                        >
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all as read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex space-x-2">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-[#1A2A4F] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {isLoadingNotifications ? (
                    <div className="p-8 text-center text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <p>Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900">No notifications</p>
                        <p className="text-sm mt-1">
                            {filter === 'all'
                                ? "You don't have any notifications yet"
                                : filter === 'unread'
                                    ? "You've read all your notifications"
                                    : 'No read notifications yet'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredNotifications.map((notif: any) => (
                            <div
                                key={notif.id}
                                onClick={() => {
                                    if (!notif.isRead) markAsRead(notif.id);
                                    if (notif.orderId) {
                                        navigate(`/orders/${notif.orderId}`);
                                    }
                                }}
                                className={`flex items-start p-5 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <div
                                    className={`p-3 rounded-lg mr-4 ${notif.type === 'new_order'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                        }`}
                                >
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p
                                            className={`text-base font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'
                                                }`}
                                        >
                                            {notif.title}
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-400">{formatTime(notif.createdAt)}</span>
                                            {!notif.isRead && (
                                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                                    {notif.orderId && (
                                        <p className="text-xs text-[#1A2A4F] mt-2 font-medium">
                                            Click to view order →
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerNotifications;
