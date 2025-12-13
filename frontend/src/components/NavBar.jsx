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
  Home,
  AdminPanelSettings,
  Assessment,
  SportsScore 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import logo from '../assets/logo.png';

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
      { label: 'Commentary', path: '/commentary', icon: <SportsScore /> },
      { label: 'Home', path: '/home', icon: <Home /> }
    ];

    const roleSpecificItems = {
      admin: [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminPanelSettings /> },
      ],
      analyst: [
        { label: 'Analyst Dashboard', path: '/analyst/dashboard', icon: <Assessment /> },
      ],
      user: []
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
    <AppBar 
      position="sticky"
      sx={{
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
        top: 0,
        zIndex: 100
      }}
    >
      <Toolbar>
        {/* Logo/Brand - CHANGED FROM "Info Portal" TO "Live Commentary" */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: 'scale(1.05)'
            }
          }} 
          onClick={() => navigate('/commentary')}
        >
          <Box component="img" src={logo} alt="Glimpse Logo" sx={{ mr: 1, height: '36px', width: 'auto' }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ fontWeight: 500, letterSpacing: '2px', fontFamily: '"Cormorant Garamond", serif', textTransform: 'uppercase' }}
          >
            Glimpse
          </Typography>
        </Box>

        {/* Role Badge */}
        {['admin', 'analyst'].includes(user?.role) && (
          <Chip
            label={getRoleDisplayName(user?.role)}
            color={getRoleColor(user?.role)}
            size="small"
            sx={{ 
              ml: 2, 
              color: 'white',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        )}

        {/* Navigation Links - Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          {navigationItems.slice(0, 4).map((item) => ( // Show first 4 items
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{ 
                ml: 1,
                color: '#E5E5E5',
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' }, textTransform: 'capitalize' }}>
            {user?.firstName || user?.email?.split('@')[0] || 'User'}
          </Typography>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }} 
              src={user?.photoUrl} 
              alt={user?.email}
            >
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
              sx: { 
                mt: 1.5, 
                minWidth: 240,
                backgroundColor: 'rgba(31, 31, 31, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                '& .MuiMenuItem-root': {
                  padding: '12px 24px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                },
                '& .MuiDivider-root': {
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  my: 1
                },
                '& .MuiListItemIcon-root': {
                  color: '#B3B3B3',
                  minWidth: '40px'
                }
              }
            }}
          >
            {/* User Info */}
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B3B3B3' }}>
                  {getRoleDisplayName(user?.role)}
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider />

            {/* Mobile Navigation Items */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {navigationItems.map((item) => (
                <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </MenuItem>
              ))}
              <Divider />
            </Box>

            {/* Profile */}
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
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
