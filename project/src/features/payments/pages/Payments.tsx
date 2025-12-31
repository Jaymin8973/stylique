import React from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

const Payments: React.FC = () => {
  const payouts = [
    { date: '2024-01-15', amount: 45680, status: 'completed', orders: 23, commission: 2284 },
    { date: '2024-01-08', amount: 38950, status: 'completed', orders: 19, commission: 1948 },
    { date: '2024-01-01', amount: 52340, status: 'processing', orders: 27, commission: 2617 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Payouts</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Tax Report
          </button>
          <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Settings
          </button>
        </div>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹12,45,680</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15.3% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">₹52,340</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">Next payout: Jan 22</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Platform Commission</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹62,284</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">5% avg rate</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Earnings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹11,83,396</p>
          </div>
          <p className="text-sm text-green-600 mt-2">+18.7% growth</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payout Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map((payout, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payout.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payout.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{payout.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(payout.amount - payout.commission).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bank Account</p>
                  <p className="text-sm text-gray-500">HDFC Bank •••• 1234</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Primary
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">UPI</p>
                  <p className="text-sm text-gray-500">seller@upi</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                Backup
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;