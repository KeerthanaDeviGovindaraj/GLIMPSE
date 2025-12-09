// components/MatchSelector.jsx
import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const MatchSelector = ({ onFilterChange, currentFilter = 'all' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sports = [
    { value: 'all', label: 'All Sports', icon: '🏆' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'basketball', label: 'Basketball', icon: '🏀' },
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'tennis', label: 'Tennis', icon: '🎾' },
    { value: 'rugby', label: 'Rugby', icon: '🏉' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Matches' },
    { value: 'live', label: 'Live Now' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'finished', label: 'Finished' }
  ];

  const handleSportClick = (sport) => {
    onFilterChange({ sport: sport.value, status: 'all' });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-500" />
          <h3 className="text-white font-semibold">Filter Matches</h3>
        </div>
      </div>

      {/* Sport Filters */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm font-medium mb-3 block">
          Select Sport
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sports.map((sport) => (
            <button
              key={sport.value}
              onClick={() => handleSportClick(sport)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                currentFilter === sport.value
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{sport.icon}</span>
              <span className="text-sm">{sport.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <label className="text-gray-400 text-sm font-medium mb-3 block">
          Match Status
        </label>
        <div className="space-y-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange({ sport: currentFilter, status: filter.value })}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              <span className="text-sm font-medium">{filter.label}</span>
              <span className={`w-2 h-2 rounded-full ${
                filter.value === 'live' ? 'bg-red-500 animate-pulse' :
                filter.value === 'upcoming' ? 'bg-blue-500' :
                filter.value === 'finished' ? 'bg-gray-500' :
                'bg-gray-400'
              }`}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-red-500 text-2xl font-bold">12</div>
            <div className="text-gray-400 text-xs">Live</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 text-2xl font-bold">8</div>
            <div className="text-gray-400 text-xs">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-2xl font-bold">24</div>
            <div className="text-gray-400 text-xs">Finished</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for mobile
export const CompactMatchSelector = ({ onFilterChange, currentFilter = 'all' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sports = [
    { value: 'all', label: 'All Sports', icon: '🏆' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'basketball', label: 'Basketball', icon: '🏀' },
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'tennis', label: 'Tennis', icon: '🎾' },
    { value: 'rugby', label: 'Rugby', icon: '🏉' }
  ];

  const currentSport = sports.find(s => s.value === currentFilter) || sports[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentSport.icon}</span>
          <span className="font-medium">{currentSport.label}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
            {sports.map((sport) => (
              <button
                key={sport.value}
                onClick={() => {
                  onFilterChange({ sport: sport.value });
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                  currentFilter === sport.value ? 'bg-red-600/20 text-red-500' : 'text-gray-300'
                }`}
              >
                <span className="text-lg">{sport.icon}</span>
                <span className="font-medium">{sport.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchSelector;