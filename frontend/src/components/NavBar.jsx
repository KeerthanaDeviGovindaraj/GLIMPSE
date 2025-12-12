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
  Home,
  AdminPanelSettings,
  Assessment,
  SportsScore
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
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'Commentary', path: '/commentary', icon: <SportsScore /> }
    ];

    const roleSpecificItems = {
      admin: [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminPanelSettings /> }
      ],
      analyst: [
        { label: 'Analyst Dashboard', path: '/analyst/dashboard', icon: <Assessment /> }
      ],
      user: [] // No dashboard for regular users
    };

    return [...baseItems, ...(roleSpecificItems[user?.role] || [])];
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
        top: 0,
        zIndex: 100
      }}
    >
      <Toolbar>
        {/* Logo/Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }} 
          onClick={() => navigate('/')}
        >
          <SportsScore sx={{ mr: 1, fontSize: '28px', color: '#E50914' }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 400, 
              letterSpacing: '3px', 
              fontFamily: '"Cormorant Garamond", serif', 
              textTransform: 'uppercase',
              fontSize: '1.5rem'
            }}
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
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          />
        )}

        {/* Navigation Links - Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{ 
                ml: 2,
                fontWeight: 600,
                letterSpacing: '1px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 2, 
              display: { xs: 'none', sm: 'block' }, 
              textTransform: 'capitalize',
              color: '#d4d4d4'
            }}
          >
            {user?.firstName || user?.username || user?.email?.split('@')[0] || 'User'}
          </Typography>
          
          <IconButton
            size="large"
            aria-label="account menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'rgba(229, 9, 20, 0.2)',
                border: '2px solid rgba(229, 9, 20, 0.3)'
              }}
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
                minWidth: 220,
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {/* User Info */}
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold" color="white">
                  {user?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
                  {getRoleDisplayName(user?.role)}
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Mobile Navigation Items */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {navigationItems.map((item) => (
                <MenuItem 
                  key={item.path} 
                  onClick={() => handleNavigation(item.path)}
                  sx={{ color: 'white' }}
                >
                  <ListItemIcon sx={{ color: '#E50914' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </MenuItem>
              ))}
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>

            {/* Profile */}
            <MenuItem 
              onClick={() => handleNavigation('/profile')}
              sx={{ color: 'white' }}
            >
              <ListItemIcon sx={{ color: '#E50914' }}>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

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
