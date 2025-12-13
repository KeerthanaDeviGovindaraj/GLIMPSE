import React, { useState, useEffect } from 'react';
import { Home, Users, Trophy, TrendingUp, Database, Clock, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    analysts: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add User Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    favoriteSport: ''
  });

  // API base URL
  const API_URL = 'http://localhost:4000/api';

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_URL}/admin/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      setSuccess(response.data.message);
      fetchUsers();
      fetchStats();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.favoriteSport) {
      setError('All fields are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData instead of sending JSON
      const formData = new FormData();
      formData.append('firstName', newUser.firstName);
      formData.append('lastName', newUser.lastName);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);
      formData.append('favoriteSport', newUser.favoriteSport);
      
      const response = await axios.post(
        `${API_URL}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setSuccess('User added successfully!');
      setShowAddUserModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        favoriteSport: ''
      });
      fetchUsers();
      fetchStats();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to add user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'users') {
      fetchUsers();
    }
    fetchStats();
  }, [currentPage]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const statsData = [
    { label: 'Total Sports', value: '2', change: '+0%', icon: Trophy },
    { label: 'Active Sports', value: '2', change: '+0%', icon: Trophy },
    { label: 'Total Users', value: stats.totalUsers.toString(), change: '+0%', icon: Users },
    { label: 'Active Users', value: stats.activeUsers.toString(), change: '+0%', icon: Users },
  ];

  const topSports = [
    { rank: 1, name: 'Cricket', players: 1250, change: '+12%', trend: 'up' },
    { rank: 2, name: 'Football', players: 980, change: '+8%', trend: 'up' },
  ];

  const recentActivity = [
    { type: 'add', title: 'New sport added', subtitle: 'Cricket', time: '2 hours ago', icon: Trophy },
    { type: 'user', title: 'User registered', subtitle: 'New analyst joined', time: '5 hours ago', icon: Users },
    { type: 'update', title: 'Sport updated', subtitle: 'Cricket', time: '1 day ago', icon: Trophy },
    { type: 'report', title: 'User status changed', subtitle: 'Account disabled', time: '2 days ago', icon: Users },
  ];

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Notifications */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          backgroundColor: '#E50914',
          color: 'white',
          borderRadius: '8px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <AlertCircle style={{ width: '20px', height: '20px' }} />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          backgroundColor: '#E50914',
          color: 'white',
          borderRadius: '8px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <AlertCircle style={{ width: '20px', height: '20px' }} />
          {success}
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#242424',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #2f2f2f'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8c8c8c',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  >
                    <option value="user">User</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#8c8c8c'
                  }}>
                    Favorite Sport *
                  </label>
                  <select
                    value={newUser.favoriteSport}
                    onChange={(e) => setNewUser({...newUser, favoriteSport: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  >
                    <option value="">Select a sport</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                  </select>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '8px' 
                }}>
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #2f2f2f',
                      backgroundColor: 'transparent',
                      color: '#8c8c8c',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#E50914',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ 
        width: '256px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        borderRight: '1px solid #2f2f2f'
      }}>
        <div style={{ 
          padding: '24px',
          borderBottom: '1px solid #2f2f2f'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)'
            }}>
              <Trophy style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Sports Management</h1>
              <p style={{ fontSize: '12px', color: '#8c8c8c', margin: 0 }}>Dashboard & Analytics</p>
            </div>
          </div>
        </div>

        <nav style={{ 
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#2f2f2f';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#E50914' : 'transparent',
                  color: isActive ? '#ffffff' : '#b3b3b3',
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ 
          padding: '16px',
          borderTop: '1px solid #2f2f2f'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 8px'
          }}>
            <div style={{ 
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#E50914'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>Admin</p>
              <p style={{ fontSize: '12px', color: '#8c8c8c', margin: 0 }}>Full Access</p>
            </div>
          </div>
          <div style={{ 
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            textAlign: 'center',
            fontSize: '12px'
          }}>
            <div style={{ 
              borderRadius: '4px',
              padding: '8px',
              backgroundColor: '#242424'
            }}>
              <div style={{ color: '#8c8c8c' }}>Sports</div>
              <div style={{ fontWeight: 'bold' }}>2</div>
            </div>
            <div style={{ 
              borderRadius: '4px',
              padding: '8px',
              backgroundColor: '#242424'
            }}>
              <div style={{ color: '#8c8c8c' }}>Users</div>
              <div style={{ fontWeight: 'bold' }}>{stats.totalUsers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#0f0f0f'
      }}>
        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div style={{ padding: '32px' }}>
            {/* Welcome Banner */}
            <div style={{
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)'
            }}>
              <h2 style={{ 
                fontSize: '30px',
                fontWeight: 'bold',
                marginBottom: '8px',
                margin: 0
              }}>
                Welcome back, Admin User! 👋
              </h2>
              <p style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffd5d5',
                margin: '8px 0 0 0'
              }}>
                <span style={{ color: '#ffffff' }}>✓</span>
                Full administrative access to sports management system
              </p>
            </div>

            {/* Refresh Bar */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <button 
                onClick={() => {
                  fetchStats();
                  setSuccess('Dashboard refreshed!');
                  setTimeout(() => setSuccess(''), 2000);
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8c8c8c'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#8c8c8c',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                <Trophy style={{ width: '16px', height: '16px' }} />
                Refresh
              </button>
              <span style={{ fontSize: '14px', color: '#666666' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E50914'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2f2f2f'}
                    style={{ 
                      borderRadius: '12px',
                      padding: '24px',
                      backgroundColor: '#242424',
                      border: '1px solid #2f2f2f',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{ 
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E50914'
                      }}>
                        <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
                      </div>
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#d4d4d4'
                      }}>
                        <TrendingUp style={{ width: '16px', height: '16px' }} />
                        {stat.change}
                      </span>
                    </div>
                    <h3 style={{ 
                      fontSize: '14px',
                      marginBottom: '4px',
                      color: '#8c8c8c',
                      margin: '0 0 4px 0'
                    }}>
                      {stat.label}
                    </h3>
                    <p style={{ 
                      fontSize: '30px',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                    <p style={{ 
                      fontSize: '12px',
                      marginTop: '8px',
                      color: '#666666',
                      margin: '8px 0 0 0'
                    }}>
                      from last month
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Two Column Section */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px'
            }}>
              {/* Top Sports */}
              <div style={{ 
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: '#242424',
                border: '1px solid #2f2f2f'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      Top Sports by Popularity
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#8c8c8c',
                      margin: '4px 0 0 0'
                    }}>
                      Most active sports this month
                    </p>
                  </div>
                  <Trophy style={{ width: '24px', height: '24px', color: '#E50914' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {topSports.map((sport) => (
                    <div 
                      key={sport.rank}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div style={{ 
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        backgroundColor: '#E50914'
                      }}>
                        {sport.rank}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontWeight: '500' }}>{sport.name}</span>
                          <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                            {sport.players} players
                          </span>
                        </div>
                        <div style={{ 
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#1a1a1a'
                        }}>
                          <div style={{ 
                            height: '100%',
                            borderRadius: '4px',
                            background: 'linear-gradient(90deg, #E50914 0%, #FF0A16 100%)',
                            width: `${(sport.players / 1250) * 100}%` 
                          }} />
                        </div>
                      </div>
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#d4d4d4'
                      }}>
                        {sport.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ 
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: '#242424',
                border: '1px solid #2f2f2f'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      Recent Activity
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#8c8c8c',
                      margin: '4px 0 0 0'
                    }}>
                      Latest updates and changes
                    </p>
                  </div>
                  <Clock style={{ width: '24px', height: '24px', color: '#E50914' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div 
                        key={index}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2f2f2f'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                        style={{ 
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: '#1a1a1a',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: '#2f2f2f'
                        }}>
                          <Icon style={{ width: '20px', height: '20px', color: '#E50914' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            fontWeight: '500',
                            fontSize: '14px',
                            margin: 0
                          }}>
                            {activity.title}
                          </p>
                          <p style={{ 
                            fontSize: '12px',
                            color: '#8c8c8c',
                            margin: '2px 0 0 0'
                          }}>
                            {activity.subtitle}
                          </p>
                        </div>
                        <span style={{ 
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          color: '#666666'
                        }}>
                          {activity.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Page */}
        {currentPage === 'users' && (
          <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '30px',
                fontWeight: 'bold',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                User Management
              </h2>
              <p style={{ color: '#8c8c8c', margin: 0 }}>
                Manage user accounts and permissions
              </p>
            </div>

            {/* User Stats - ALL RED/GREY THEME */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)'
              }}>
                <Users style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
                <h3 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {stats.totalUsers}
                </h3>
                <p style={{ color: '#ffd5d5', margin: '4px 0 0 0' }}>Total Users</p>
              </div>
              <div style={{
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                background: 'linear-gradient(135deg, #FF0A16 0%, #E50914 100%)'
              }}>
                <Trophy style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
                <h3 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {stats.activeUsers}
                </h3>
                <p style={{ color: '#ffd5d5', margin: '4px 0 0 0' }}>Active Users</p>
              </div>
              <div style={{
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                background: 'linear-gradient(135deg, #B20710 0%, #8c0509 100%)'
              }}>
                <Trophy style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
                <h3 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {stats.admins}
                </h3>
                <p style={{ color: '#ffd5d5', margin: '4px 0 0 0' }}>Admins</p>
              </div>
              <div style={{
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                background: 'linear-gradient(135deg, #2f2f2f 0%, #1a1a1a 100%)'
              }}>
                <Database style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
                <h3 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {stats.analysts}
                </h3>
                <p style={{ color: '#d4d4d4', margin: '4px 0 0 0' }}>Analysts</p>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#242424',
              border: '1px solid #2f2f2f'
            }}>
              <div style={{ 
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #2f2f2f'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    User Accounts
                  </h3>
                  <p style={{ 
                    fontSize: '14px',
                    marginTop: '4px',
                    color: '#8c8c8c',
                    margin: '4px 0 0 0'
                  }}>
                    Enable or disable user access
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF0A16'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E50914'}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: '#E50914',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Add New User
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ 
                    padding: '40px',
                    textAlign: 'center',
                    color: '#8c8c8c'
                  }}>
                    Loading users...
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'rgba(47,47,47,0.5)' }}>
                      <tr>
                        <th style={{ 
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          color: '#8c8c8c'
                        }}>
                          Email
                        </th>
                        <th style={{ 
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          color: '#8c8c8c'
                        }}>
                          Role
                        </th>
                        <th style={{ 
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          color: '#8c8c8c'
                        }}>
                          Status
                        </th>
                        <th style={{ 
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          color: '#8c8c8c'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td 
                            colSpan="4"
                            style={{ 
                              padding: '32px 24px',
                              textAlign: 'center',
                              color: '#666666'
                            }}
                          >
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr 
                            key={user._id}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(47,47,47,0.5)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            style={{ 
                              borderTop: '1px solid #2f2f2f',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{ 
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)'
                                }}>
                                  <span style={{ 
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                  }}>
                                    {user.email[0].toUpperCase()}
                                  </span>
                                </div>
                                <span style={{ 
                                  fontSize: '14px',
                                  fontWeight: '500'
                                }}>
                                  {user.email}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{ 
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.role === 'admin' ? 'rgba(229,9,20,0.2)' :
                                               user.role === 'analyst' ? 'rgba(255,10,22,0.2)' :
                                               'rgba(212,212,212,0.2)',
                                color: user.role === 'admin' ? '#FF0A16' :
                                       user.role === 'analyst' ? '#ff6b6b' :
                                       '#d4d4d4'
                              }}>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{ 
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.status === 'active' ? 'rgba(212,212,212,0.2)' : 'rgba(140,140,140,0.2)',
                                color: user.status === 'active' ? '#d4d4d4' : '#8c8c8c'
                              }}>
                                {user.status}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <button
                                onClick={() => toggleUserStatus(user._id)}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                  if (!loading) {
                                    e.currentTarget.style.backgroundColor = user.status === 'active' ? 'rgba(229,9,20,0.3)' : 'rgba(212,212,212,0.3)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = user.status === 'active' ? 'rgba(229,9,20,0.2)' : 'rgba(212,212,212,0.2)';
                                }}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  transition: 'background-color 0.2s',
                                  opacity: loading ? 0.6 : 1,
                                  backgroundColor: user.status === 'active' ? 'rgba(229,9,20,0.2)' : 'rgba(212,212,212,0.2)',
                                  color: user.status === 'active' ? '#ff6b6b' : '#d4d4d4'
                                }}
                              >
                                {user.status === 'active' ? 'Disable' : 'Enable'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div style={{
              marginTop: '24px',
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: 'rgba(229,9,20,0.1)',
              border: '1px solid rgba(229,9,20,0.3)'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: 'rgba(229,9,20,0.2)'
                }}>
                  <Users style={{ width: '24px', height: '24px', color: '#ff6b6b' }} />
                </div>
                <div>
                  <h4 style={{ 
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: '#ff6b6b',
                    margin: '0 0 4px 0'
                  }}>
                    Admin Access Control
                  </h4>
                  <p style={{ 
                    fontSize: '14px',
                    color: '#8c8c8c',
                    margin: 0
                  }}>
                    As an admin, you can enable or disable user accounts. Disabled users cannot log in to the system.
                    Use this feature to manage access control and ensure system security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;