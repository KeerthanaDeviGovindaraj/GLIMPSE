import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from '../components/NavBar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet /> {/* Child routes will render here */}
      </Box>
    </Box>
  );
};

export default MainLayout;