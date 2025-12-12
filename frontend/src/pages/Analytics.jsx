
import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Analytics</h2>
        <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>View detailed analytics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="p-3 rounded-lg mb-4 w-fit" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <BarChart3 size={24} style={{ color: '#ef4444' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>2,847</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Total Views</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="p-3 rounded-lg mb-4 w-fit" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
            <TrendingUp size={24} style={{ color: '#10b981' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>+24%</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Growth Rate</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="p-3 rounded-lg mb-4 w-fit" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
            <Activity size={24} style={{ color: '#3b82f6' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>1,432</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Active Users</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="p-3 rounded-lg mb-4 w-fit" style={{ background: 'rgba(168, 85, 247, 0.12)' }}>
            <PieChart size={24} style={{ color: '#a855f7' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>87%</p>
          <p className="text-sm" style={{ color: '#9aa4b2' }}>Engagement Rate</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-12 rounded-lg text-center" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <BarChart3 size={64} style={{ color: '#9aa4b2', margin: '0 auto 24px' }} />
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#e5e7eb' }}>Analytics Dashboard</h3>
        <p className="text-lg" style={{ color: '#9aa4b2' }}>Detailed charts and graphs will be displayed here</p>
      </div>
    </div>
  );
}

export default Analytics;