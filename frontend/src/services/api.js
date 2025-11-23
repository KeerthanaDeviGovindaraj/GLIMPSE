import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const commentaryAPI = {
  generate: async (matchId, customPrompt) => {
    try {
      const response = await api.post('/commentary/generate', { matchId, customPrompt });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMatchCommentary: async (matchId) => {
    const response = await api.get(`/commentary/match/${matchId}`);
    return response.data;
  }
};

export const matchAPI = {
  getLive: async () => {
    const response = await api.get('/matches/live');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  }
};

export const predictionAPI = {
  generate: async (matchId) => {
    const response = await api.post('/predictions/generate', { matchId });
    return response.data;
  }
};

export const analysisAPI = {
  generate: async (matchId, analysisType = 'tactical') => {
    const response = await api.post('/analysis/generate', { matchId, analysisType });
    return response.data;
  }
};

export default api;