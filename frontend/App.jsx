// App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import DataUpload from './pages/DataUpload';
import SportsManagement from './pages/SportsManagement';
import LoadingSpinner from './components/LoadingSpinner';
import { useToast, ToastContainer } from './components/Toast';
import { getUserData, isAuthenticated, authAPI } from './service/api';

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

    try {
      const endpoint = authMode === 'login' ? authAPI.login : authAPI.register;
      const response = await endpoint(authForm);

      if (response.data.success) {
        setCurrentUser(response.data.data.user);
        setIsAuth(true);
        setShowLogin(false);
        setAuthForm({ name: '', email: '', password: '' });
        showSuccess(`${authMode === 'login' ? 'Login' : 'Registration'} successful!`);
      }
    } catch (error) {
      console.error('Auth error:', error);
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

  const renderPage = () => {
    const pageProps = {
      showToast: showInfo
    };

    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard {...pageProps} />;
      case 'sports':
        return <SportsManagement {...pageProps} />;
      case 'upload':
        return <DataUpload {...pageProps} />;
      default:
        return <AdminDashboard {...pageProps} />;
    }
  };

  // Loading screen
  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />;
  }

  // Login/Register Screen
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SM</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-600">Sports Management System</p>
          </div>

          <div className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:underline text-sm"
            >
              {authMode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">🧪 Test Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
              <p>
                <strong>User:</strong> user@example.com / user123
              </p>
            </div>
          </div>
        </div>

        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={currentUser}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        showSearch={false}
      />

      <div className="flex">
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

        <main className="flex-1 p-6">
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