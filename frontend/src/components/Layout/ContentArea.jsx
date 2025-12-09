// components/Layout/ContentArea.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ContentArea = ({ 
  children, 
  className = '',
  loading = false,
  error = null,
  title,
  subtitle,
  actions
}) => {
  if (loading) {
    return (
      <div className={`bg-gray-900 min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-900 min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      {/* Header Section (if title or actions provided) */}
      {(title || actions) && (
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

// Content Section Component
export const ContentSection = ({ 
  title, 
  subtitle,
  children, 
  className = '',
  actions,
  noPadding = false
}) => {
  return (
    <div className={`bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

// Grid Layout for Content
export const ContentGrid = ({ 
  children, 
  cols = 3, 
  gap = 6,
  className = '' 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Content Layout
export const SidebarContentLayout = ({ 
  sidebar, 
  children,
  sidebarPosition = 'left',
  sidebarWidth = 'md'
}) => {
  const widths = {
    sm: 'lg:col-span-1',
    md: 'lg:col-span-1',
    lg: 'lg:col-span-2'
  };

  const mainWidths = {
    sm: 'lg:col-span-3',
    md: 'lg:col-span-3',
    lg: 'lg:col-span-2'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {sidebarPosition === 'left' && (
        <div className={widths[sidebarWidth]}>
          {sidebar}
        </div>
      )}
      <div className={mainWidths[sidebarWidth]}>
        {children}
      </div>
      {sidebarPosition === 'right' && (
        <div className={widths[sidebarWidth]}>
          {sidebar}
        </div>
      )}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="w-16 h-16 text-gray-600 mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ContentArea;