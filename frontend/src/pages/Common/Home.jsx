// src/pages/Common/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Dashboard,
  AdminPanelSettings,
  Assessment,
  Person
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Administrator',
          description: 'Manage users, view system analytics, and configure platform settings.',
          icon: <AdminPanelSettings sx={{ fontSize: 48, color: 'error.main' }} />,
          color: 'error.main'
        };
      case 'analyst':
        return {
          title: 'Data Analyst',
          description: 'Access advanced analytics, generate reports, and analyze data trends.',
          icon: <Assessment sx={{ fontSize: 48, color: 'warning.main' }} />,
          color: 'warning.main'
        };
      case 'user':
        return {
          title: 'User',
          description: 'Access your personal dashboard and manage your account settings.',
          icon: <Person sx={{ fontSize: 48, color: 'primary.main' }} />,
          color: 'primary.main'
        };
      default:
        return {
          title: 'User',
          description: 'Welcome to the platform!',
          icon: <Person sx={{ fontSize: 48, color: 'primary.main' }} />,
          color: 'primary.main'
        };
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  const roleInfo = getRoleInfo(user.role);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Info Portal
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Hello, {user.email?.split('@')[0] || 'User'}! You're logged in as a {roleInfo.title}.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Role Information Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                {roleInfo.icon}
              </Box>
              <Typography variant="h4" gutterBottom sx={{ color: roleInfo.color }}>
                {roleInfo.title} Dashboard
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {roleInfo.description}
              </Typography>
              
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Dashboard />}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats/Info Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Secure Access
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Your account is protected with JWT authentication and role-based access control.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Modern Interface
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Built with React and Material-UI for a responsive and intuitive experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Role-Based Features
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Different features and capabilities based on your assigned role.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;