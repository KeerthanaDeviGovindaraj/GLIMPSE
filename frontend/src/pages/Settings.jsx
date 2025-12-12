// pages/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, Mail, Globe, Save } from 'lucide-react';

function Settings({ showSuccess }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoBackup: true,
    twoFactor: false,
    darkMode: true,
    language: 'en'
  });

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    timezone: 'UTC-5'
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    showSuccess?.(`${key} ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSave = () => {
    showSuccess?.('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>Settings</h2>
        <p className="text-sm mt-1" style={{ color: '#9aa4b2' }}>Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <User size={24} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Profile Information</h3>
            <p className="text-sm" style={{ color: '#9aa4b2' }}>Update your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{ background: '#0e1424', border: '1px solid #1f2937', color: '#e5e7eb', cursor: 'pointer' }}
            >
              <option value="UTC-5">EST (UTC-5)</option>
              <option value="UTC-6">CST (UTC-6)</option>
              <option value="UTC-7">MST (UTC-7)</option>
              <option value="UTC-8">PST (UTC-8)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <Bell size={24} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Notifications</h3>
            <p className="text-sm" style={{ color: '#9aa4b2' }}>Manage notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: '#e5e7eb' }}>Email Notifications</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Receive updates via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors"
              style={{ 
                background: settings.emailNotifications ? '#10b981' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ 
                  transform: settings.emailNotifications ? 'translateX(24px)' : 'translateX(4px)'
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: '#e5e7eb' }}>Push Notifications</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Receive push notifications</p>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors"
              style={{ 
                background: settings.pushNotifications ? '#10b981' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ 
                  transform: settings.pushNotifications ? 'translateX(24px)' : 'translateX(4px)'
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-6 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <Lock size={24} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>Security</h3>
            <p className="text-sm" style={{ color: '#9aa4b2' }}>Manage security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: '#e5e7eb' }}>Two-Factor Authentication</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Add extra layer of security</p>
            </div>
            <button
              onClick={() => handleToggle('twoFactor')}
              className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors"
              style={{ 
                background: settings.twoFactor ? '#10b981' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ 
                  transform: settings.twoFactor ? 'translateX(24px)' : 'translateX(4px)'
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: '#e5e7eb' }}>Auto Backup</p>
              <p className="text-sm" style={{ color: '#9aa4b2' }}>Automatic daily data backup</p>
            </div>
            <button
              onClick={() => handleToggle('autoBackup')}
              className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors"
              style={{ 
                background: settings.autoBackup ? '#10b981' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ 
                  transform: settings.autoBackup ? 'translateX(24px)' : 'translateX(4px)'
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
        style={{ background: '#ef4444', color: '#fff', cursor: 'pointer' }}
      >
        <Save size={20} />
        Save Changes
      </button>
    </div>
  );
}

export default Settings;