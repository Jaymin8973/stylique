import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './features/dashboard/pages/Dashboard';
import Products from './features/products/pages/Products';
import Orders from './features/orders/pages/Orders';

import Analytics from './features/analytics/pages/Analytics';
import Users from './features/users/pages/Users';
import Notifications from './features/notifications/pages/Notifications';
import Collections from './features/collections/pages/Collections';
import Sales from './features/sales/pages/Sales';

import Settings from './features/settings/pages/Settings';
import ProductUpload from './features/products/pages/ProductUpload';
import Marketing from './features/marketing/pages/Marketing'; // reused as Promotions
import Returns from './features/returns/pages/Returns';
import Payments from './features/payments/pages/Payments';
import Shipping from './features/shipping/pages/Shipping';
import Reviews from './features/reviews/pages/Reviews';
import Support from './features/support/pages/Support';
import ProductDetail from './features/products/pages/ProductDetail';
import OrderDetails from './features/orders/pages/OrderDetails';
import Login from './features/auth/pages/Login';
import SellerNotifications from './features/notifications/pages/SellerNotifications';


// Small guard component for auth-protected routes
function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthed = !!localStorage.getItem('authToken');
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const onLoginRoute = useMemo(() => location.pathname === '/login', [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6FF] via-white to-[#FDFBFF] text-[#4B5563]">
      {!onLoginRoute && (
        <>
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="px-8 py-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
                <Route path="/products/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
                <Route path="/orders/:id" element={<RequireAuth><OrderDetails /></RequireAuth>} />
                <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
                <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
                <Route path="/collections" element={<RequireAuth><Collections /></RequireAuth>} />
                <Route path="/sales" element={<RequireAuth><Sales /></RequireAuth>} />
                <Route path="/promotions" element={<RequireAuth><Marketing /></RequireAuth>} />
                <Route path="/returns" element={<RequireAuth><Returns /></RequireAuth>} />
                <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
                <Route path="/upload" element={<RequireAuth><ProductUpload /></RequireAuth>} />
                <Route path="/upload/:id" element={<RequireAuth><ProductUpload /></RequireAuth>} />
                <Route path="/shipping" element={<RequireAuth><Shipping /></RequireAuth>} />
                <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />
                <Route path="/support" element={<RequireAuth><Support /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                <Route path="/seller-notifications" element={<RequireAuth><SellerNotifications /></RequireAuth>} />
              </Routes>
            </main>
          </div>
        </>
      )}
      {onLoginRoute && (
        <Routes>
          <Route path="/login" element={
            !!localStorage.getItem('authToken') ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}