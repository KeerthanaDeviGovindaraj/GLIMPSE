// components/Commentary/CommentaryFilters.jsx
import React, { useState } from 'react';
import { 
  Filter, 
  Target, 
  Flag, 
  User, 
  MessageSquare,
  Zap,
  AlertCircle,
  TrendingUp,
  X,
  Check
} from 'lucide-react';

const CommentaryFilters = ({ 
  onFilterChange, 
  activeFilters = [],
  showClearAll = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const filterOptions = [
    { 
      id: 'all', 
      label: 'All', 
      icon: MessageSquare, 
      color: 'gray',
      description: 'Show all commentary'
    },
    { 
      id: 'goal', 
      label: 'Goals', 
      icon: Target, 
      color: 'green',
      description: 'Goal events'
    },
    { 
      id: 'card', 
      label: 'Cards', 
      icon: Flag, 
      color: 'yellow',
      description: 'Yellow and red cards'
    },
    { 
      id: 'substitution', 
      label: 'Substitutions', 
      icon: User, 
      color: 'blue',
      description: 'Player substitutions'
    },
    { 
      id: 'highlight', 
      label: 'Highlights', 
      icon: Zap, 
      color: 'purple',
      description: 'Key moments'
    },
    { 
      id: 'alert', 
      label: 'Alerts', 
      icon: AlertCircle, 
      color: 'red',
      description: 'Important events'
    },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      icon: TrendingUp, 
      color: 'indigo',
      description: 'Match analysis'
    }
  ];

  const colorSchemes = {
    gray: {
      bg: 'bg-gray-600',
      hover: 'hover:bg-gray-500',
      active: 'bg-gray-600 ring-2 ring-gray-400',
      text: 'text-gray-400'
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-500',
      active: 'bg-green-600 ring-2 ring-green-400',
      text: 'text-green-500'
    },
    yellow: {
      bg: 'bg-yellow-600',
      hover: 'hover:bg-yellow-500',
      active: 'bg-yellow-600 ring-2 ring-yellow-400',
      text: 'text-yellow-500'
    },
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-500',
      active: 'bg-blue-600 ring-2 ring-blue-400',
      text: 'text-blue-500'
    },
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-500',
      active: 'bg-purple-600 ring-2 ring-purple-400',
      text: 'text-purple-500'
    },
    red: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-500',
      active: 'bg-red-600 ring-2 ring-red-400',
      text: 'text-red-500'
    },
    indigo: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-500',
      active: 'bg-indigo-600 ring-2 ring-indigo-400',
      text: 'text-indigo-500'
    }
  };

  const isActive = (filterId) => {
    if (filterId === 'all') {
      return activeFilters.length === 0;
    }
    return activeFilters.includes(filterId);
  };

  const handleFilterClick = (filterId) => {
    if (filterId === 'all') {
      onFilterChange([]);
      return;
    }

    let newFilters;
    if (isActive(filterId)) {
      newFilters = activeFilters.filter(f => f !== filterId);
    } else {
      newFilters = [...activeFilters, filterId];
    }
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-500" />
          <h3 className="text-white font-semibold">Filter Commentary</h3>
          {activeFilters.length > 0 && (
            <span className="bg-red-600/20 text-red-500 text-xs px-2 py-1 rounded-full font-semibold">
              {activeFilters.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <Filter className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const scheme = colorSchemes[filter.color];
              const active = isActive(filter.id);

              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    active
                      ? `${scheme.active} border-transparent`
                      : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                  }`}
                  title={filter.description}
                >
                  <div className={`${active ? 'text-white' : scheme.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-300'}`}>
                      {filter.label}
                    </span>
                  </div>
                  {active && filter.id !== 'all' && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Filters Summary */}
          {activeFilters.length > 0 && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Active Filters:</span>
                {showClearAll && (
                  <button
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filterId) => {
                  const filter = filterOptions.find(f => f.id === filterId);
                  if (!filter) return null;
                  
                  const Icon = filter.icon;
                  const scheme = colorSchemes[filter.color];

                  return (
                    <div
                      key={filterId}
                      className={`flex items-center gap-2 ${scheme.bg} px-3 py-1.5 rounded-full`}
                    >
                      <Icon className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">
                        {filter.label}
                      </span>
                      <button
                        onClick={() => handleFilterClick(filterId)}
                        className="text-white hover:text-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Compact Filter Bar for mobile/inline use
export const CompactCommentaryFilters = ({ onFilterChange, activeFilter = 'all' }) => {
  const filters = [
    { id: 'all', label: 'All', icon: MessageSquare },
    { id: 'goal', label: 'Goals', icon: Target },
    { id: 'card', label: 'Cards', icon: Flag },
    { id: 'highlight', label: 'Highlights', icon: Zap }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => {
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

// Filter Stats Display
export const FilterStats = ({ stats }) => {
  const filterTypes = [
    { id: 'goal', label: 'Goals', color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'card', label: 'Cards', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'substitution', label: 'Subs', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'highlight', label: 'Highlights', color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {filterTypes.map((type) => {
        const count = stats[type.id] || 0;
        return (
          <div key={type.id} className={`${type.bg} rounded-lg p-3 text-center`}>
            <div className={`${type.color} text-2xl font-bold`}>{count}</div>
            <div className="text-gray-400 text-xs mt-1">{type.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentaryFilters;