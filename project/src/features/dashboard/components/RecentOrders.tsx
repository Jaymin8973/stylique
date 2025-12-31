import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { apiService, type Order } from '../../../services/api';

const RecentOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiService.getOrders()
      .then(data => { if (isMounted) setOrders(data.slice(0, 5)); })
      .catch(err => { if (isMounted) setError(err?.message || 'Failed to load orders'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-[#1A2A4F] bg-[#E6EBFF]';
      case 'shipped': return 'text-[#A16207] bg-[#FEF3C7]';
      case 'delivered': return 'text-[#2F855A] bg-[#DEF7EC]';
      case 'pending': return 'text-[#70798B] bg-[#F1F5F9]';
      default: return 'text-[#70798B] bg-[#F1F5F9]';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-[#1A2A4F]">Recent Orders</h2>
          <p className="text-sm text-[#70798B] mt-1">Latest customer orders</p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="text-sm font-medium text-[#1A2A4F] hover:underline"
        >
          View all →
        </button>
      </div>
      {loading && <p className="text-sm text-[#70798B]">Loading orders...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="font-medium text-[#1A2A4F] group-hover:text-[#2A3A5F]">Order #{order.id}</p>
                  <p className="text-sm text-[#70798B]">{order.customer_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#1A2A4F]">₹{(order.total_amount || 0).toLocaleString()}</p>
                <p className="text-sm text-[#70798B]">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-[#70798B]">No recent orders</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;