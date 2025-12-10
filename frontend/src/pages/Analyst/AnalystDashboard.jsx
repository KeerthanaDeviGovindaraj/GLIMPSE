import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  DataUsage,
  Timeline,
  Assignment,
  Insights
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const AnalystDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [analyticsData, setAnalyticsData] = useState({
    reportsGenerated: 15,
    dataProcessed: '2.3TB',
    accuracy: 94.5,
    trendsIdentified: 8
  });
  const [recentReports, setRecentReports] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
    fetchRecentReports();
    fetchTasks();
  }, []);

  const fetchAnalyticsData = async () => {
    // Replace with your actual API call
    setAnalyticsData({
      reportsGenerated: 15,
      dataProcessed: '2.3TB',
      accuracy: 94.5,
      trendsIdentified: 8
    });
  };

  const fetchRecentReports = async () => {
    const mockReports = [
      { id: 1, title: 'Monthly Sales Analysis', date: '2024-11-20', status: 'completed' },
      { id: 2, title: 'Customer Behavior Trends', date: '2024-11-18', status: 'in-progress' },
      { id: 3, title: 'Market Research Q4', date: '2024-11-15', status: 'completed' },
    ];
    setRecentReports(mockReports);
  };

  const fetchTasks = async () => {
    const mockTasks = [
      { id: 1, title: 'Review Q4 data patterns', priority: 'high', dueDate: '2024-11-26' },
      { id: 2, title: 'Update forecasting model', priority: 'medium', dueDate: '2024-11-28' },
      { id: 3, title: 'Prepare presentation for stakeholders', priority: 'high', dueDate: '2024-11-25' },
    ];
    setTasks(mockTasks);
  };

  const MetricCard = ({ title, value, subtitle, icon, progress }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
        )}
      </CardContent>
    </Card>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analyst Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Welcome back, {user?.email}! Here's your analytics overview.
      </Typography>

      {/* Analytics Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Reports Generated"
            value={analyticsData.reportsGenerated}
            subtitle="This month"
            icon={<Assessment fontSize="large" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Data Processed"
            value={analyticsData.dataProcessed}
            subtitle="Total volume"
            icon={<DataUsage fontSize="large" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Model Accuracy"
            value={`${analyticsData.accuracy}%`}
            subtitle="Current performance"
            icon={<TrendingUp fontSize="large" />}
            progress={analyticsData.accuracy}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Trends Identified"
            value={analyticsData.trendsIdentified}
            subtitle="This week"
            icon={<Timeline fontSize="large" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Reports */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Reports</Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <List>
              {recentReports.map((report, index) => (
                <React.Fragment key={report.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Insights color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={`${report.date} • ${report.status}`}
                    />
                  </ListItem>
                  {index < recentReports.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Pending Tasks</Typography>
              <Button variant="outlined" size="small">
                Add Task
              </Button>
            </Box>
            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment color={getPriorityColor(task.priority)} />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${task.dueDate} • Priority: ${task.priority}`}
                    />
                  </ListItem>
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalystDashboard;
