// components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RefreshCw, Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ liveCount = 0, onRefresh }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/live', label: 'Live Matches' },
  ];

  return (
    <header className="border-b border-red-900/30 bg-gradient-to-r from-gray-900 to-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-red-600 p-2.5 rounded-xl group-hover:bg-red-700 transition-colors">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                InsightOS <span className="text-red-500">Live</span>
              </h1>
              <p className="text-gray-400 text-xs">Real-time Sports Scores</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Live Count Badge */}
            <div className="bg-red-600/20 border border-red-600/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-gray-400 text-xs font-medium">LIVE</span>
              <span className="text-red-500 font-bold">{liveCount}</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              title="Refresh matches"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;