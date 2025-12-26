import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, User, Menu, Package, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  orderId?: number;
  isRead: boolean;
  createdAt: string;
}

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('Seller');
  const [userEmail, setUserEmail] = useState('');

  // Get logged in user info
  useEffect(() => {
    try {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const user = JSON.parse(authUser);
        setUserName(user.Username || user.name || 'Seller');
        setUserEmail(user.Email || user.email || '');
      }
    } catch (err) {
      console.error('Failed to parse auth user:', err);
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5001/api/notifications/seller/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5001/api/notifications/seller', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5001/api/notifications/seller/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch('http://localhost:5001/api/notifications/seller/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } catch { }
    navigate('/login', { replace: true });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_-28px_rgba(26,42,79,0.35)] px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-[#70798B] hover:bg-white/60 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA4B5]" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="pl-10 pr-4 py-2.5 w-96 bg-[#F8FAFC] rounded-xl border-0 text-[#1A2A4F] placeholder:text-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#AFC6FF] transition-shadow"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 rounded-xl text-[#70798B] hover:bg-white/60 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-99 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#1A2A4F] to-[#2d4a7c]">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-white/80 hover:text-white flex items-center"
                      >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif.id);
                          if (notif.orderId) {
                            navigate(`/orders/${notif.orderId}`);
                            setShowDropdown(false);
                          }
                        }}
                        className={`flex items-start p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''
                          }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${notif.type === 'new_order' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => {
                        navigate('/seller-notifications');
                        setShowDropdown(false);
                      }}
                      className="text-sm text-[#1A2A4F] hover:underline font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#1A2A4F] rounded-full flex items-center justify-center shadow-[0_12px_22px_-14px_rgba(26,42,79,0.7)]">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block text-[#4B5563]">
              <p className="text-sm font-semibold text-[#1A2A4F]">{userName}</p>
              <p className="text-xs">{userEmail || 'Seller Account'}</p>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1A2A4F] text-white hover:bg-[#0f1a33] shadow-[0_8px_18px_-12px_rgba(26,42,79,0.7)]"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;