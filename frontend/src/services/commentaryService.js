import api from './api';

export const commentaryService = {
  // Get all commentary for a match
  getMatchCommentary: async (matchId) => {
    try {
      const response = await api.get(`/matches/${matchId}/commentary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add commentary
  addCommentary: async (matchId, commentaryData) => {
    try {
      const response = await api.post(`/matches/${matchId}/commentary`, commentaryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get filtered commentary
  getFilteredCommentary: async (matchId, filters) => {
    try {
      const response = await api.get(`/matches/${matchId}/commentary`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get commentary by type
  getCommentaryByType: async (matchId, type) => {
    try {
      const response = await api.get(`/matches/${matchId}/commentary/type/${type}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update commentary
  updateCommentary: async (matchId, commentaryId, data) => {
    try {
      const response = await api.put(
        `/matches/${matchId}/commentary/${commentaryId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete commentary
  deleteCommentary: async (matchId, commentaryId) => {
    try {
      const response = await api.delete(
        `/matches/${matchId}/commentary/${commentaryId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};