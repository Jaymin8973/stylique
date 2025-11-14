import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, AlertTriangle, DollarSign } from 'lucide-react';
import MetricCard from '../shared/MetricCard';
import Chart from '../shared/Chart';
import RecentOrders from '../features/dashboard/RecentOrders';
import InventoryAlerts from '../features/dashboard/InventoryAlerts';
import PerformanceMetrics from '../features/dashboard/PerformanceMetrics';
import { apiService, type DashboardStats } from '../../services/api';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiService.getDashboardStats()
      .then(data => { if (isMounted) setStats(data); })
      .catch(err => { if (isMounted) setError(err?.message || 'Failed to load stats'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  type Metric = {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down';
    description?: string;
  };

  const metrics: Metric[] = [
    {
      title: "Total Products",
      value: stats ? String(stats.totalProducts) : (loading ? '…' : '—'),
      change: "",
      icon: Package,
      trend: "up",
      description: error ? 'Error loading' : 'From database'
    },
    {
      title: "Orders",
      value: stats ? String(stats.totalOrders) : (loading ? '…' : '—'),
      change: "",
      icon: ShoppingCart,
      trend: "up",
      description: error ? 'Error loading' : 'From database'
    },
    {
      title: "Revenue",
      value: stats ? `₹${(stats.totalRevenue || 0).toLocaleString()}` : (loading ? '…' : '—'),
      change: "",
      icon: DollarSign,
      trend: "up",
      description: error ? 'Error loading' : 'Completed orders'
    },
    {
      title: "Low Stock",
      value: stats ? String(stats.lowStockProducts) : (loading ? '…' : '—'),
      change: "",
      icon: AlertTriangle,
      trend: "down",
      description: error ? 'Error loading' : '< 10 units'
    },
  ];

  const topProducts = [
    { name: "iPhone 15 Pro Max", sales: 45, revenue: "₹60,70,500" },
    { name: "Samsung Galaxy S24", sales: 38, revenue: "₹47,49,962" },
    { name: "MacBook Pro 16\"", sales: 22, revenue: "₹54,97,800" },
    { name: "AirPods Pro", sales: 67, revenue: "₹13,40,000" },
    { name: "iPad Air", sales: 29, revenue: "₹17,40,000" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A2A4F]">Dashboard</h1>
          <p className="text-[#70798B] mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-[#F8FAFC] text-[#1A2A4F] rounded-xl border-0 shadow-inner shadow-white/20 focus:outline-none focus:ring-2 focus:ring-[#AFC6FF] transition"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button className="px-5 py-2.5 bg-[#1A2A4F] text-white rounded-xl shadow-md shadow-[#C8D3FF]/50 hover:shadow-lg hover:shadow-[#AFC6FF]/60 transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={metric.trend}
            description={metric.description}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
        <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A2A4F]">Sales Overview</h2>
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 text-sm bg-[#1A2A4F] text-white rounded-xl shadow-sm shadow-[#C8D3FF]/40 transition-all hover:shadow-md">
                Daily
              </button>
              <button className="px-3.5 py-1.5 text-sm rounded-xl text-[#70798B] hover:bg-white/70 transition-colors">
                Weekly
              </button>
              <button className="px-3.5 py-1.5 text-sm rounded-xl text-[#70798B] hover:bg-white/70 transition-colors">
                Monthly
              </button>
            </div>
          </div>
          <Chart type="line" />
        </div>
        <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A2A4F]">Order Status</h2>
            <button className="text-sm font-medium text-[#1A2A4F] hover:underline">
              View Details
            </button>
          </div>
          <Chart type="doughnut" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#1A2A4F]"></div>
              <span className="text-sm text-[#70798B]">Processing (40%)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#7E8CA9]"></div>
              <span className="text-sm text-[#70798B]">Shipped (30%)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#B2BBD5]"></div>
              <span className="text-sm text-[#70798B]">Delivered (20%)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#D8DFF2]"></div>
              <span className="text-sm text-[#70798B]">Pending (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="space-y-6">
          <InventoryAlerts />
          <PerformanceMetrics />
          
          {/* Top Products */}
          <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[#1A2A4F]">Top Products</h2>
              <button className="text-sm font-medium text-[#1A2A4F] hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/60 rounded-xl shadow-sm shadow-[#E6EBFF]/30 hover:shadow-md hover:shadow-[#C8D3FF]/40 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#EEF1FF] rounded-xl flex items-center justify-center text-sm font-semibold text-[#1A2A4F]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#1A2A4F]">{product.name}</p>
                      <p className="text-sm text-[#70798B]">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1A2A4F]">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;