import React, { useEffect, useState } from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../features/notifications/hooks/useNotifications';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
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

  const onLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } catch { }
    navigate('/login', { replace: true });
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
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => navigate('/seller-notifications')}
              className="relative p-2 rounded-xl text-[#70798B] hover:bg-white/60 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
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