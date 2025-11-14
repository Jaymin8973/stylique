import React from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const Returns: React.FC = () => {
  const returns = [
    {
      id: '#RET-001',
      orderId: '#ORD-001',
      customer: 'Alice Johnson',
      product: 'iPhone 15 Pro Max',
      reason: 'Defective product',
      amount: 134900,
      status: 'pending',
      date: '2024-01-15',
      requestDate: '2024-01-20'
    },
    {
      id: '#RET-002',
      orderId: '#ORD-145',
      customer: 'Bob Smith',
      product: 'Samsung Galaxy S24',
      reason: 'Changed mind',
      amount: 124999,
      status: 'approved',
      date: '2024-01-12',
      requestDate: '2024-01-18'
    },
    {
      id: '#RET-003',
      orderId: '#ORD-089',
      customer: 'Carol Davis',
      product: 'MacBook Pro 16"',
      reason: 'Wrong item received',
      amount: 249900,
      status: 'processing',
      date: '2024-01-10',
      requestDate: '2024-01-16'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'processing': return <RotateCcw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
        <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Return Policy Settings
        </button>
      </div>

      {/* Return Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
            </div>
            <RotateCcw className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">8</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Return Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.1%</p>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Return Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{returnItem.id}</div>
                    <div className="text-sm text-gray-500">{returnItem.orderId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{returnItem.customer}</div>
                    <div className="text-sm text-gray-500">Requested: {returnItem.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {returnItem.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {returnItem.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{returnItem.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                      {getStatusIcon(returnItem.status)}
                      <span className="ml-1 capitalize">{returnItem.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {returnItem.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Reject
                          </button>
                        </>
                      )}
                      <button className="text-black hover:text-gray-600">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Returns;