import React from 'react';
import { Users, Mail, Phone, MapPin, Star } from 'lucide-react';

const Customers: React.FC = () => {
  const customers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      orders: 15,
      totalSpent: 45680,
      rating: 4.8,
      lastOrder: '2024-01-15'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+91 87654 32109',
      location: 'Delhi, NCR',
      orders: 8,
      totalSpent: 23450,
      rating: 4.6,
      lastOrder: '2024-01-12'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      phone: '+91 76543 21098',
      location: 'Bangalore, Karnataka',
      orders: 22,
      totalSpent: 67890,
      rating: 4.9,
      lastOrder: '2024-01-14'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Mail className="w-4 h-4 mr-2" />
          Send Campaign
        </button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">892</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Active This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹2,340</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">4.7/5</p>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Customer Directory</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {customer.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.orders} Orders</p>
                      <p className="text-xs text-gray-500">Last: {customer.lastOrder}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{customer.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;