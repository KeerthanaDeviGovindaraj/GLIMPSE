import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Work,
  BookmarkBorder,
  Notifications,
  AccountCircle
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [userStats, setUserStats] = useState({
    appliedJobs: 0,
    bookmarkedJobs: 0,
    messages: 0,
    profile: 'Incomplete'
  });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchUserStats();
    fetchRecentJobs();
  }, []);

  const fetchUserStats = async () => {
    // Replace with your actual API call
    setUserStats({
      appliedJobs: 5,
      bookmarkedJobs: 12,
      messages: 3,
      profile: 'Complete'
    });
  };

  const fetchRecentJobs = async () => {
    const mockJobs = [
      { id: 1, title: 'Frontend Developer', company: 'Tech Corp', applied: true },
      { id: 2, title: 'UI Designer', company: 'Creative Studio', applied: false },
      { id: 3, title: 'Full Stack Developer', company: 'StartUp Inc', applied: true },
    ];
    setRecentJobs(mockJobs);
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Hello {user?.email}! Here's your job search overview.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Applied Jobs"
            value={userStats.appliedJobs}
            icon={<Work />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Bookmarked"
            value={userStats.bookmarkedJobs}
            icon={<BookmarkBorder />}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Messages"
            value={userStats.messages}
            icon={<Notifications />}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Profile"
            value={userStats.profile}
            icon={<AccountCircle />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Recent Job Recommendations */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Recommended Jobs</Typography>
          <Button variant="contained" color="primary">
            View All Jobs
          </Button>
        </Box>
        <List>
          {recentJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <ListItem
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <ListItemText
                  primary={job.title}
                  secondary={job.company}
                />
                <Box>
                  {job.applied ? (
                    <Chip label="Applied" color="success" size="small" />
                  ) : (
                    <Button size="small" variant="outlined" color="primary">
                      Apply
                    </Button>
                  )}
                </Box>
              </ListItem>
              {index < recentJobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default UserDashboard;