// components/Analysis/MetricsChart.jsx
import React from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const MetricsChart = ({ 
  data = [], 
  title = 'Chart', 
  type = 'bar',
  height = 300,
  colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Bar Chart Component
  const BarChart = () => {
    const maxValue = Math.max(...data.map(d => {
      if (typeof d.value === 'number') return d.value;
      return Math.max(d.team1 || 0, d.team2 || 0);
    }));

    return (
      <div className="space-y-4">
        {data.map((item, index) => {
          const hasMultipleValues = item.team1 !== undefined && item.team2 !== undefined;
          
          if (hasMultipleValues) {
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{item.name}</span>
                  <div className="flex gap-4">
                    <span className="text-red-500 text-sm font-semibold">{item.team1}</span>
                    <span className="text-blue-500 text-sm font-semibold">{item.team2}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden relative">
                    <div
                      className="bg-red-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(item.team1 / maxValue) * 100}%` }}
                    >
                      {item.team1 > maxValue * 0.15 && (
                        <span className="text-white text-xs font-bold">{item.team1}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden relative">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(item.team2 / maxValue) * 100}%` }}
                    >
                      {item.team2 > maxValue * 0.15 && (
                        <span className="text-white text-xs font-bold">{item.team2}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{item.name}</span>
                <span className="text-white text-sm font-semibold">{item.value}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-6 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                >
                  {item.value > maxValue * 0.15 && (
                    <span className="text-white text-xs font-bold">{item.value}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Pie Chart Component (Simplified visual representation)
  const PieChart = () => {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    let currentAngle = 0;

    return (
      <div className="flex flex-col items-center gap-6">
        {/* Pie Chart Visualization */}
        <div className="relative" style={{ width: '200px', height: '200px' }}>
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              // Calculate path for pie slice
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (currentAngle * Math.PI) / 180;
              const x1 = 100 + 90 * Math.cos(startRad);
              const y1 = 100 + 90 * Math.sin(startRad);
              const x2 = 100 + 90 * Math.cos(endRad);
              const y2 = 100 + 90 * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
            {/* Center circle for donut effect */}
            <circle cx="100" cy="100" r="50" fill="#1f2937" />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-400 truncate">{item.name}</div>
                <div className="text-sm font-semibold text-white">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Line Chart Component
  const LineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value || 0));
    const chartHeight = 200;
    const chartWidth = 100;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height: `${height}px` }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y * 2}
              x2={chartWidth}
              y2={y * 2}
              stroke="#374151"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Line path */}
          <polyline
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * chartWidth;
              const y = chartHeight - (item.value / maxValue) * chartHeight;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={colors[0]}
            strokeWidth="2"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - (item.value / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={colors[0]}
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-400">
              {item.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'pie':
        return <PieChartIcon className="w-5 h-5 text-green-500" />;
      case 'line':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart />;
      case 'pie':
        return <PieChart />;
      case 'line':
        return <LineChart />;
      default:
        return <BarChart />;
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        {getIcon()}
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {renderChart()}
    </div>
  );
};

// Simple Progress Bar Chart
export const ProgressChart = ({ label, value, maxValue, color = 'blue' }) => {
  const percentage = (value / maxValue) * 100;
  
  const colorSchemes = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${colorSchemes[color]} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Radial Progress Chart
export const RadialChart = ({ value, maxValue = 100, size = 120, label, color = '#ef4444' }) => {
  const percentage = (value / maxValue) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            {label && <div className="text-xs text-gray-400">{label}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;