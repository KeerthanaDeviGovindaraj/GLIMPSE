import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';
import PrimaryButton from '../../components/PrimaryButton';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/password/forgot', { email });
      setMessage('Email sent! Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </PrimaryButton>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                  Back to Login
                </RouterLink>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}