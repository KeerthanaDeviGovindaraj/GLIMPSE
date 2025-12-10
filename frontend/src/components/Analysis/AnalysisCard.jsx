// components/Analysis/AnalysisCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Activity } from 'lucide-react';

const AnalysisCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = 'blue',
  subtitle,
  size = 'md'
}) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-500',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-500',
      icon: 'text-red-500'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-500',
      icon: 'text-yellow-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-500',
      icon: 'text-purple-500'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const sizes = {
    sm: {
      padding: 'p-4',
      iconSize: 'w-8 h-8',
      valueSize: 'text-2xl',
      titleSize: 'text-sm'
    },
    md: {
      padding: 'p-6',
      iconSize: 'w-10 h-10',
      valueSize: 'text-3xl',
      titleSize: 'text-base'
    },
    lg: {
      padding: 'p-8',
      iconSize: 'w-12 h-12',
      valueSize: 'text-4xl',
      titleSize: 'text-lg'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`bg-gray-800/50 border ${scheme.border} rounded-xl ${sizeConfig.padding} hover:border-opacity-100 transition-all group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${scheme.bg} ${sizeConfig.iconSize} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {Icon ? <Icon className={`${scheme.icon} w-5 h-5`} /> : <Activity className={`${scheme.icon} w-5 h-5`} />}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className={`text-gray-400 ${sizeConfig.titleSize} font-medium`}>
          {title}
        </h3>
        <p className={`${scheme.text} ${sizeConfig.valueSize} font-bold`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-gray-500 text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// Statistics Card for detailed stats
export const StatsAnalysisCard = ({ stats = [] }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Match Statistics</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">{stat.team1Value}</span>
                <span className="text-gray-600">-</span>
                <span className="text-white font-semibold">{stat.team2Value}</span>
              </div>
            </div>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-700">
              <div 
                className="bg-red-600 transition-all duration-500"
                style={{ width: `${(stat.team1Value / (stat.team1Value + stat.team2Value)) * 100}%` }}
              />
              <div 
                className="bg-blue-600 transition-all duration-500"
                style={{ width: `${(stat.team2Value / (stat.team1Value + stat.team2Value)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Card
export const PerformanceCard = ({ team, stats, color = 'red' }) => {
  const colorSchemes = {
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorSchemes[color]} border rounded-xl p-6`}>
      <h3 className="text-white font-semibold mb-4">{team} Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-gray-400 text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Comparison Card
export const ComparisonCard = ({ team1, team2, metrics }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-6 text-center">Head to Head</h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-500 font-bold text-lg">{metric.team1Value}</span>
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <span className="text-blue-500 font-bold text-lg">{metric.team2Value}</span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-red-600 transition-all duration-500"
                   style={{ width: `${(metric.team1Value / (metric.team1Value + metric.team2Value)) * 50}%` }} />
              <div className="absolute right-0 top-0 bottom-0 bg-blue-600 transition-all duration-500"
                   style={{ width: `${(metric.team2Value / (metric.team1Value + metric.team2Value)) * 50}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
        <span className="text-white font-semibold">{team1}</span>
        <span className="text-gray-500">VS</span>
        <span className="text-white font-semibold">{team2}</span>
      </div>
    </div>
  );
};

export default AnalysisCard;