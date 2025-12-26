import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, trend, description }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40 transition-all hover:shadow-lg ">
      <div className="flex items-center justify-between">
        <div className="min-w-0 mr-4">
          <p className="text-sm font-semibold text-[#1A2A4F]/80 truncate">{title}</p>
          <p className="text-2xl font-semibold text-[#1A2A4F] mt-1 truncate">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${trend === 'up' ? 'bg-[#D7F2E3]' : 'bg-[#FDE6E9]'}`}>
          <Icon className="w-6 h-6 text-[#1A2A4F]" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-[#52B788] mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[#F47280] mr-1" />
        )}
        <span className={`text-sm font-semibold ${trend === 'up' ? 'text-[#52B788]' : 'text-[#F47280]'}`}>
          {change}
        </span>
        {description && (
          <span className="text-sm text-[#70798B] ml-1 truncate">{description}</span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;