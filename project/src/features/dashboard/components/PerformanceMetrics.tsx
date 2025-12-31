import React from 'react';
import { Star, TrendingUp, Clock } from 'lucide-react';

const PerformanceMetrics: React.FC = () => {
  return (
    <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40">
      <h2 className="text-xl font-semibold text-[#1A2A4F] mb-5">Performance</h2>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-4 h-4 text-[#F4C15D]" />
            <span className="text-sm font-medium text-[#70798B]">Rating</span>
          </div>
          <span className="text-sm font-semibold text-[#1A2A4F]">4.8/5</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-4 h-4 text-[#52B788]" />
            <span className="text-sm font-medium text-[#70798B]">Fulfillment Rate</span>
          </div>
          <span className="text-sm font-semibold text-[#1A2A4F]">98.5%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-[#7E8CA9]" />
            <span className="text-sm font-medium text-[#70798B]">Avg. Response</span>
          </div>
          <span className="text-sm font-semibold text-[#1A2A4F]">2.3 hrs</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;