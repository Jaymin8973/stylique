import React from 'react';
import { Truck, Package, MapPin, Clock, Settings } from 'lucide-react';

const Shipping: React.FC = () => {
  const shippingPartners = [
    { name: 'Delhivery', status: 'active', orders: 156, avgTime: '2-3 days', cost: 'From ₹40' },
    { name: 'Blue Dart', status: 'active', orders: 89, avgTime: '1-2 days', cost: 'From ₹80' },
    { name: 'DTDC', status: 'inactive', orders: 45, avgTime: '3-4 days', cost: 'From ₹35' },
  ];

  const recentShipments = [
    { orderId: '#ORD-001', customer: 'Alice Johnson', destination: 'Mumbai', carrier: 'Delhivery', status: 'in_transit', trackingId: 'DEL123456789' },
    { orderId: '#ORD-002', customer: 'Bob Smith', destination: 'Delhi', carrier: 'Blue Dart', status: 'delivered', trackingId: 'BD987654321' },
    { orderId: '#ORD-003', customer: 'Carol Davis', destination: 'Bangalore', carrier: 'Delhivery', status: 'picked_up', trackingId: 'DEL456789123' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Shipping & Delivery</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            Pickup Schedule
          </button>
          <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Shipping Settings
          </button>
        </div>
      </div>

      {/* Shipping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">290</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">In Transit</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">45</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600 mt-1">238</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Delivery Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.3 days</p>
          </div>
        </div>
      </div>

      {/* Shipping Partners */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shipping Partners</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shippingPartners.map((partner, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{partner.name}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(partner.status)}`}>
                    {partner.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Orders handled:</span>
                    <span className="font-medium">{partner.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. delivery:</span>
                    <span className="font-medium">{partner.avgTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">{partner.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Shipments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentShipments.map((shipment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
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

export default Shipping;