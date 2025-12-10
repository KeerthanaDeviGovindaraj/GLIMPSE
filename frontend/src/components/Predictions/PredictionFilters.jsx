// components/Predictions/PredictionFilters.jsx
import React, { useState } from 'react';
import { 
  Filter, 
  TrendingUp,
  Target,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Sliders,
  X
} from 'lucide-react';

const PredictionFilters = ({ 
  onFilterChange,
  activeFilters = {},
  showAdvanced = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvanced);

  const sports = [
    { id: 'all', label: 'All Sports', icon: '🏆' },
    { id: 'football', label: 'Football', icon: '⚽' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'cricket', label: 'Cricket', icon: '🏏' },
    { id: 'tennis', label: 'Tennis', icon: '🎾' }
  ];

  const confidenceLevels = [
    { id: 'all', label: 'All Levels', min: 0, max: 100 },
    { id: 'high', label: 'High (80%+)', min: 80, max: 100 },
    { id: 'medium', label: 'Medium (60-79%)', min: 60, max: 79 },
    { id: 'low', label: 'Low (<60%)', min: 0, max: 59 }
  ];

  const statusOptions = [
    { id: 'all', label: 'All Status', icon: Activity, color: 'blue' },
    { id: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
    { id: 'correct', label: 'Correct', icon: CheckCircle, color: 'green' },
    { id: 'incorrect', label: 'Incorrect', icon: XCircle, color: 'red' }
  ];

  const timeframes = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...activeFilters,
      [filterType]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      sport: 'all',
      confidence: 'all',
      status: 'all',
      timeframe: 'all'
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(v => v && v !== 'all').length;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-red-500" />
          <h3 className="text-white font-semibold">Filter Predictions</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-red-600/20 text-red-500 text-xs px-2 py-1 rounded-full font-semibold">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Sport Filter */}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-3 block flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Sport
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sports.map((sport) => {
                const isActive = (activeFilters.sport || 'all') === sport.id;
                return (
                  <button
                    key={sport.id}
                    onClick={() => handleFilterChange('sport', sport.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{sport.icon}</span>
                    <span>{sport.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidence Level Filter */}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-3 block flex items-center gap-2">
              <Target className="w-4 h-4" />
              Confidence Level
            </label>
            <div className="space-y-2">
              {confidenceLevels.map((level) => {
                const isActive = (activeFilters.confidence || 'all') === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => handleFilterChange('confidence', level.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-red-600/20 border-2 border-red-600 text-white'
                        : 'bg-gray-700/50 border-2 border-transparent text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium">{level.label}</span>
                    {level.id !== 'all' && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              level.id === 'high' ? 'bg-green-500' :
                              level.id === 'medium' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${((level.min + level.max) / 2)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-3 block flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => {
                const Icon = status.icon;
                const isActive = (activeFilters.status || 'all') === status.id;
                const colorClasses = {
                  blue: 'border-blue-500/30 text-blue-500',
                  yellow: 'border-yellow-500/30 text-yellow-500',
                  green: 'border-green-500/30 text-green-500',
                  red: 'border-red-500/30 text-red-500'
                };

                return (
                  <button
                    key={status.id}
                    onClick={() => handleFilterChange('status', status.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isActive
                        ? `bg-${status.color}-500/20 ${colorClasses[status.color]} border-2`
                        : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeframe Filter */}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-3 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeframe
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {timeframes.map((timeframe) => {
                const isActive = (activeFilters.timeframe || 'all') === timeframe.id;
                return (
                  <button
                    key={timeframe.id}
                    onClick={() => handleFilterChange('timeframe', timeframe.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all text-sm ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </span>
          </button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <h4 className="text-white font-semibold text-sm mb-3">Advanced Options</h4>
              
              {/* Minimum Confidence Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-sm">Minimum Confidence</label>
                  <span className="text-white font-semibold">{activeFilters.minConfidence || 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeFilters.minConfidence || 0}
                  onChange={(e) => handleFilterChange('minConfidence', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
                <select
                  value={activeFilters.sortBy || 'confidence'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="confidence">Confidence (High to Low)</option>
                  <option value="date">Date (Newest First)</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="sport">Sport</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Compact Filter Bar
export const CompactPredictionFilters = ({ onFilterChange, activeFilter = 'all' }) => {
  const quickFilters = [
    { id: 'all', label: 'All', icon: Activity },
    { id: 'high', label: 'High Confidence', icon: TrendingUp },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'correct', label: 'Correct', icon: CheckCircle }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              isActive
                ? 'bg-red-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Filter Summary
export const FilterSummary = ({ filters, onClear }) => {
  const activeFilters = Object.entries(filters).filter(([key, value]) => value && value !== 'all');

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-blue-400 text-sm font-medium">Active Filters:</span>
        <button
          onClick={onClear}
          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <div key={key} className="bg-blue-600/20 px-3 py-1 rounded-full text-blue-400 text-xs font-medium">
            {key}: {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionFilters;