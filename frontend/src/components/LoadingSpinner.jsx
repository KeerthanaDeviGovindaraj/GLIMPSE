// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  color = 'blue',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
    red: 'border-red-600 border-t-transparent',
    yellow: 'border-yellow-600 border-t-transparent',
    purple: 'border-purple-600 border-t-transparent',
    gray: 'border-gray-600 border-t-transparent'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClass}>
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      />
      
      {/* Loading Text */}
      {text && (
        <p className={`mt-4 ${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Additional spinner variants
export const DotSpinner = ({ color = 'blue' }) => {
  const dotColors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex gap-2">
      <div className={`w-3 h-3 ${dotColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0s' }}></div>
      <div className={`w-3 h-3 ${dotColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`w-3 h-3 ${dotColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export const BarSpinner = ({ color = 'blue' }) => {
  const barColors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex gap-1">
      <div className={`w-1 h-8 ${barColors[color]} animate-pulse`} style={{ animationDelay: '0s' }}></div>
      <div className={`w-1 h-8 ${barColors[color]} animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`w-1 h-8 ${barColors[color]} animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
      <div className={`w-1 h-8 ${barColors[color]} animate-pulse`} style={{ animationDelay: '0.6s' }}></div>
    </div>
  );
};

export const PulseSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-ping`}></div>
  );
};

export default LoadingSpinner;