// pages/UserManagement.jsx
import React, { useState } from 'react';
import { Users, Search, Plus, Edit, Trash2, Check, X, Shield, User as UserIcon } from 'lucide-react';

function UserManagement({ showSuccess, showError }) {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'enabled', lastLogin: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'enabled', lastLogin: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'disabled', lastLogin: '2 days ago' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'admin', status: 'enabled', lastLogin: '1 hour ago' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'user', status: 'enabled', lastLogin: '3 days ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'enabled' ? 'disabled' : 'enabled';
        showSuccess?.(
          newStatus === 'enabled' 
            ? `✅ ${user.name} has been enabled` 
            : `🔒 ${user.name} has been disabled`
        );
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      showSuccess?.(`${user.name} deleted successfully!`);
    }
  };

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      showError?.('Please fill in all fields');
      return;
    }

    const user = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'enabled',
      lastLogin: 'Never'
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user' });
    setShowAddModal(false);
    showSuccess?.(`${user.name} added successfully!`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledCount = users.filter(u => u.status === 'enabled').length;
  const disabledCount = users.filter(u => u.status === 'disabled').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>User Management</h2>
          <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Manage users and their access permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Users size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>{users.length}</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Total Users</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
              <Check size={24} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>{enabledCount}</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Enabled</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <X size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>{disabledCount}</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Disabled</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Shield size={24} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>{adminCount}</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9aa4b2' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
          style={{ 
            background: '#0c1220',
            border: '1px solid #1f2937',
            color: '#e5e7eb'
          }}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-lg overflow-hidden" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0e1424', borderBottom: '1px solid #1f2937' }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Users size={48} style={{ color: '#9aa4b2', margin: '0 auto 16px' }} />
                    <p className="text-lg font-medium" style={{ color: '#e5e7eb' }}>No users found</p>
                    <p className="text-sm" style={{ color: '#9aa4b2' }}>Try adjusting your search</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #1f2937' }} className="hover:bg-opacity-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: user.role === 'admin' ? '#ef4444' : '#1f2937', color: '#fff' }}>
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium" style={{ color: '#e5e7eb' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#9aa4b2' }}>{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit" style={{ 
                        background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(156, 163, 175, 0.12)',
                        color: user.role === 'admin' ? '#ef4444' : '#9aa4b2'
                      }}>
                        {user.role === 'admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors"
                        style={{ 
                          background: user.status === 'enabled' ? '#10b981' : '#1f2937',
                          cursor: 'pointer'
                        }}
                      >
                        <span
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          style={{ 
                            transform: user.status === 'enabled' ? 'translateX(24px)' : 'translateX(4px)'
                          }}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#9aa4b2' }}>{user.lastLogin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showSuccess?.(`Editing ${user.name}...`)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ background: '#0e1424', color: '#e5e7eb', cursor: 'pointer' }}
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', cursor: 'pointer' }}
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#e5e7eb' }}>Add New User</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: '#0e1424', color: '#9aa4b2', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
                  placeholder="John Doe"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb', cursor: 'pointer' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddUser}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
                >
                  <Check size={20} />
                  Add User
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#0e1424', color: '#9aa4b2', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;