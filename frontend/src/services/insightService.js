import api from './api';

export const insightService = {
  // Generate AI insights for a match
  generateInsights: async (matchId) => {
    try {
      const response = await api.post(`/insights/generate/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get insights for a match
  getMatchInsights: async (matchId) => {
    try {
      const response = await api.get(`/insights/match/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get trending insights
  getTrendingInsights: async (sport) => {
    try {
      const response = await api.get('/insights/trending', {
        params: { sport }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get key moments
  getKeyMoments: async (matchId) => {
    try {
      const response = await api.get(`/insights/moments/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get match summary
  getMatchSummary: async (matchId) => {
    try {
      const response = await api.get(`/insights/summary/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tactical analysis
  getTacticalAnalysis: async (matchId) => {
    try {
      const response = await api.get(`/insights/tactical/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};