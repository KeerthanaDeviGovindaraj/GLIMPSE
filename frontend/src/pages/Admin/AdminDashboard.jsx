import React, { useState, useEffect } from 'react';
import {
  People,
  Person,
  AdminPanelSettings,
  Analytics,
  ErrorOutline as AlertCircle,
  Close as X,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import '../../components/styles/AdminDashboard.css';
import '../../components/styles/CommonStyles.css';
import api from '../../services/api';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    analysts: 0
  });
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add User Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    favoriteSport: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
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
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchSports = async () => {
    try {
      const { data } = await api.get('/sports');
      setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Failed to fetch sports', error);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      setLoading(true);
      const response = await api.patch(
        `/admin/users/${userId}/toggle-status`,
        {}
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Real-time validation
    let tempErrors = { ...errors };

    switch (name) {
      case 'firstName':
        tempErrors.firstName = value.trim() ? "" : "First name is required";
        break;
      case 'lastName':
        tempErrors.lastName = value.trim() ? "" : "Last name is required";
        break;
      case 'email':
        if (!value.trim()) {
          tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          tempErrors.email = "Email is invalid";
        } else {
          tempErrors.email = "";
        }
        break;
      case 'password':
        if (!value) {
          tempErrors.password = "Password is required";
        } else if (value.length < 6) {
          tempErrors.password = "Password must be at least 6 characters";
        } else {
          tempErrors.password = "";
        }
        if (newUser.confirmPassword) {
          tempErrors.confirmPassword = value === newUser.confirmPassword ? "" : "Passwords do not match";
        }
        break;
      case 'confirmPassword':
        tempErrors.confirmPassword = value === newUser.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = {};
    if (!newUser.firstName.trim()) tempErrors.firstName = "First name is required";
    if (!newUser.lastName.trim()) tempErrors.lastName = "Last name is required";
    if (!newUser.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!newUser.password) {
      tempErrors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (newUser.password !== newUser.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (!newUser.favoriteSport) {
      tempErrors.favoriteSport = "Favorite sport is required";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      
      // Create FormData instead of sending JSON
      const formData = new FormData();
      formData.append('firstName', newUser.firstName);
      formData.append('lastName', newUser.lastName);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', newUser.role || 'user');
      formData.append('favoriteSport', newUser.favoriteSport);
      
      const response = await api.post(
        '/auth/register',
        formData
      );
      
      setSuccess('User added successfully!');
      setShowAddUserModal(false);
      setErrors({});
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        favoriteSport: ''
      });
      fetchUsers();
      fetchStats();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           'Failed to add user';
      setError(errorMessage);
      setErrors(prev => ({ ...prev, api: errorMessage }));
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'users') {
      fetchUsers();
    }
    fetchStats();
    fetchSports();
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

            {errors.api && (
              <div style={{
                backgroundColor: 'rgba(229, 9, 20, 0.1)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                color: '#ff6b6b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                ⚠️ {errors.api}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div className="modal-form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter first name"
                />
                {errors.firstName && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter last name"
                />
                {errors.lastName && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter email address"
                />
                {errors.email && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="user">User</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
                {errors.password && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Favorite Sport *</label>
                <select
                  name="favoriteSport"
                  value={newUser.favoriteSport}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select a sport</option>
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>{sport.name}</option>
                  ))}
                </select>
                {errors.favoriteSport && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.favoriteSport}</span>}
              </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="auth-btn"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--text-secondary)',
                    marginTop: 0
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn"
                  style={{ marginTop: 0 }}
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
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