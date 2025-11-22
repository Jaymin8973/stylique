import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Products from './components/pages/Products';
import Orders from './components/pages/Orders';

import Analytics from './components/pages/Analytics';
import Users from './components/pages/Users';
import Notifications from './components/pages/Notifications';
import Collections from './components/pages/Collections';
import Sales from './components/pages/Sales';

import Settings from './components/pages/Settings';
import ProductUpload from './components/pages/ProductUpload';
import Marketing from './components/pages/Marketing'; // reused as Promotions
import Returns from './components/pages/Returns';
import Payments from './components/pages/Payments';
import Shipping from './components/pages/Shipping';
import Reviews from './components/pages/Reviews';
import Support from './components/pages/Support';
import ProductDetail from './components/pages/ProductDetail';
import Login from './components/pages/Login';

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