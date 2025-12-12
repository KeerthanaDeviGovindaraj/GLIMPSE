// App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import DataUpload from './pages/DataUpload';
import SportsManagement from './pages/SportsManagement';
import UserManagement from './pages/UserManagement';
import LoadingSpinner from './components/LoadingSpinner';
import { useToast, ToastContainer } from './components/Toast';
import { getUserData, isAuthenticated, authAPI } from './service/api';
import { Activity } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);

  const { toasts, removeToast, showSuccess, showError, showInfo, showWarning } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = getUserData();
    const authenticated = isAuthenticated();

    if (user && authenticated) {
      setCurrentUser(user);
      setIsAuth(true);
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
    setLoading(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔍 Auth Mode:', authMode);
    console.log('🔍 Form Data:', authForm);

    try {
      const endpoint = authMode === 'login' ? authAPI.login : authAPI.register;
      const response = await endpoint(authForm);

      console.log('✅ Auth Response:', response.data);

      if (response.data.success) {
        setCurrentUser(response.data.data.user);
        setIsAuth(true);
        setShowLogin(false);
        setAuthForm({ name: '', email: '', password: '' });
        showSuccess(`${authMode === 'login' ? 'Login' : 'Registration'} successful!`);
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      console.error('❌ Error response:', error.response?.data);
      showError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setIsAuth(false);
    setShowLogin(true);
    setActivePage('dashboard');
    showInfo('Logged out successfully');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAuth(e);
    }
  };

  const renderPage = () => {
    const pageProps = {
      showToast: showInfo,
      showSuccess,
      showError,
      showWarning,
      currentUser
    };

    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard {...pageProps} onPageChange={setActivePage} />;
      case 'sports':
        return <SportsManagement {...pageProps} />;
      case 'upload':
        return <DataUpload {...pageProps} />;
      case 'users':
        return <UserManagement {...pageProps} />;
      default:
        return <AdminDashboard {...pageProps} onPageChange={setActivePage} />;
    }
  };

  // Loading screen
  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />;
  }

  // Login/Register Screen - RED/BLACK THEME
  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0b0f1c 0%, #1a1f2e 100%)' }}>
        <div className="w-full max-w-md p-8 rounded-lg" style={{ background: '#0c1220', border: '1px solid #1f2937' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
              <Activity size={32} style={{ color: '#ef4444' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#e5e7eb' }}>
              {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p style={{ color: '#9aa4b2' }}>Sports Management System</p>
          </div>

          <div className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                  style={{ 
                    background: '#0e1424', 
                    border: '1px solid #1f2937',
                    color: '#e5e7eb'
                  }}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                Email Address
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{ 
                  background: '#0e1424', 
                  border: '1px solid #1f2937',
                  color: '#e5e7eb'
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e5e7eb' }}>
                Password
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                style={{ 
                  background: '#0e1424', 
                  border: '1px solid #1f2937',
                  color: '#e5e7eb'
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{ 
                background: '#ef4444',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-sm transition-all hover:opacity-80"
              style={{ color: '#ef4444', cursor: 'pointer' }}
            >
              {authMode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: '#0e1424', border: '1px solid #1f2937' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#ef4444' }}>🔑 Test Accounts:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded" style={{ background: '#0c1220' }}>
                <span className="text-xs font-medium" style={{ color: '#9aa4b2' }}>Admin:</span>
                <span className="text-sm" style={{ color: '#e5e7eb' }}>admin@example.com / admin123</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" style={{ background: '#0c1220' }}>
                <span className="text-xs font-medium" style={{ color: '#9aa4b2' }}>User:</span>
                <span className="text-sm" style={{ color: '#e5e7eb' }}>user@example.com / user123</span>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    );
  }

  // Main Application - WITH NAVBAR AND SIDEBAR (RED/BLACK THEME)
  return (
    <div className="min-h-screen" style={{ background: '#0b0f1c' }}>
      <Navbar
        user={currentUser}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        showSearch={false}
      />

      <div className="flex" style={{ gap: 0 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          user={currentUser}
        />

        <main className="flex-1 p-6" style={{ background: '#0b0f1c' }}>
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default App;