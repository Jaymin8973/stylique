import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

const InventoryAlerts: React.FC = () => {
    const alerts = [
        { name: 'Product A', stock: 5, status: 'low' },
        { name: 'Product B', stock: 2, status: 'critical' },
        { name: 'Product C', stock: 8, status: 'low' },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-semibold text-[#1A2A4F]">Inventory Alerts</h2>
                    <p className="text-sm text-[#70798B] mt-1">Low stock products</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#EEF1FF] rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-[#1A2A4F]" />
                            </div>
                            <span className="font-medium text-[#1A2A4F]">{alert.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-[#70798B]">{alert.stock} units</span>
                            <span
                                className={`px-2 py-1 text-xs rounded-full font-semibold ${alert.status === 'critical'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {alert.status === 'critical' ? 'Critical' : 'Low'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryAlerts;
