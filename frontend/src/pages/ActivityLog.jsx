// pages/ActivityLog.jsx
import React from 'react';
import { Activity, Upload, Edit, Trash2, Plus, User, Settings } from 'lucide-react';

function ActivityLog() {
  const activities = [
    { id: 1, user: 'Admin User', action: 'Added new sport', detail: 'Volleyball', time: '2 minutes ago', type: 'add' },
    { id: 2, user: 'John Doe', action: 'Uploaded data', detail: 'player_stats.csv', time: '15 minutes ago', type: 'upload' },
    { id: 3, user: 'Admin User', action: 'Updated sport', detail: 'Football', time: '1 hour ago', type: 'edit' },
    { id: 4, user: 'Jane Smith', action: 'Deleted entry', detail: 'Old record #234', time: '2 hours ago', type: 'delete' },
    { id: 5, user: 'Admin User', action: 'Created user', detail: 'mike@example.com', time: '3 hours ago', type: 'user' },
    { id: 6, user: 'Admin User', action: 'Changed settings', detail: 'Email notifications enabled', time: '5 hours ago', type: 'settings' },
    { id: 7, user: 'Tom Brown', action: 'Uploaded data', detail: 'match_results.xlsx', time: '1 day ago', type: 'upload' },
    { id: 8, user: 'Admin User', action: 'Added new sport', detail: 'Swimming', time: '1 day ago', type: 'add' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'add': return <Plus size={16} style={{ color: '#10b981' }} />;
      case 'upload': return <Upload size={16} style={{ color: '#3b82f6' }} />;
      case 'edit': return <Edit size={16} style={{ color: '#f59e0b' }} />;
      case 'delete': return <Trash2 size={16} style={{ color: '#ef4444' }} />;
      case 'user': return <User size={16} style={{ color: '#8b5cf6' }} />;
      case 'settings': return <Settings size={16} style={{ color: '#6b7280' }} />;
      default: return <Activity size={16} style={{ color: '#9aa4b2' }} />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'add': return 'rgba(16, 185, 129, 0.12)';
      case 'upload': return 'rgba(59, 130, 246, 0.12)';
      case 'edit': return 'rgba(245, 158, 11, 0.12)';
      case 'delete': return 'rgba(239, 68, 68, 0.12)';
      case 'user': return 'rgba(139, 92, 246, 0.12)';
      case 'settings': return 'rgba(107, 114, 128, 0.12)';
      default: return 'rgba(156, 163, 175, 0.12)';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Activity Log</h2>
        <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Track all system activities and changes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>847</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Total Activities</p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>124</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Today</p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>8</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Active Users</p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>3</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Online Now</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="p-6 border-b" style={{ borderColor: '#1f2937' }}>
          <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="p-2 rounded-lg mt-1" style={{ background: getActivityBg(activity.type) }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#e5e7eb' }}>
                        <span style={{ color: '#ef4444' }}>{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm" style={{ color: '#9aa4b2' }}>{activity.detail}</p>
                    </div>
                    <span className="text-xs" style={{ color: '#9aa4b2' }}>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;