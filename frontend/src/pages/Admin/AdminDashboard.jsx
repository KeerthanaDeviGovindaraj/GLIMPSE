import React, { useState, useEffect } from 'react';
import {
  People,
  Person,
  AdminPanelSettings,
  Analytics,
  ErrorOutline as AlertCircle,
  Close as X
} from '@mui/icons-material';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('users');
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

  return (
    <div className="dashboard-container">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New User</h2>
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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

      {/* User Management Page */}
      {currentPage === 'users' && (
        <>
          <div className="dashboard-header">
            <h1>User Management</h1>
            <p>Manage user accounts and permissions</p>
          </div>

            {/* User Stats */}
            <div className="dashboard-grid">
              <div className="dashboard-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="dashboard-card-content">
                  <div className="dashboard-card-title">Total Users</div>
                  <div className="dashboard-card-value">{stats.totalUsers}</div>
                </div>
                <div className="dashboard-icon-wrapper">
                  <People style={{ fontSize: '2.5rem' }} />
                </div>
              </div>

              <div className="dashboard-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="dashboard-card-content">
                  <div className="dashboard-card-title">Active Users</div>
                  <div className="dashboard-card-value">{stats.activeUsers}</div>
                </div>
                <div className="dashboard-icon-wrapper">
                  <Person style={{ fontSize: '2.5rem' }} />
                </div>
              </div>

              <div className="dashboard-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="dashboard-card-content">
                  <div className="dashboard-card-title">Admins</div>
                  <div className="dashboard-card-value">{stats.admins}</div>
                </div>
                <div className="dashboard-icon-wrapper">
                  <AdminPanelSettings style={{ fontSize: '2.5rem' }} />
                </div>
              </div>

              <div className="dashboard-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="dashboard-card-content">
                  <div className="dashboard-card-title">Analysts</div>
                  <div className="dashboard-card-value">{stats.analysts}</div>
                </div>
                <div className="dashboard-icon-wrapper">
                  <Analytics style={{ fontSize: '2.5rem' }} />
                </div>
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;