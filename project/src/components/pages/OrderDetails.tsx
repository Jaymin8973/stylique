import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin,
    User, Mail, Phone, CreditCard, Calendar, DollarSign, FileText,
    Download, Printer, RefreshCw, Edit
} from 'lucide-react';
import { apiService, type Order } from '../../services/api';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadOrderDetails();
    }, [id]);

    const loadOrderDetails = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const orders = await apiService.getOrders();
            const foundOrder = orders.find(o => o.id === Number(id));
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError('Order not found');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing': return <Package className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            case 'pending': return <Clock className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getOrderTimeline = (status: string) => {
        const timeline = [
            { label: 'Order Placed', status: 'pending', completed: true },
            { label: 'Processing', status: 'processing', completed: false },
            { label: 'Shipped', status: 'shipped', completed: false },
            { label: 'Delivered', status: 'delivered', completed: false },
        ];

        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(status);

        return timeline.map((item, index) => ({
            ...item,
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    const handleUpdateStatus = async () => {
        if (!selectedStatus || !id) return;

        setUpdating(true);
        try {
            const response = await fetch(`http://localhost:5001/api/orders/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status: selectedStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedOrder = await response.json();

            // Map the updated order to match our Order type
            const mappedOrder: Order = {
                id: updatedOrder.id,
                customer_name: updatedOrder.user?.Username || `User #${updatedOrder.userId}`,
                customer_email: updatedOrder.user?.Email || '',
                product_id: updatedOrder.items[0]?.productId || 0,
                product_name: updatedOrder.items[0]?.productName || 'Product',
                quantity: updatedOrder.items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0),
                total_amount: Number.parseFloat(updatedOrder.total || '0'),
                status: updatedOrder.status,
                shipping_address: updatedOrder.addressText || '',
                created_at: updatedOrder.createdAt,
                updated_at: updatedOrder.updatedAt
            };

            setOrder(mappedOrder);
            setShowStatusModal(false);
            setSelectedStatus('');
        } catch (err: any) {
            alert(err.message || 'Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">Order Not Found</p>
                    <p className="text-gray-500 mb-4">{error || 'The order you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const timeline = getOrderTimeline(order.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                        <p className="text-gray-500 mt-1">
                            Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                    </button>
                    <button
                        onClick={loadOrderDetails}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
                <div className="relative">
                    <div className="flex justify-between items-center">
                        {timeline.map((item, index) => (
                            <div key={item.status} className="flex-1 relative">
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${item.completed
                                        ? 'bg-green-100 border-green-500 text-green-700'
                                        : 'bg-gray-100 border-gray-300 text-gray-400'
                                        }`}>
                                        {item.completed ? <CheckCircle className="w-6 h-6" /> : getStatusIcon(item.status)}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {item.label}
                                    </p>
                                </div>
                                {index < timeline.length - 1 && (
                                    <div className={`absolute top-6 left-1/2 w-full h-0.5 ${item.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`} style={{ transform: 'translateY(-50%)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2 capitalize">{order.status}</span>
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedStatus(order.status);
                            setShowStatusModal(true);
                        }}
                        className="flex items-center text-sm text-black hover:text-gray-600"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Update Status
                    </button>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || !selectedStatus}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{order.product_name || 'Product'}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                                    <p className="text-sm text-gray-500">Product ID: #{order.product_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">₹{(order.total_amount || 0).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">₹{((order.total_amount || 0) / (order.quantity || 1)).toLocaleString()} each</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{(order.total_amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">₹0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">₹0</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">₹{(order.total_amount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.shipping_address || 'No address provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Shipping Method</p>
                                    <p className="text-sm text-gray-600 mt-1">Standard Delivery (3-5 business days)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Name</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.customer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm text-gray-600 mt-1">+91 XXXXXXXXXX</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Payment Method</p>
                                    <p className="text-sm text-gray-600 mt-1">Credit Card</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Payment Status</p>
                                    <span className="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Paid
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Transaction Date</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
                        <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600">No notes added for this order.</p>
                                <button className="text-sm text-black hover:text-gray-600 mt-2">
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
