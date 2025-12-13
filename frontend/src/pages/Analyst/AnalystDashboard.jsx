import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import {
  People,
  SportsSoccer,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './AnalystDashboard.css';

const AnalystDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await api.get('/users/analyst-data');
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">⚠️ {error}</div>
      </div>
    );
  }

  // Prepare data for charts
  const roleData = data?.usersByRole?.map(item => ({ name: item._id, value: item.count })) || [];
  const sportData = data?.usersBySport?.map(item => ({ name: item._id, count: item.count })) || [];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const MetricCard = ({ title, value, icon }) => (
    <div className="analyst-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="analyst-card-content">
        <div className="analyst-card-title">{title}</div>
        <div className="analyst-card-value">{value}</div>
      </div>
      <div className="analyst-icon-wrapper">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Analyst Dashboard</h1>
        <p>System Overview & Data Visualization</p>
      </div>

      {/* Analytics Metrics */}
      <div className="dashboard-grid">
        <MetricCard
          title="Total Users"
          value={data?.totalUsers}
          icon={<People style={{ fontSize: '2.5rem' }} />}
        />
        <MetricCard
          title="Total Sports"
          value={data?.totalSports}
          icon={<SportsSoccer style={{ fontSize: '2.5rem' }} />}
        />
      </div>

      <div className="chart-grid">
        <div className="analyst-card" style={{ height: '450px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div className="analyst-icon-wrapper" style={{ marginRight: '12px' }}>
              <BarChartIcon style={{ fontSize: '2rem' }} />
            </div>
            <h3 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Popular Sports</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sportData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="var(--text-tertiary)" />
              <YAxis dataKey="name" type="category" width={100} stroke="var(--text-tertiary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
              <Bar dataKey="count" fill='var(--netflix-dark-red)' name="Users" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analyst-card" style={{ height: '450px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div className="analyst-icon-wrapper" style={{ marginRight: '12px' }}>
              <PieChartIcon style={{ fontSize: '2rem' }} />
            </div>
            <h3 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: 'var(--text-primary)' }}>User Roles</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill='var(--netflix-dark-red)'
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="analyst-card">
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>
          Recent Registrations
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentUsers?.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-chip ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
