import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { Delete, SportsSoccer } from '@mui/icons-material';
import api from '../../services/api';
import './AdminDashboard.css';

const SportsManagement = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sports');
      setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Failed to fetch sports", error);
      setError('Failed to fetch sports');
    } finally {
      setLoading(false);
    }
  };

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

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sports Management</h1>
        <p>Manage available sports for the platform</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dashboard-card">
            <div className="dashboard-card-content">
                <div className="dashboard-card-title">Add New Sport</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <input
                        type="text"
                        value={newSport}
                        onChange={(e) => setNewSport(e.target.value)}
                        placeholder="Enter sport name"
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        onClick={handleAddSport}
                        disabled={loading || !newSport.trim()}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#E50914',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            opacity: (loading || !newSport.trim()) ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Adding...' : 'Add Sport'}
                    </button>
                </div>
            </div>
        </div>

        <div className="dashboard-card">
            <div className="dashboard-card-content">
                <div className="dashboard-card-title">Existing Sports</div>
                <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
                    {sports.map((sport) => (
                        <div 
                            key={sport._id} 
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <SportsSoccer style={{ color: '#E50914' }} />
                                <span style={{ fontSize: '1.1rem' }}>{sport.name}</span>
                            </div>
                            <IconButton 
                                onClick={() => handleDeleteSport(sport._id)}
                                disabled={loading}
                                sx={{ color: '#808080', '&:hover': { color: '#E50914' } }}
                            >
                                <Delete />
                            </IconButton>
                        </div>
                    ))}
                    {sports.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#808080', padding: '20px' }}>
                            No sports found.
                        </div>
                    )}
                </div>
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

export default SportsManagement;