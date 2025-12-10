const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create instance
const apiService = new ApiService();

// Named exports for specific APIs
export const matchAPI = {
  getMatches: () => apiService.get('/matches'),
  getMatchById: (id) => apiService.get(`/matches/${id}`),
  createMatch: (data) => apiService.post('/matches', data),
  updateMatch: (id, data) => apiService.put(`/matches/${id}`, data),
  deleteMatch: (id) => apiService.delete(`/matches/${id}`),
};

export const commentaryAPI = {
  getCommentary: (matchId) => apiService.get(`/commentary/${matchId}`),
  generateCommentary: (data) => apiService.post('/commentary/generate', data),
  voteCommentary: (id, vote) => apiService.post(`/commentary/${id}/vote`, { vote }),
  bookmarkCommentary: (id) => apiService.post(`/commentary/${id}/bookmark`),
  deleteCommentary: (id) => apiService.delete(`/commentary/${id}`),
};

export const predictionAPI = {
  getPredictions: (matchId) => apiService.get(`/predictions/${matchId}`),
  generatePrediction: (data) => apiService.post('/predictions/generate', data),
  updatePrediction: (id, data) => apiService.put(`/predictions/${id}`, data),
};

export const analysisAPI = {
  getAnalysis: (matchId) => apiService.get(`/analysis/${matchId}`),
  generateAnalysis: (data) => apiService.post('/analysis/generate', data),
};

export const insightsAPI = {
  getInsights: (matchId) => apiService.get(`/insights/${matchId}`),
  generateInsights: (data) => apiService.post('/insights/generate', data),
};

// Default export
export default apiService;