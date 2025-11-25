// src/components/NavBar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Dashboard,
  People,
  Analytics,
  Settings,
  Home,
  Info,
  ContactMail,
  AdminPanelSettings,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'About', path: '/about', icon: <Info /> },
      { label: 'Contact', path: '/contact', icon: <ContactMail /> }
    ];

    const roleSpecificItems = {
      admin: [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminPanelSettings /> },
        { label: 'User Management', path: '/admin/users', icon: <People /> },
        { label: 'System Analytics', path: '/admin/analytics', icon: <Analytics /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings /> }
      ],
      analyst: [
        { label: 'Analyst Dashboard', path: '/analyst/dashboard', icon: <Assessment /> },
        { label: 'Data Analytics', path: '/analyst/analytics', icon: <Analytics /> },
        { label: 'Reports', path: '/analyst/reports', icon: <Dashboard /> }
      ],
      user: [
        { label: 'My Dashboard', path: '/user/dashboard', icon: <Dashboard /> },
        { label: 'Profile', path: '/user/profile', icon: <AccountCircle /> }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user?.role] || roleSpecificItems.user)];
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'analyst': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'analyst': return 'Analyst';
      case 'user': return 'User';
      default: return 'User';
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Info Portal
        </Typography>

        {/* Role Badge */}
        <Chip
          label={getRoleDisplayName(user?.role)}
          color={getRoleColor(user?.role)}
          size="small"
          sx={{ ml: 2, color: 'white' }}
        />

        {/* Navigation Links - Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          {navigationItems.slice(0, 4).map((item) => ( // Show first 4 items
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{ ml: 1 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
            {user?.email?.split('@')[0] || 'User'}
          </Typography>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: { mt: 1, minWidth: 200 }
            }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {getRoleDisplayName(user?.role)}
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider />

            {/* Dashboard Quick Access */}
            <MenuItem onClick={() => handleNavigation('/dashboard')}>
              <ListItemIcon>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Dashboard</ListItemText>
            </MenuItem>

            {/* Mobile Navigation Items */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Divider />
              {navigationItems.map((item) => (
                <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </MenuItem>
              ))}
            </Box>

            <Divider />

            {/* Profile & Settings */}
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleNavigation('/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>
                <Typography color="error">Logout</Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;