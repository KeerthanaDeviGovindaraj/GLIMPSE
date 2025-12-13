import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirector from './components/AuthRedirector';

// Pages
import Login from './pages/Common/Login';
import Home from './pages/Common/Home';
import Register from './pages/Common/Register';
import About from './pages/Common/About';
import Contact from './pages/Common/Contact';
import ForgotPassword from './pages/Common/ForgotPassword';
import ResetPassword from './pages/Common/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AnalystDashboard from './pages/Analyst/AnalystDashboard';
import UserDashboard from './pages/User/UserDashboard';
import Profile from './pages/User/Profile';
import Commentary from './pages/User/Commentary';

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#E50914' }, // Netflix Red
    secondary: { main: '#dc004e' },
  },
});

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {isAuthenticated && <NavBar />}

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}

              {/* Home - ALWAYS accessible, shows landing page */}
              <Route path="/" element={<Home />} />

              {/* Login */}
              <Route
                path="/login"
                element={
                  <AuthRedirector>
                    <Login />
                  </AuthRedirector>
                }
              />

              {/* Register */}
              <Route
                path="/register"
                element={
                  <AuthRedirector>
                    <Register />
                  </AuthRedirector>
                }
              />

              {/* Password Management */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Info Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* ===== PROTECTED ROUTES ===== */}

              {/* Commentary - Main app */}
              <Route
                path="/commentary"
                element={
                  <ProtectedRoute>
                    <Commentary />
                  </ProtectedRoute>
                }
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Analyst Dashboard */}
              <Route
                path="/analyst/dashboard"
                element={
                  <ProtectedRoute>
                    <AnalystDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          {!isAuthenticated && <Footer />}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
