import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin,
    User, Mail, Phone, CreditCard, Calendar, DollarSign, FileText,
    Download, Printer, RefreshCw, Edit
} from 'lucide-react';

import { useOrders } from '../hooks/useOrders';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Hooks
    const { useOrder, updateStatus, shipOrder, isUpdating: isStatusUpdating, isShipping: isOrderShipping, downloadInvoice } = useOrders();
    const { data: order, isLoading: loading, error: queryError, refetch } = useOrder(Number(id));
    const error = queryError ? (queryError as Error).message : null;

    // Local UI state
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showShipModal, setShowShipModal] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({ courier: '', trackingNumber: '' });

    const handleShipOrder = async () => {
        if (!shippingDetails.courier || !shippingDetails.trackingNumber || !id) return;

        try {
            await shipOrder({
                id: Number(id),
                details: shippingDetails
            });
            setShowShipModal(false);
            setShippingDetails({ courier: '', trackingNumber: '' });
            // Toast handled by hook
        } catch (err: any) {
            // Toast handled by hook
        }
    };

    const [downloading, setDownloading] = useState(false);

    const handleDownloadInvoice = async () => {
        if (!id) return;

        setDownloading(true);
        try {
            const url = await downloadInvoice(Number(id));
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-order-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert(err.message || 'Failed to download invoice');
        } finally {
            setDownloading(false);
        }
    };

    const handlePrintLabel = () => {
        if (!order) return;

        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=400,height=600');
        if (!printWindow) {
            alert('Please allow popups to print shipping label');
            return;
        }

        const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A';

        // Generate HTML for shipping label (Myntra-style packing slip)
        const labelHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shipping Label - Order #${order.id}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 10px;
                        background: white;
                    }
                    .label-container {
                        border: 2px solid #000;
                        padding: 15px;
                        max-width: 400px;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                    }
                    .logo {
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 2px;
                    }
                    .order-info {
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 1px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                        font-size: 12px;
                    }
                    .section {
                        margin-bottom: 15px;
                    }
                    .section-title {
                        font-size: 10px;
                        font-weight: bold;
                        text-transform: uppercase;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .address-block {
                        font-size: 14px;
                        line-height: 1.5;
                    }
                    .customer-name {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .product-info {
                        background: #f5f5f5;
                        padding: 10px;
                        border-radius: 4px;
                        font-size: 12px;
                    }
                    .product-name {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .product-details {
                        display: flex;
                        justify-content: space-between;
                    }
                    .barcode-section {
                        text-align: center;
                        border-top: 2px solid #000;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .order-id-large {
                        font-size: 24px;
                        font-weight: bold;
                        letter-spacing: 3px;
                    }
                    .barcode {
                        font-family: 'Libre Barcode 39', monospace;
                        font-size: 48px;
                        letter-spacing: 5px;
                    }
                    .cod-badge {
                        display: inline-block;
                        background: #000;
                        color: #fff;
                        padding: 3px 10px;
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 3px;
                        margin-left: 10px;
                    }
                    .prepaid-badge {
                        display: inline-block;
                        background: #22c55e;
                        color: #fff;
                        padding: 3px 10px;
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 3px;
                        margin-left: 10px;
                    }
                    .amount-section {
                        text-align: center;
                        font-size: 20px;
                        font-weight: bold;
                        padding: 10px;
                        background: #f0f0f0;
                        border-radius: 4px;
                        margin-top: 10px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        margin-top: 15px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .label-container {
                            border: 2px solid #000;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="label-container">
                    <div class="header">
                        <div class="logo">STYLIQUE</div>
                    </div>
                    
                    <div class="order-info">
                        <div><strong>Order #:</strong> ${order.id}</div>
                        <div><strong>Date:</strong> ${orderDate}</div>
                        <span class="prepaid-badge">PREPAID</span>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Ship To:</div>
                        <div class="address-block">
                            <div class="customer-name">${order.customer_name}</div>
                            <div>${order.shipping_address || 'Address not provided'}</div>
                            <div style="margin-top: 5px;">
                                <strong>Email:</strong> ${order.customer_email}
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Product Details:</div>
                        <div class="product-info">
                            <div class="product-name">${order.product_name || 'Product'}</div>
                            <div class="product-details">
                                <span>Qty: ${order.quantity}</span>
                                <span>SKU: #${order.product_id}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="amount-section">
                        Amount: ₹${(order.total_amount || 0).toLocaleString()}
                    </div>
                    
                    <div class="barcode-section">
                        <div class="order-id-large">ORD${String(order.id).padStart(8, '0')}</div>
                        <div style="font-size: 10px; color: #666; margin-top: 5px;">
                            *ORD${String(order.id).padStart(8, '0')}*
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div>Handle with care • Do not bend</div>
                        <div style="margin-top: 5px;">www.stylique.com | support@stylique.com</div>
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(labelHTML);
        printWindow.document.close();
    };



    /**
     * Status ke icon return karta hai
     * Har status ka apna icon hai
     */
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5" />;
            case 'processing': return <Package className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'out_for_delivery': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            case 'return_requested': return <RefreshCw className="w-5 h-5" />;
            case 'return_approved': return <RefreshCw className="w-5 h-5" />;
            case 'return_picked': return <Truck className="w-5 h-5" />;
            case 'refunded': return <DollarSign className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    /**
     * Status ke color classes return karta hai
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'return_requested': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'return_approved': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'return_picked': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    /**
     * Generates order timeline
     * Shows completed/active based on current status
     */
    const getOrderTimeline = (status: string) => {
        // Separate timeline for return flow
        if (['return_requested', 'return_approved', 'return_picked', 'refunded'].includes(status)) {
            const returnTimeline = [
                { label: 'Delivered', status: 'delivered', completed: true },
                { label: 'Return Requested', status: 'return_requested', completed: false },
                { label: 'Return Approved', status: 'return_approved', completed: false },
                { label: 'Picked Up', status: 'return_picked', completed: false },
                { label: 'Refunded', status: 'refunded', completed: false },
            ];
            const returnOrder = ['delivered', 'return_requested', 'return_approved', 'return_picked', 'refunded'];
            const currentIndex = returnOrder.indexOf(status);
            return returnTimeline.map((item, index) => ({
                ...item,
                completed: index <= currentIndex,
                active: index === currentIndex,
            }));
        }

        // Normal order flow
        const timeline = [
            { label: 'Order Placed', status: 'pending', completed: true },
            { label: 'Confirmed', status: 'confirmed', completed: false },
            { label: 'Processing', status: 'processing', completed: false },
            { label: 'Shipped', status: 'shipped', completed: false },
            { label: 'Delivered', status: 'delivered', completed: false },
        ];

        if (status === 'cancelled') {
            return [{ label: 'Cancelled', status: 'cancelled', completed: true, active: true }];
        }

        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
        const currentIndex = statusOrder.indexOf(status);

        return timeline.map((item, index) => ({
            ...item,
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    const handleUpdateStatus = async () => {
        if (!selectedStatus || !id) return;
        console.log(selectedStatus);
        try {
            await updateStatus({ id: Number(id), status: selectedStatus });
            setShowStatusModal(false);
            setSelectedStatus('');
            // Toast handled by hook
        } catch (err: any) {
            console.log(err.message);
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
                    <button
                        onClick={handlePrintLabel}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Label
                    </button>
                    <button
                        onClick={handleDownloadInvoice}
                        disabled={downloading}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className={`w-4 h-4 mr-2 ${downloading ? 'animate-pulse' : ''}`} />
                        {downloading ? 'Downloading...' : 'Invoice'}
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
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
                    <div className="flex space-x-3">
                        {/* Only show Ship button for confirmed/processing */}
                        {['confirmed', 'processing'].includes(order.status) && (
                            <button
                                onClick={() => setShowShipModal(true)}
                                className="flex items-center text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Truck className="w-4 h-4 mr-1" />
                                Ship Order
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setSelectedStatus('');  // Start with empty, user must pick a new status
                                setShowStatusModal(true);
                            }}
                            className="flex items-center text-sm text-black hover:text-gray-600"
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Update Status
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {/* ... existing status modal code ... */}
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
                                    <option value="" disabled>Select new status</option>

                                    {/* Helper to check if status is permitted */}
                                    {(() => {
                                        const current = order.status;
                                        console.log(current);
                                        const transitions: Record<string, string[]> = {
                                            'pending': ['confirmed', 'cancelled'],
                                            'confirmed': ['processing', 'cancelled'],
                                            'processing': ['shipped', 'cancelled'],
                                            'shipped': ['out_for_delivery', 'delivered'],
                                            'out_for_delivery': ['delivered'],
                                            'delivered': ['return_requested'],
                                            'return_requested': ['return_approved', 'delivered'],
                                            'return_approved': ['return_picked',],
                                            'return_picked': ['refunded'],
                                            'cancelled': [],
                                            'refunded': []
                                        };

                                        const displayNames: Record<string, string> = {
                                            'pending': 'Pending',
                                            'confirmed': 'Confirmed',
                                            'processing': 'Processing',
                                            'shipped': 'Shipped',
                                            'out_for_delivery': 'Out for Delivery',
                                            'delivered': 'Delivered',
                                            'cancelled': 'Cancelled',
                                            'return_requested': 'Return Requested',
                                            'return_approved': 'Return Approved',
                                            'return_picked': 'Return Picked Up',
                                            'refunded': 'Refunded'
                                        };

                                        const allowed = transitions[current] || [];

                                        // Include current status just in case
                                        return allowed.map(status => (
                                            <option key={status} value={status}>
                                                {displayNames[status] || status}
                                            </option>
                                        ));
                                    })()}
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isStatusUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={isStatusUpdating || !selectedStatus}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isStatusUpdating ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ship Order Modal */}
            {showShipModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Ship Order</h3>
                            <button
                                onClick={() => setShowShipModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Courier Name
                                </label>
                                <input
                                    type="text"
                                    value={shippingDetails.courier}
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, courier: e.target.value })}
                                    placeholder="e.g. Delhivery, BlueDart"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tracking Number / AWB
                                </label>
                                <input
                                    type="text"
                                    value={shippingDetails.trackingNumber}
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, trackingNumber: e.target.value })}
                                    placeholder="e.g. 1234567890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={() => setShowShipModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isOrderShipping}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShipOrder}
                                    disabled={isOrderShipping || !shippingDetails.courier || !shippingDetails.trackingNumber}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isOrderShipping ? 'Shipping...' : 'Mark as Shipped'}
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
