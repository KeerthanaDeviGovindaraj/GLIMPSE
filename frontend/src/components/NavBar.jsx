import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(15, 15, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo/Brand */}
      <div 
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <span style={{ fontSize: '1.5rem' }}>🏏</span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.75rem',
          fontWeight: 400,
          color: '#fafafa',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          GLIMPSE
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a 
          onClick={() => navigate('/commentary')}
          style={{
            color: '#d4d4d4',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fafafa'}
          onMouseLeave={(e) => e.target.style.color = '#d4d4d4'}
        >
          <span></span> Commentary
        </a>

        <a 
          onClick={() => navigate('/')}
          style={{
            color: '#d4d4d4',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fafafa'}
          onMouseLeave={(e) => e.target.style.color = '#d4d4d4'}
        >
          <span></span> Home
        </a>

        {/* <a 
          onClick={() => navigate('/dashboard')}
          style={{
            color: '#d4d4d4',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fafafa'}
          onMouseLeave={(e) => e.target.style.color = '#d4d4d4'}
        >
          <span></span> My Dashboard
        </a> */}
      </div>

      {/* User Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div 
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            padding: '8px 20px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{
            color: '#fafafa',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            {user?.username || 'User'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '10px 24px',
            background: 'transparent',
            color: '#fafafa',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#fafafa';
            e.target.style.color = '#0f0f0f';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#fafafa';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

