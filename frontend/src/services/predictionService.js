import api from './api';

export const predictionService = {
  // Generate prediction for a match
  generatePrediction: async (matchId) => {
    try {
      const response = await api.post(`/predictions/generate/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all predictions
  getPredictions: async (filters = {}) => {
    try {
      const response = await api.get('/predictions', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get prediction by match ID
  getPredictionByMatch: async (matchId) => {
    try {
      const response = await api.get(`/predictions/match/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get prediction accuracy stats
  getAccuracyStats: async () => {
    try {
      const response = await api.get('/predictions/accuracy');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get predictions by sport
  getPredictionsBySport: async (sport) => {
    try {
      const response = await api.get(`/predictions/sport/${sport}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get predictions by confidence level
  getPredictionsByConfidence: async (minConfidence) => {
    try {
      const response = await api.get('/predictions/confidence', {
        params: { min: minConfidence }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update prediction result
  updatePredictionResult: async (predictionId, result) => {
    try {
      const response = await api.patch(`/predictions/${predictionId}/result`, {
        result
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get prediction history
  getPredictionHistory: async (limit = 20) => {
    try {
      const response = await api.get('/predictions/history', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};