// pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Upload, 
  Database,
  Calendar,
  Users,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

function AdminDashboard({ showToast, showSuccess, currentUser, onPageChange }) {
  const [stats, setStats] = useState({
    totalSports: 0,
    activeSports: 0,
    totalUploads: 0,
    storageUsed: 0
  });

  const [loading, setLoading] = useState(false);
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  // Mock data - replace with real API calls
  const mockStats = {
    totalSports: 24,
    activeSports: 18,
    totalUploads: 156,
    storageUsed: 2.4 // GB
  };

  const recentActivities = [
    { id: 1, action: 'New sport added', sport: 'Basketball', time: '2 hours ago', type: 'add' },
    { id: 2, action: 'Data uploaded', sport: 'Football', time: '5 hours ago', type: 'upload' },
    { id: 3, action: 'Sport updated', sport: 'Tennis', time: '1 day ago', type: 'update' },
    { id: 4, action: 'Report generated', sport: 'Cricket', time: '2 days ago', type: 'report' },
  ];

  const topSports = [
    { name: 'Football', players: 1250, trend: 12 },
    { name: 'Basketball', players: 980, trend: 8 },
    { name: 'Tennis', players: 756, trend: -3 },
    { name: 'Cricket', players: 634, trend: 15 },
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
      showSuccess?.('Data refreshed successfully!');
    }, 1000);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setStats(mockStats), 500);
  }, []);

  // USER DASHBOARD (Limited View)
  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner - GRAY for Users */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' }}>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              Welcome back, {currentUser?.name || 'User'}! 👋
            </h1>
            <p className="text-lg" style={{ color: '#9aa4b2' }}>
              👁️ View-only access - View your sports activities and schedules
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* Limited Stats - Only 3 cards for users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                <Activity className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>My Sports</h3>
            <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>5</p>
            <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>registered sports</p>
          </div>

          <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                <Calendar className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Upcoming Events</h3>
            <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>8</p>
            <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>this month</p>
          </div>

          <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
                <Users className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
            </div>
            <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Team Memberships</h3>
            <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>3</p>
            <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>active teams</p>
          </div>
        </div>

        {/* User Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#e5e7eb' }}>My Registered Sports</h3>
            <div className="space-y-3">
              {['Football', 'Basketball', 'Tennis', 'Swimming', 'Badminton'].map((sport, idx) => (
                <div key={idx} className="p-3 rounded-lg flex items-center justify-between" style={{ background: '#0e1424' }}>
                  <span className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{sport}</span>
                  <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#e5e7eb' }}>Upcoming Schedule</h3>
            <div className="space-y-3">
              {[
                { event: 'Football Practice', time: 'Today, 4:00 PM' },
                { event: 'Basketball Match', time: 'Tomorrow, 6:00 PM' },
                { event: 'Tennis Tournament', time: 'Dec 15, 10:00 AM' },
                { event: 'Swimming Session', time: 'Dec 16, 7:00 AM' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg" style={{ background: '#0e1424' }}>
                  <div className="text-sm font-medium mb-1" style={{ color: '#e5e7eb' }}>{item.event}</div>
                  <div className="text-xs" style={{ color: '#9aa4b2' }}>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Restriction Notice - ONLY FOR USERS */}
        <div className="p-6 rounded-lg border" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: '#ef4444' }}>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ef4444' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>!</span>
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#ef4444' }}>🔒 Limited Access - View Only Mode</p>
              <p className="text-xs" style={{ color: '#9aa4b2' }}>
                You have restricted access to this system. You cannot add sports, upload data, generate reports, or modify settings. Contact your administrator for elevated permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD (Full Access)
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner - RED for Admin */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            Welcome back, {currentUser?.name || 'Admin User'}! 👋
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
            ✅ Full administrative access to sports management system
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ 
              background: '#0e1424',
              color: '#e5e7eb',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <span className="text-sm" style={{ color: '#9aa4b2' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid - ALL 4 CARDS for Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sports */}
        <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10b981' }}>
              <TrendingUp className="w-4 h-4" />
              +5%
            </span>
          </div>
          <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Total Sports</h3>
          <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>{stats.totalSports}</p>
          <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>from last month</p>
        </div>

        {/* Active Sports */}
        <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Activity className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10b981' }}>
              <TrendingUp className="w-4 h-4" />
              +3%
            </span>
          </div>
          <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Active Sports</h3>
          <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>{stats.activeSports}</p>
          <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>from last week</p>
        </div>

        {/* Total Uploads */}
        <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Upload className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10b981' }}>
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Total Uploads</h3>
          <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>{stats.totalUploads}</p>
          <p className="text-xs mt-1" style={{ color: '#9aa4b2' }}>from last month</p>
        </div>

        {/* Storage Used */}
        <div className="group hover:scale-105 transition-transform p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Database className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <span className="text-xs" style={{ color: '#9aa4b2' }}>of 10 GB</span>
          </div>
          <h3 className="text-sm mb-1" style={{ color: '#9aa4b2' }}>Storage Used</h3>
          <p className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>{stats.storageUsed} GB</p>
          <div className="mt-2 w-full rounded-full h-2" style={{ background: '#0e1424' }}>
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ background: '#ef4444', width: `${(stats.storageUsed / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Row - RED/BLACK THEME */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sports */}
        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Top Sports by Popularity</h3>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Most active sports this month</p>
            </div>
            <Award className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div className="space-y-4">
            {topSports.map((sport, index) => (
              <div key={sport.name} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium" style={{ color: '#e5e7eb' }}>{sport.name}</span>
                    <span className="text-sm" style={{ color: '#9aa4b2' }}>{sport.players} players</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: '#0e1424' }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ background: '#ef4444', width: `${(sport.players / 1250) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${sport.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sport.trend >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(sport.trend)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Recent Activity</h3>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Latest updates and changes</p>
            </div>
            <Calendar className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg transition-colors" style={{ background: '#0e1424' }}>
                <div className={`p-2 rounded-lg`} style={{ 
                  background: activity.type === 'add' ? 'rgba(16, 185, 129, 0.12)' :
                              activity.type === 'upload' ? 'rgba(239, 68, 68, 0.12)' :
                              activity.type === 'update' ? 'rgba(251, 191, 36, 0.12)' :
                              'rgba(168, 85, 247, 0.12)'
                }}>
                  {activity.type === 'add' && <Activity className="w-4 h-4 text-green-600" />}
                  {activity.type === 'upload' && <Upload className="w-4 h-4" style={{ color: '#ef4444' }} />}
                  {activity.type === 'update' && <RefreshCw className="w-4 h-4 text-yellow-600" />}
                  {activity.type === 'report' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#e5e7eb' }}>{activity.action}</p>
                  <p className="text-xs" style={{ color: '#9aa4b2' }}>{activity.sport}</p>
                </div>
                <span className="text-xs" style={{ color: '#9aa4b2' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - WORKING BUTTONS - ONLY FOR ADMIN */}
      <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Quick Actions</h3>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Common tasks and shortcuts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              onPageChange?.('sports');
              showSuccess?.('Navigating to Sports Management...');
            }}
            className="flex items-center justify-start gap-3 px-6 py-4 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
          >
            <Activity className="w-5 h-5" />
            Add New Sport
          </button>
          <button 
            onClick={() => {
              onPageChange?.('upload');
              showSuccess?.('Navigating to Data Upload...');
            }}
            className="flex items-center justify-start gap-3 px-6 py-4 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: '#0e1424', color: '#e5e7eb', cursor: 'pointer' }}
          >
            <Upload className="w-5 h-5" />
            Upload Data
          </button>
          <button 
            onClick={() => {
              showSuccess?.('Report generation started!');
              setTimeout(() => {
                showSuccess?.('Report generated successfully!');
              }, 2000);
            }}
            className="flex items-center justify-start gap-3 px-6 py-4 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: '#0e1424', color: '#e5e7eb', cursor: 'pointer' }}
          >
            <BarChart3 className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;