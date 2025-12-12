// components/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  Database, 
  Upload, 
  BarChart3, 
  Settings, 
  X, 
  Users,
  FileText,
  Activity
} from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  activePage, 
  onPageChange,
  user 
}) => {
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 z-50 w-64 lg:static transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ 
          background: '#0c1220',
          top: '64px',
          height: 'calc(100vh - 64px)',
          borderRight: 'none',
          boxShadow: 'none'
        }}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{ color: '#9aa4b2', cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => {
                onPageChange('dashboard');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ 
                background: activePage === 'dashboard' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            {/* Sports Management */}
            <button
              onClick={() => {
                onPageChange('sports');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ 
                background: activePage === 'sports' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Database className="w-5 h-5" />
              <span className="text-sm font-medium">Sports Management</span>
            </button>

            {/* Data Upload */}
            <button
              onClick={() => {
                onPageChange('upload');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ 
                background: activePage === 'upload' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">Data Upload</span>
            </button>

            {isAdmin && (
              <>
                {/* Analytics */}
                <button
                  onClick={() => {
                    onPageChange('analytics');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ 
                    background: activePage === 'analytics' ? '#ef4444' : '#1f2937',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>

                {/* User Management */}
                <button
                  onClick={() => {
                    onPageChange('users');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ 
                    background: activePage === 'users' ? '#ef4444' : '#1f2937',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">User Management</span>
                </button>
              </>
            )}

            {/* Reports */}
            <button
              onClick={() => {
                onPageChange('reports');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ 
                background: activePage === 'reports' ? '#ef4444' : '#1f2937',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Reports</span>
            </button>

            {isAdmin && (
              <>
                {/* Activity Log */}
                <button
                  onClick={() => {
                    onPageChange('activity');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ 
                    background: activePage === 'activity' ? '#ef4444' : '#1f2937',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Activity Log</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    onPageChange('settings');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ 
                    background: activePage === 'settings' ? '#ef4444' : '#1f2937',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-4" 
          style={{ 
            background: '#0e1424',
            borderTop: '1px solid #1f2937'
          }}
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ background: isAdmin ? '#10b981' : '#ef4444' }}
            />
            <div>
              <p className="text-xs font-medium capitalize" style={{ color: '#e5e7eb' }}>
                {user?.role || 'User'}
              </p>
              <p className="text-xs" style={{ color: '#9aa4b2' }}>
                {isAdmin ? 'Full Access' : 'Limited Access'}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
              <p className="text-xs" style={{ color: '#9aa4b2' }}>Sports</p>
              <p className="text-lg font-bold" style={{ color: '#e5e7eb' }}>12</p>
            </div>
            <div className="rounded-lg p-2" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
              <p className="text-xs" style={{ color: '#9aa4b2' }}>Uploads</p>
              <p className="text-lg font-bold" style={{ color: '#e5e7eb' }}>8</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;