import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';
// ✨ NEW: Chatbot imports
import ChatbotIcon from '../../components/ChatbotIcon';
import ChatForm from '../../components/ChatForm';
import ChatMessage from '../../components/ChatMessage';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ NEW: Chatbot state
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✨ NEW: Generate bot response function
  const generateBotResponse = async (history) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_KEY) {
      setChatHistory(prev => {
        const filtered = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [
          ...filtered,
          {
            role: "model",
            parts: [{ text: "Error: API key not configured. Please add VITE_API_KEY to your .env file." }]
          }
        ];
      });
      return;
    }

    const fullURL = `${API_URL}?key=${API_KEY}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    };

    try {
      const response = await fetch(fullURL, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      const apiResponse = data.candidates[0].content.parts[0].text;

      setChatHistory(prev => {
        const filteredHistory = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [...filteredHistory, { role: "model", parts: [{ text: apiResponse }] }];
      });

    } catch (error) {
      setChatHistory(prev => {
        const filteredHistory = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [...filteredHistory, { role: "model", parts: [{ text: `Error: ${error.message}. Please try again.` }] }];
      });
    }
  };

  // ✨ NEW: Auto-scroll chat
  useEffect(() => {
    if (chatBodyRef.current) {
      const isAtBottom =
        chatBodyRef.current.scrollHeight ===
        chatBodyRef.current.scrollTop + chatBodyRef.current.clientHeight;

      if (isAtBottom) {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Server error: Unable to connect to login service');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Dispatch to Redux and navigate
      dispatch(setCredentials({ ...data }));
      navigate('/commentary');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Google login failed');

      dispatch(setCredentials(data));
      navigate('/commentary');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue your journey</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed. Please try again.')}
            width="100%"
          />
        </div>

        <div className="auth-options">
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>

      {/* ✨ NEW: Chatbot Integration - Floating Button */}
      <button
        className="chat-toggler"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {/* ✨ NEW: Chatbot Popup */}
      <div className={`chatbot-popup ${isChatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>

          <button
            className="material-symbols-rounded"
            onClick={() => setIsChatOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hello! <br /> How can I assist you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

          <div ref={chatEndRef} style={{ visibility: "visible" }} />
        </div>

        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            chatHistory={chatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;