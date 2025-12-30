import React from 'react';
import { RotateCcw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';

const Returns: React.FC = () => {
  // Use the useOrders hook
  const { orders, isLoading: loading, updateStatus } = useOrders();

  // Filter for return requests
  const returns = orders.filter(o =>
    ['return_requested', 'return_approved', 'return_picked', 'refunded'].includes(o.status)
  );

  const handleApprove = async (id: number) => {
    if (!confirm('Are you sure you want to approve this return?')) return;
    try {
      await updateStatus({ id, status: 'return_approved' });
      // Toast handled by hook
    } catch (error) {
      // Toast handled by hook
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Rejecting will set status back to Delivered. Continue?')) return;
    try {
      await updateStatus({ id, status: 'delivered' });
      // Toast handled by hook
    } catch (error) {
      // Toast handled by hook
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'return_requested': return <Clock className="w-4 h-4" />;
      case 'return_approved': return <CheckCircle className="w-4 h-4" />;
      case 'return_picked': return <RotateCcw className="w-4 h-4" />;
      case 'refunded': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'return_requested': return 'bg-yellow-100 text-yellow-800';
      case 'return_approved': return 'bg-green-100 text-green-800';
      case 'return_picked': return 'bg-blue-100 text-blue-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'return_requested').length,
    processing: returns.filter(r => ['return_approved', 'return_picked'].includes(r.status)).length,
    rate: returns.length > 0 ? 'N/A' : '0%' // Calculate if total orders known
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading returns...</div>;
  }

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
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <RotateCcw className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-gray-500">No return requests found</td></tr>
              ) : (
                returns.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                      <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.customer_name}</div>
                      <div className="text-sm text-gray-500">{item.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product_name} (x{item.quantity})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.return_reason || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {item.status === 'return_requested' && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded hover:bg-green-100"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Returns;