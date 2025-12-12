import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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
  IconButton,
  Autocomplete
} from '@mui/material';
import { Person, Email, SportsSoccer, AdminPanelSettings, CalendarToday, Edit, Save, Cancel, PhotoCamera, Delete } from '@mui/icons-material';
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
  const [newSport, setNewSport] = useState('');

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data } = await api.get('/sports');
        setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Failed to fetch sports", error);
      }
    };
    fetchSports();
  }, []);

  const fetchProfile = useCallback(async () => {
    if (token) {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setProfile(data);
        dispatch(setCredentials({ user: data, token }));
        setFormData({
          ...data, favoriteSport: data.favoriteSport?._id || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAddSport = async () => {
    if (!newSport.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/sports', { name: newSport }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSports([...sports, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewSport('');
      setSuccess('Sport added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add sport');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sport?')) return;
    setLoading(true);
    try {
      await api.delete(`/sports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSports(sports.filter((sport) => sport._id !== id));
      setSuccess('Sport deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sport');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        favoriteSport: formData.favoriteSport,
      };

      const { data } = await api.put('/users/profile', updatePayload);
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
      await api.post('/users/profile/photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchProfile();
      setSuccess('Profile photo updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#E50914' }} />
          <Typography variant="h6" sx={{ mt: 2, color: '#d4d4d4' }}>Loading Profile...</Typography>
        </Box>
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #1a1a1a 100%)',
      py: 6,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(ellipse at top center, rgba(229, 9, 20, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#fafafa',
            mb: 4,
            textAlign: 'center'
          }}
        >
          My Profile
        </Typography>

        <Card 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, rgba(36, 36, 36, 0.5) 0%, rgba(47, 47, 47, 0.3) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Grid container spacing={4} alignItems="flex-start">
              {/* Left Side - Avatar */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box
                  position="relative"
                  display="inline-block"
                  mb={3}
                  sx={{
                    ...(!editMode && { '&:hover .upload-overlay': { opacity: 1 } })
                  }}
                >
                  <Avatar
                    src={profile.photoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    sx={{ 
                      width: 160, 
                      height: 160, 
                      margin: 'auto', 
                      fontSize: '4rem',
                      border: '3px solid rgba(229, 9, 20, 0.3)',
                      boxShadow: '0 8px 32px rgba(229, 9, 20, 0.2)'
                    }}
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
                    bgcolor="rgba(0, 0, 0, 0.7)"
                    borderRadius="50%"
                    sx={{
                      opacity: editMode ? 1 : 0,
                      transition: 'opacity 0.3s',
                      cursor: 'pointer',
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {uploading ? (
                      <CircularProgress sx={{ color: 'white' }} />
                    ) : (
                      <PhotoCamera sx={{ color: 'white', fontSize: 40 }} />
                    )}
                  </Box>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/png, image/jpeg, image/gif" 
                    onChange={handlePhotoUpload} 
                  />
                </Box>

                <Typography 
                  variant="h5" 
                  component="h1"
                  sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: '#fafafa',
                    letterSpacing: '1px',
                    mb: 2
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Typography>

                <Chip
                  icon={<AdminPanelSettings />}
                  label={profile.role.toUpperCase()}
                  sx={{ 
                    mt: 1,
                    background: profile.role === 'admin' 
                      ? 'linear-gradient(135deg, #E50914 0%, #B20710 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    fontSize: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Grid>

              {/* Right Side - Details */}
              <Grid item xs={12} md={8}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 400,
                      fontSize: '2rem',
                      color: '#fafafa',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Account Details
                  </Typography>
                  {!editMode && (
                    <Button 
                      startIcon={<Edit />} 
                      onClick={() => setEditMode(true)}
                      sx={{
                        color: '#fafafa',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '50px',
                        px: 3,
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontSize: '0.8125rem',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {editMode ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="First Name" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fafafa',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#a0a0a0',
                            fontSize: '0.875rem',
                            letterSpacing: '1px'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#fafafa'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Last Name" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fafafa',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#a0a0a0',
                            fontSize: '0.875rem',
                            letterSpacing: '1px'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#fafafa'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        fullWidth
                        options={sports}
                        getOptionLabel={(option) => option.name}
                        value={sports.find((s) => s._id === formData.favoriteSport) || null}
                        onChange={(event, newValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            favoriteSport: newValue ? newValue._id : '',
                          }));
                        }}
                        renderInput={(params) => <TextField {...params} label="Favorite Sport" />}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fafafa',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#a0a0a0',
                            fontSize: '0.875rem',
                            letterSpacing: '1px'
                          },
                          '& .MuiAutocomplete-popupIndicator': {
                            color: '#a0a0a0'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        disabled 
                        label="Email" 
                        value={formData.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#a0a0a0',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        disabled 
                        label="Role" 
                        value={formData.role}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#a0a0a0',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<Cancel />} 
                        onClick={handleCancel} 
                        disabled={loading}
                        sx={{
                          color: '#fafafa',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '50px',
                          px: 3,
                          fontWeight: 600,
                          letterSpacing: '1px',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        startIcon={<Save />} 
                        onClick={handleSave} 
                        disabled={loading}
                        sx={{
                          background: '#fafafa',
                          color: '#0f0f0f',
                          borderRadius: '50px',
                          px: 3,
                          fontWeight: 700,
                          letterSpacing: '1px',
                          boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)',
                          '&:hover': {
                            background: '#ffffff',
                            boxShadow: '0 12px 32px rgba(255, 255, 255, 0.25)'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} sx={{ color: '#0f0f0f' }} /> : 'Save'}
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <List sx={{ color: '#fafafa' }}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon><Person sx={{ color: '#E50914' }} /></ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontSize: '0.875rem', color: '#a0a0a0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Full Name
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '1.125rem', color: '#fafafa', mt: 0.5 }}>
                            {`${profile.firstName} ${profile.lastName}`}
                          </Typography>
                        } 
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon><Email sx={{ color: '#E50914' }} /></ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontSize: '0.875rem', color: '#a0a0a0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Email Address
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '1.125rem', color: '#fafafa', mt: 0.5 }}>
                            {profile.email}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon><SportsSoccer sx={{ color: '#E50914' }} /></ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontSize: '0.875rem', color: '#a0a0a0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Favorite Sport
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '1.125rem', color: '#fafafa', mt: 0.5 }}>
                            {profile.favoriteSport?.name || 'None'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon><CalendarToday sx={{ color: '#E50914' }} /></ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontSize: '0.875rem', color: '#a0a0a0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Member Since
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '1.125rem', color: '#fafafa', mt: 0.5 }}>
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                )}

                {/* Admin Section */}
                {profile.role === 'admin' && !editMode && (
                  <Box sx={{ 
                    mt: 4, 
                    pt: 4, 
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                        fontSize: '1.75rem',
                        color: '#fafafa',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        mb: 3
                      }}
                    >
                      Admin Tools
                    </Typography>

                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: '#d4d4d4', 
                        mb: 2,
                        fontSize: '0.9375rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Add New Sport
                    </Typography>
                    <Box display="flex" gap={2} mb={4}>
                      <TextField
                        label="Sport Name"
                        value={newSport}
                        onChange={(e) => setNewSport(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fafafa',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#a0a0a0'
                          }
                        }}
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleAddSport} 
                        disabled={loading || !newSport.trim()}
                        sx={{
                          background: '#fafafa',
                          color: '#0f0f0f',
                          borderRadius: '50px',
                          px: 3,
                          fontWeight: 700,
                          letterSpacing: '1px',
                          '&:hover': {
                            background: '#ffffff'
                          },
                          '&:disabled': {
                            opacity: 0.5
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Box>

                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: '#d4d4d4', 
                        mb: 2,
                        fontSize: '0.9375rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Manage Existing Sports
                    </Typography>
                    <List 
                      dense 
                      sx={{ 
                        maxHeight: 250, 
                        overflow: 'auto', 
                        bgcolor: 'rgba(0, 0, 0, 0.3)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '12px',
                        '&::-webkit-scrollbar': {
                          width: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px'
                        }
                      }}
                    >
                      {sports.map((sport) => (
                        <ListItem
                          key={sport._id}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              aria-label="delete" 
                              onClick={() => handleDeleteSport(sport._id)} 
                              disabled={loading}
                              sx={{ 
                                color: '#E50914',
                                '&:hover': {
                                  background: 'rgba(229, 9, 20, 0.1)'
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          }
                          sx={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            '&:last-child': {
                              borderBottom: 'none'
                            }
                          }}
                        >
                          <ListItemText 
                            primary={sport.name} 
                            sx={{ 
                              '& .MuiListItemText-primary': {
                                color: '#fafafa',
                                fontWeight: 500
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbars */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ 
            width: '100%',
            background: 'rgba(220, 38, 38, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#fca5a5'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            background: 'rgba(16, 185, 129, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6ee7b7'
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
      `}</style>
    </Box>
  );
};

export default Profile;