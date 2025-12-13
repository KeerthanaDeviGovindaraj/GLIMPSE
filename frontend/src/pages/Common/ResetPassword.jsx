import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../components/styles/CommonStyles.css';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let tempErrors = { ...errors };
    if (name === 'password') {
      if (!value) tempErrors.password = "Password is required";
      else if (value.length < 6) tempErrors.password = "Password must be at least 6 characters";
      else tempErrors.password = "";

      if (formData.confirmPassword) {
        tempErrors.confirmPassword = value === formData.confirmPassword ? "" : "Passwords do not match";
      }
    }
    if (name === 'confirmPassword') {
      tempErrors.confirmPassword = value === formData.password ? "" : "Passwords do not match";
    }
    setErrors(tempErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.put(`/password/reset/${token}`, { password: formData.password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p className="auth-subtitle">Enter your new password below.</p>
        </div>

        {message && <div className="success-message" style={{background: 'rgba(46, 204, 113, 0.15)', border: '1px solid rgba(46, 204, 113, 0.3)', color: '#2ecc71', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center'}}>✓ {message}</div>}
        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter new password"
            />
            {errors.password && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}