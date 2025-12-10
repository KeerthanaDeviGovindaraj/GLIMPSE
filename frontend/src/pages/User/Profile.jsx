import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormControl,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Snackbar,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Person, Email, SportsSoccer, AdminPanelSettings, CalendarToday, Edit, Save, Cancel, PhotoCamera } from '@mui/icons-material';
import { setCredentials } from '../../redux/slices/authSlice';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data } = await api.get('/sports');
        setSports(data);
      } catch (error) {
        console.error("Failed to fetch sports", error);
      }
    };
    fetchSports();
  }, []);

  const fetchProfile = useCallback(async () => {
    // No need to fetch if we already have the user in Redux state,
    // but fetching ensures we have the latest data.
    if (token) {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data.');
        }

        setProfile(data);
        // Ensure favoriteSport is an ID for the form
        setFormData({
          ...data, favoriteSport: data.favoriteSport?._id || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Construct a payload with only the fields that should be updated.
      // This prevents sending the large photo buffer back to the server.
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        favoriteSport: formData.favoriteSport,
      };

      // Use correct axios syntax: api.put(url, data). The interceptor handles headers.
      const { data } = await api.put('/users/profile', updatePayload);

      // Update profile data and Redux state
      // The 'data' object from the API response contains { message, user }
      setProfile(data.user);
      dispatch(setCredentials({ user: data.user, token }));

      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/users/profile/photo', formData, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo.');
      }

      // Refetch profile to get the latest user data with the new photo
      await fetchProfile();
      setSuccess('Profile photo updated successfully!');

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Only show the full-page loader on the initial fetch
  if (loading && !profile) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Profile...</Typography>
      </Container>
    );
  }

  // Only show a full-page error if the initial profile fetch failed
  if (error && !profile) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box
                position="relative"
                display="inline-block"
                mb={2} // Move margin-bottom here
                sx={{
                  ...(!editMode && { '&:hover .upload-overlay': { opacity: 1 } })
                }}
              >
                <Avatar
                  src={profile.photoUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  sx={{ width: 150, height: 150, margin: 'auto', fontSize: '4rem' }}
                >
                  {profile.firstName?.charAt(0)}
                </Avatar>
                <Box
                  className="upload-overlay"
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="rgba(0, 0, 0, 0.5)"
                  borderRadius="50%"
                  sx={{
                    opacity: editMode ? 1 : 0, // Always visible in edit mode
                    transition: 'opacity 0.3s',
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploading ? <CircularProgress color="inherit" /> : <PhotoCamera sx={{ color: 'white', fontSize: 40 }} />}
                </Box>
                <input type="file" ref={fileInputRef} hidden accept="image/png, image/jpeg, image/gif" onChange={handlePhotoUpload} />
              </Box>
              <Typography variant="h5" component="h1">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Chip
                icon={<AdminPanelSettings />}
                label={profile.role}
                color={profile.role === 'admin' ? 'secondary' : 'primary'}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>
                  Account Details
                </Typography>
                {!editMode && (
                  <Button startIcon={<Edit />} onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="favorite-sport-label">Favorite Sport</InputLabel>
                      <Select
                        labelId="favorite-sport-label"
                        label="Favorite Sport"
                        name="favoriteSport"
                        value={formData.favoriteSport}
                        onChange={handleInputChange}
                      >
                        {sports.map((sport) => (
                          <MenuItem key={sport._id} value={sport._id}>{sport.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth disabled label="Email" value={formData.email} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth disabled label="Role" value={formData.role} />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Full Name" secondary={`${profile.firstName} ${profile.lastName}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email /></ListItemIcon>
                    <ListItemText primary="Email Address" secondary={profile.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SportsSoccer /></ListItemIcon>
                    <ListItemText primary="Favorite Sport" secondary={profile.favoriteSport?.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarToday /></ListItemIcon>
                    <ListItemText primary="Member Since" secondary={new Date(profile.createdAt).toLocaleDateString()} />
                  </ListItem>
                </List>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;