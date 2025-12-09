import api from './api';

export const analysisService = {
  // Get match analysis
  getMatchAnalysis: async (matchId) => {
    try {
      const response = await api.get(`/analysis/match/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get team statistics
  getTeamStats: async (teamId) => {
    try {
      const response = await api.get(`/analysis/team/${teamId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get player statistics
  getPlayerStats: async (playerId) => {
    try {
      const response = await api.get(`/analysis/player/${playerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get comparison data
  getComparison: async (team1Id, team2Id) => {
    try {
      const response = await api.get(`/analysis/compare/${team1Id}/${team2Id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get historical data
  getHistoricalData: async (matchId) => {
    try {
      const response = await api.get(`/analysis/historical/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get performance metrics
  getPerformanceMetrics: async (matchId) => {
    try {
      const response = await api.get(`/analysis/performance/${matchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
