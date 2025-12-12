// frontend/src/service/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    console.log('🔐 Login attempt:', credentials.email);
    
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ Login successful:', user);
        
        return response;
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      throw error;
    }
  },

  register: async (userData) => {
    console.log('📝 Register attempt:', userData.email);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ Registration successful:', user);
        
        return response;
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
};

// Sports API
export const sportsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/sports');
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  },

  create: async (sportData) => {
    try {
      const response = await api.post('/sports', sportData);
      return response.data;
    } catch (error) {
      console.error('Error creating sport:', error);
      throw error;
    }
  },

  update: async (id, sportData) => {
    try {
      const response = await api.put(`/sports/${id}`, sportData);
      return response.data;
    } catch (error) {
      console.error('Error updating sport:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/sports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sport:', error);
      throw error;
    }
  }
};

// Helper functions
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('👤 Retrieved user from storage:', user);
      return user;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getUserData();
  const isAuth = !!(token && user);
  console.log('🔍 Auth check:', { hasToken: !!token, hasUser: !!user, isAuth });
  return isAuth;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export default api;