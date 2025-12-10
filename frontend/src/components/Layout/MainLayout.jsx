// components/Layout/MainLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  BarChart3, 
  MessageSquare,
  Menu,
  X,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { useMatches } from '../../contexts/MatchContext';
import Header from '../Header';

const MainLayout = ({ children }) => {
  const { liveMatches, refreshMatches } = useMatches();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/live', label: 'Live Matches', icon: Activity },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
    { path: '/commentary', label: 'Commentary', icon: MessageSquare }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <Header 
        liveCount={liveMatches.length} 
        onRefresh={refreshMatches} 
      />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-0
          h-screen w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/live' && liveMatches.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {liveMatches.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mx-4 mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <h4 className="text-gray-400 text-xs font-semibold uppercase mb-3">
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Live Now</span>
                <span className="text-red-500 font-bold">{liveMatches.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Today</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">This Week</span>
                <span className="text-white font-bold">48</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Page Content */}
          <div className="pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Alternative: Minimal Layout (without sidebar)
export const MinimalLayout = ({ children, showHeader = true }) => {
  const { liveMatches, refreshMatches } = useMatches();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {showHeader && (
        <Header 
          liveCount={liveMatches.length} 
          onRefresh={refreshMatches} 
        />
      )}
      <main>
        {children}
      </main>
    </div>
  );
};

// Centered Layout (for auth pages, etc.)
export const CenteredLayout = ({ children, maxWidth = 'md' }) => {
  const widths = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className={`w-full ${widths[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
};

// Dashboard Layout with Top Bar
export const DashboardLayout = ({ 
  children, 
  title,
  subtitle,
  actions,
  breadcrumbs 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          {breadcrumbs && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  <Link to={crumb.path} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-white">{title}</h1>
              )}
              {subtitle && (
                <p className="text-gray-400 mt-1">{subtitle}</p>
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

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

// Split Layout (50/50 or custom split)
export const SplitLayout = ({ 
  left, 
  right, 
  ratio = '50-50',
  gap = 6 
}) => {
  const ratios = {
    '50-50': 'lg:grid-cols-2',
    '60-40': 'lg:grid-cols-[60%_40%]',
    '70-30': 'lg:grid-cols-[70%_30%]',
    '40-60': 'lg:grid-cols-[40%_60%]',
    '30-70': 'lg:grid-cols-[30%_70%]'
  };

  return (
    <div className={`grid grid-cols-1 ${ratios[ratio]} gap-${gap}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

export default MainLayout;