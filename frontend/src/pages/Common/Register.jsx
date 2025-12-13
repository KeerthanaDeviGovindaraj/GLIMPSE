import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Auth.css';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    favoriteSport: '',
    password: '',
    confirmPassword: '',
    photo: null
  });
  const [sports, setSports] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchSports = async () => {
      try {
        
          const { data } = await api.get('/sports');
          setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Failed to fetch sports', error);
      }
    };
    fetchSports();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    let tempErrors = { ...errors };

    switch (name) {
      case 'firstName':
        tempErrors.firstName = value.trim() ? "" : "First name is required";
        break;
      case 'lastName':
        tempErrors.lastName = value.trim() ? "" : "Last name is required";
        break;
      case 'email':
        if (!value.trim()) {
          tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          tempErrors.email = "Email is invalid";
        } else {
          tempErrors.email = "";
        }
        break;
      case 'password':
        if (!value) {
          tempErrors.password = "Password is required";
        } else if (value.length < 6) {
          tempErrors.password = "Password must be at least 6 characters";
        } else {
          tempErrors.password = "";
        }
        if (formData.confirmPassword) {
          tempErrors.confirmPassword = value === formData.confirmPassword ? "" : "Passwords do not match";
        }
        break;
      case 'confirmPassword':
        tempErrors.confirmPassword = value === formData.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, photo: "File size should not exceed 5MB" });
        e.target.value = null; // Reset input
        setFormData({ ...formData, photo: null });
      } else {
        setErrors(prev => { const { photo, ...rest } = prev; return rest; });
        setFormData({ ...formData, photo: file });
      }
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Use FormData for file upload
      const submissionData = new FormData();
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('password', formData.password);
      if (formData.favoriteSport) {
        submissionData.append('favoriteSport', formData.favoriteSport);
      }
      if (formData.photo) {
        submissionData.append('photo', formData.photo);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        // Do NOT set Content-Type header when sending FormData; 
        // the browser will set it automatically with the boundary.
        body: submissionData
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error(e);
        throw new Error('Server error: Unable to connect to registration service');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
      
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join the community today</p>
        </div>

        {errors.api && <div className="error-message">⚠️ {errors.api}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Favorite Sport</label>
            <select
              name="favoriteSport"
              className="form-select"
              value={formData.favoriteSport}
              onChange={handleChange}
            >
              <option value="" disabled>Select your favorite sport</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>{sport.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group file-input-wrapper">
            <label className="form-label">Profile Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />
            {errors.photo && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.photo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
            {errors.password && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span style={{color: '#ff8a8a', fontSize: '0.8rem'}}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;