import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import MetricCard from '../../../components/shared/MetricCard';
import Chart from '../../../components/shared/Chart';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value="₹12,45,680"
          change="+18.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Conversion Rate"
          value="3.24%"
          change="+0.8%"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Avg. Order Value"
          value="₹1,980"
          change="+5.2%"
          icon={ShoppingCart}
          trend="up"
        />
        <MetricCard
          title="Return Rate"
          value="2.1%"
          change="-0.5%"
          icon={Users}
          trend="down"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <Chart type="line" />
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
          <Chart type="bar" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Customer Demographics</h2>
          <Chart type="doughnut" />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Top Performing Products</h2>
          <div className="space-y-4">
            {[
              { name: 'iPhone 15 Pro Max', sales: 145, revenue: '₹19,56,550' },
              { name: 'Samsung Galaxy S24', sales: 89, revenue: '₹11,12,411' },
              { name: 'MacBook Pro 16"', sales: 34, revenue: '₹8,49,660' },
              { name: 'AirPods Pro', sales: 234, revenue: '₹5,85,000' },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;