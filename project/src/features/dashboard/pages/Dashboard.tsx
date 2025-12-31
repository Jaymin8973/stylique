import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, AlertTriangle, DollarSign, Download, TrendingUp } from 'lucide-react';
import MetricCard from '../../../components/shared/MetricCard';
import Chart from '../../../components/shared/Chart';
import RecentOrders from '../components/RecentOrders';
import InventoryAlerts from '../components/InventoryAlerts';
import PerformanceMetrics from '../components/PerformanceMetrics';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, isLoading: loading, error } = useDashboard();
  const [timeRange, setTimeRange] = useState('7');
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleExportReport = () => {
    // Generate CSV report
    const csvContent = `Dashboard Report - ${new Date().toLocaleDateString()}\n\n` +
      `Total Products,${stats?.totalProducts || 0}\n` +
      `Total Orders,${stats?.totalOrders || 0}\n` +
      `Total Revenue,₹${(stats?.totalRevenue || 0).toLocaleString()}\n` +
      `Low Stock Products,${stats?.lowStockProducts || 0}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  type Metric = {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down';
    description?: string;
    onClick?: () => void;
  };

  const metrics: Metric[] = [
    {
      title: "Total Products",
      value: stats ? String(stats.totalProducts) : (loading ? '…' : '—'),
      change: "+12%",
      icon: Package,
      trend: "up",
      description: error ? 'Error loading' : 'From database',
      onClick: () => navigate('/products')
    },
    {
      title: "Orders",
      value: stats ? String(stats.totalOrders) : (loading ? '…' : '—'),
      change: "+8%",
      icon: ShoppingCart,
      trend: "up",
      description: error ? 'Error loading' : 'From database',
      onClick: () => navigate('/orders')
    },
    {
      title: "Revenue",
      value: stats ? `₹${(stats.totalRevenue || 0).toLocaleString()}` : (loading ? '…' : '—'),
      change: "+23%",
      icon: DollarSign,
      trend: "up",
      description: error ? 'Error loading' : 'Completed orders',
      onClick: () => navigate('/sales')
    },
    {
      title: "Low Stock",
      value: stats ? String(stats.lowStockProducts) : (loading ? '…' : '—'),
      change: "-5%",
      icon: AlertTriangle,
      trend: "down",
      description: error ? 'Error loading' : '< 10 units',
      onClick: () => navigate('/products')
    },
  ];

  const topProducts = [
    { name: "Premium Cotton T-Shirt", sales: 145, revenue: "₹72,500" },
    { name: "Denim Jeans", sales: 98, revenue: "₹1,47,000" },
    { name: "Running Shoes", sales: 67, revenue: "₹2,01,000" },
    { name: "Leather Wallet", sales: 156, revenue: "₹93,600" },
    { name: "Casual Sneakers", sales: 89, revenue: "₹1,33,500" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2A4F]">Dashboard</h1>
          <p className="text-[#70798B] mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white text-[#1A2A4F] rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#AFC6FF] transition"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A2A4F] text-white rounded-xl shadow-md hover:bg-[#2A3A5F] transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {metrics.map((metric, index) => (
          <div
            key={index}
            onClick={metric.onClick}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          >
            <MetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              trend={metric.trend}
              description={metric.description}
            />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1A2A4F]">Sales Overview</h2>
              <p className="text-sm text-[#70798B] mt-1">Track your sales performance</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartView('daily')}
                className={`px-3.5 py-1.5 text-sm rounded-xl transition-all ${chartView === 'daily'
                  ? 'bg-[#1A2A4F] text-white shadow-sm'
                  : 'text-[#70798B] hover:bg-gray-100'
                  }`}
              >
                Daily
              </button>
              <button
                onClick={() => setChartView('weekly')}
                className={`px-3.5 py-1.5 text-sm rounded-xl transition-all ${chartView === 'weekly'
                  ? 'bg-[#1A2A4F] text-white shadow-sm'
                  : 'text-[#70798B] hover:bg-gray-100'
                  }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3.5 py-1.5 text-sm rounded-xl transition-all ${chartView === 'monthly'
                  ? 'bg-[#1A2A4F] text-white shadow-sm'
                  : 'text-[#70798B] hover:bg-gray-100'
                  }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <Chart type="line" />
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">+23% vs last period</span>
            </div>
            <button
              onClick={() => navigate('/sales')}
              className="text-[#1A2A4F] hover:underline font-medium"
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1A2A4F]">Order Status</h2>
              <p className="text-sm text-[#70798B] mt-1">Current order distribution</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm font-medium text-[#1A2A4F] hover:underline"
            >
              View All →
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
              <div className="w-3 h-3 rounded-full bg-[#52B788]"></div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="space-y-6">
          <InventoryAlerts />
          <PerformanceMetrics />

          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-[#1A2A4F]">Top Products</h2>
                <p className="text-sm text-[#70798B] mt-1">Best selling items</p>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="text-sm font-medium text-[#1A2A4F] hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/products')}
                >
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#1A2A4F] to-[#2A3A5F] p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <h3 className="text-xl font-semibold">Ready to grow your business?</h3>
            <p className="text-gray-300 mt-1">Explore our tools to boost your sales and reach more customers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-white text-[#1A2A4F] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate('/promotions')}
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Create Promotion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;