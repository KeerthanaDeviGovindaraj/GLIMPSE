import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Snackbar,
  IconButton,
} from '@mui/material';
import { Person, Email, SportsSoccer, AdminPanelSettings, CalendarToday, Edit, Save, Cancel, PhotoCamera } from '@mui/icons-material';
import { setCredentials } from '../../redux/slices/authSlice';
import api from '../../services/api';
import '../../components/styles/CommonStyles.css';

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
        setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Failed to fetch sports", error);
      }
    };
    fetchSports();
  }, []);

  const fetchProfile = useCallback(async () => {
    // No need to fetch if we already have the user in Redux state,
    // but fetching ensures we have the latest data.
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/users/profile');
      setProfile(data);
      dispatch(setCredentials({ user: data, token }));
      setFormData({ ...data, favoriteSport: data.favoriteSport?._id || '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

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

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size should not exceed 5MB");
      event.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/users/profile/photo', formData);

      // Refetch profile to get the latest user data with the new photo
      await fetchProfile();
      setSuccess('Profile photo updated successfully!');

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  // Only show the full-page loader on the initial fetch
  if (loading && !profile) {
    return (
      <div className="auth-container">
        <CircularProgress sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Loading Profile...</Typography>
      </div>
    );
  }

  // Only show a full-page error if the initial profile fetch failed
  if (error && !profile) {
    return (
      <div className="auth-container">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: '60px', minHeight: 'calc(100vh - 70px)' }}>
      <div className="auth-card profile-card">
        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="profile-avatar-wrapper" onClick={() => editMode && fileInputRef.current.click()}>
              <Avatar
                src={profile.photoUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                sx={{ width: 150, height: 150, margin: 'auto', fontSize: '4rem', border: '3px solid rgba(255,255,255,0.2)' }}
              >
                {profile.firstName?.charAt(0)}
              </Avatar>
              <div className="upload-overlay" style={{ opacity: editMode ? 1 : 0 }}>
                {uploading ? <CircularProgress color="inherit" size={30} /> : <PhotoCamera sx={{ color: 'white', fontSize: 40 }} />}
              </div>
              <input type="file" ref={fileInputRef} hidden accept="image/png, image/jpeg, image/gif" onChange={handlePhotoUpload} disabled={!editMode} />
            </div>
            <Typography variant="h5" component="h1" sx={{ color: 'var(--text-primary)' }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Chip
              icon={<AdminPanelSettings />}
              label={profile.role}
              variant="outlined"
              sx={{ mt: 1, color: 'var(--text-tertiary)', borderColor: 'rgba(255,255,255,0.2)' }}
            />
          </div>

          <div className="profile-main">
            <div className="profile-main-header">
              <h2>Account Details</h2>
              {!editMode && (
                <Button startIcon={<Edit />} onClick={() => setEditMode(true)} sx={{ color: 'var(--text-secondary)' }}>
                  Edit
                </Button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Favorite Sport</label>
                  <select
                    name="favoriteSport"
                    className="form-select"
                    value={formData.favoriteSport}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a sport</option>
                    {sports.map(sport => <option key={sport._id} value={sport._id}>{sport.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={formData.email} disabled />
                </div>
                <div className="edit-actions">
                  <button type="button" className="auth-btn btn-secondary" onClick={handleCancel} disabled={loading}>Cancel</button>
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-detail-grid">
                <div className="profile-detail-card">
                  <div className="profile-detail-header">
                    <div className="profile-detail-icon-wrapper">
                      <Person />
                    </div>
                    <div className="profile-detail-label">Full Name</div>
                  </div>
                  <div className="profile-detail-value">{`${profile.firstName} ${profile.lastName}`}</div>
                </div>
                
                <div className="profile-detail-card">
                  <div className="profile-detail-header">
                    <div className="profile-detail-icon-wrapper">
                      <Email />
                    </div>
                    <div className="profile-detail-label">Email Address</div>
                  </div>
                  <div className="profile-detail-value">{profile.email}</div>
                </div>

                <div className="profile-detail-card">
                  <div className="profile-detail-header">
                    <div className="profile-detail-icon-wrapper">
                      <SportsSoccer />
                    </div>
                    <div className="profile-detail-label">Favorite Sport</div>
                  </div>
                  <div className="profile-detail-value">{profile.favoriteSport?.name || 'None'}</div>
                </div>

                <div className="profile-detail-card">
                  <div className="profile-detail-header">
                    <div className="profile-detail-icon-wrapper">
                      <CalendarToday />
                    </div>
                    <div className="profile-detail-label">Member Since</div>
                  </div>
                  <div className="profile-detail-value">{new Date(profile.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Profile;