import React from 'react';

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
}

const Chart: React.FC<ChartProps> = ({ type }) => {
  const renderLineChart = () => (
    <svg width="100%" height="240" className="w-full h-60">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8D3FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C8D3FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={48 * i}
          x2="100%"
          y2={48 * i}
          stroke="#E4E8F5"
          strokeWidth="1"
        />
      ))}
      {/* Data line */}
      <path
        d="M0,180 L60,120 L120,140 L180,80 L240,60 L300,40 L360,20"
        stroke="#1A2A4F"
        strokeWidth="2"
        fill="none"
      />
      {/* Area fill */}
      <path
        d="M0,180 L60,120 L120,140 L180,80 L240,60 L300,40 L360,20 L360,240 L0,240 Z"
        fill="url(#lineGradient)"
      />
      {/* Data points */}
      {[
        { x: 0, y: 180 },
        { x: 60, y: 120 },
        { x: 120, y: 140 },
        { x: 180, y: 80 },
        { x: 240, y: 60 },
        { x: 300, y: 40 },
        { x: 360, y: 20 }
      ].map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#1A2A4F"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      ))}
    </svg>
  );

  const renderBarChart = () => (
    <svg width="100%" height="240" className="w-full h-60">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={48 * i}
          x2="100%"
          y2={48 * i}
          stroke="#E4E8F5"
          strokeWidth="1"
        />
      ))}
      {/* Bars */}
      {[
        { x: 20, height: 120, label: 'Mon' },
        { x: 80, height: 180, label: 'Tue' },
        { x: 140, height: 140, label: 'Wed' },
        { x: 200, height: 200, label: 'Thu' },
        { x: 260, height: 160, label: 'Fri' },
        { x: 320, height: 220, label: 'Sat' }
      ].map((bar, i) => (
        <g key={i}>
          <rect
            x={bar.x}
            y={240 - bar.height}
            width="40"
            height={bar.height}
            fill="#6477B9"
            rx="2"
          />
          <text
            x={bar.x + 20}
            y="250"
            textAnchor="middle"
            className="text-xs fill-[#9AA4B5]"
          >
            {bar.label}
          </text>
        </g>
      ))}
    </svg>
  );

  const renderDoughnutChart = () => (
    <div className="relative w-full h-60 flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#E4E8F5"
          strokeWidth="16"
        />
        {/* Data segments */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#1A2A4F"
          strokeWidth="16"
          strokeDasharray={`${2 * Math.PI * 80 * 0.4} ${2 * Math.PI * 80}`}
          strokeDashoffset="0"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#7E8CA9"
          strokeWidth="16"
          strokeDasharray={`${2 * Math.PI * 80 * 0.3} ${2 * Math.PI * 80}`}
          strokeDashoffset={`-${2 * Math.PI * 80 * 0.4}`}
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#B2BBD5"
          strokeWidth="16"
          strokeDasharray={`${2 * Math.PI * 80 * 0.2} ${2 * Math.PI * 80}`}
          strokeDashoffset={`-${2 * Math.PI * 80 * 0.7}`}
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#D8DFF2"
          strokeWidth="16"
          strokeDasharray={`${2 * Math.PI * 80 * 0.1} ${2 * Math.PI * 80}`}
          strokeDashoffset={`-${2 * Math.PI * 80 * 0.9}`}
        />
      </svg>
      {/* Center text */}
      <div className="absolute text-center">
        <div className="text-2xl font-semibold text-[#1A2A4F]">1,247</div>
        <div className="text-sm text-[#70798B]">Total Orders</div>
      </div>
    </div>
  );

  return (
    <div className="h-64">
      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'doughnut' && renderDoughnutChart()}
    </div>
  );
};

export default Chart;