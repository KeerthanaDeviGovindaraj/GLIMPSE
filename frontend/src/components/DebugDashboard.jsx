// Create a temporary debug component: src/components/DebugDashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';

const DebugDashboard = () => {
  const auth = useSelector((state) => state.auth);
  const entireState = useSelector((state) => state);

  console.log('Full Redux State:', entireState);
  console.log('Auth State:', auth);
  console.log('User:', auth?.user);
  console.log('User Role:', auth?.user?.role);
  console.log('Is Authenticated:', auth?.isAuthenticated);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Debug Dashboard
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Redux Auth State:</Typography>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
          {JSON.stringify(auth, null, 2)}
        </pre>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">User Role Detection:</Typography>
        <Typography>Is Authenticated: {String(auth?.isAuthenticated)}</Typography>
        <Typography>User exists: {String(!!auth?.user)}</Typography>
        <Typography>User role: {auth?.user?.role || 'undefined'}</Typography>
        <Typography>User email: {auth?.user?.email || 'undefined'}</Typography>
      </Paper>
    </Box>
  );
};

export default DebugDashboard;