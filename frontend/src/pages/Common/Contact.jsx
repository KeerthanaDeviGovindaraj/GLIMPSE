import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Auth.css';

const Contact = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(formState).some((field) => field === "")) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess("Your message has been sent successfully!");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>Get in Touch</h1>
          <p className="auth-subtitle">
            Have questions? Reach out and we'll respond as soon as possible.
          </p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
        {success && (
          <div 
            className="success-message" 
            style={{
              background: 'rgba(46, 204, 113, 0.15)', 
              border: '1px solid rgba(46, 204, 113, 0.3)', 
              color: '#2ecc71', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '24px', 
              textAlign: 'center'
            }}
          >
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-input"
              placeholder="Enter subject"
              value={formState.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className="form-input"
              placeholder="Enter your message"
              value={formState.message}
              onChange={handleChange}
              required
              rows="5"
              style={{ resize: 'vertical', minHeight: '120px', fontFamily: 'inherit' }}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            onClick={() => navigate(isAuthenticated ? '/' : '/login')}
            className="auth-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
