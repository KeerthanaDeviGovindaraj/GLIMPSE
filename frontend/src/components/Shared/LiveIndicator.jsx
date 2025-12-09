// components/LiveIndicator.jsx
import React from 'react';
import { Radio } from 'lucide-react';

const LiveIndicator = ({ isLive = false, size = 'md', showText = true }) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  const paddingSizes = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-1.5'
  };

  if (!isLive) return null;

  return (
    <div className={`flex items-center gap-2 bg-red-600/20 border border-red-600/30 ${paddingSizes[size]} rounded-full`}>
      <span className={`${sizes[size]} bg-red-500 rounded-full animate-pulse`}></span>
      {showText && (
        <span className={`text-red-500 ${textSizes[size]} font-semibold uppercase tracking-wide`}>
          Live
        </span>
      )}
    </div>
  );
};

export const LiveBadge = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 bg-red-600/20 border border-red-600/30 px-2.5 py-1 rounded-full ${className}`}>
    <Radio className="w-3 h-3 text-red-500" />
    <span className="text-red-500 text-xs font-semibold">LIVE</span>
  </span>
);

export const LiveDot = ({ size = 'sm', animate = true }) => {
  const sizes = {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <span 
      className={`${sizes[size]} bg-red-500 rounded-full ${animate ? 'animate-pulse' : ''}`}
    ></span>
  );
};

export default LiveIndicator;