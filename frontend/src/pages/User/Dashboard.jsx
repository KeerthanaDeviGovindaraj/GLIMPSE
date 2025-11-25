import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom fontWeight={700}>
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Hello, {user?.email || 'User'}!
        </Typography>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography>This is your personal space.</Typography>
          <Typography>You can browse jobs, view your applications, and manage your profile from here.</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
