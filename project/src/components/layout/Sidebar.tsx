import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Upload as UploadIcon, ShoppingCart, BarChart3,
  Megaphone, Settings, RotateCcw, CreditCard, Truck,
  Star, HeadphonesIcon, Store as StoreIcon, ChevronLeft, ChevronRight,
  Users as UsersIcon, Bell, Layers3, Percent,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/collections', icon: Layers3, label: 'Collections' },
    { path: '/sales', icon: Percent, label: 'Sales' },
    { path: '/users', icon: UsersIcon, label: 'Users' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/upload', icon: UploadIcon, label: 'Upload Product' },
    { path: '/shipping', icon: Truck, label: 'Shipping' },
    { path: '/returns', icon: RotateCcw, label: 'Returns' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/promotions', icon: Megaphone, label: 'Promotions' },
    { path: '/reviews', icon: Star, label: 'Reviews' },
    { path: '/support', icon: HeadphonesIcon, label: 'Support' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_24px_60px_-32px_rgba(26,42,79,0.45)] transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/60">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <StoreIcon className="w-8 h-8 text-[#1A2A4F]" />
            <span className="text-xl font-semibold text-[#1A2A4F]">SellerHub</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-[#70798B] hover:bg-white/70 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <nav className="mt-4 ">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#E6EBFF] text-[#1A2A4F] shadow-md shadow-[#C8D3FF]/60' 
                  : 'text-[#70798B] hover:bg-white/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[#1A2A4F]' : 'text-[#8B95AB]'}`} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;