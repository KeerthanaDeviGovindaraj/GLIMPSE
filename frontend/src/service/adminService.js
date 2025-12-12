// service/adminService.js
import api, { handleApiError } from './api';

const adminService = {
  // ==================== SPORTS CRUD OPERATIONS ====================

  /**
   * Get all sports with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {string} params.popularity - Filter by popularity
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sort - Sort field (default: -createdAt)
   * @returns {Promise} Response with sports list
   */
  getAllSports: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/sports${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single sport by ID
   * @param {string} id - Sport ID
   * @returns {Promise} Response with sport data
   */
  getSportById: async (id) => {
    try {
      const response = await api.get(`/admin/sports/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new sport (Admin only)
   * @param {Object} sportData - Sport data
   * @param {string} sportData.name - Sport name (required)
   * @param {string} sportData.category - Category (required)
   * @param {string} sportData.description - Description
   * @param {string} sportData.rulesLink - Rules URL
   * @param {string} sportData.popularity - Popularity level
   * @param {boolean} sportData.isActive - Active status
   * @returns {Promise} Response with created sport
   */
  createSport: async (sportData) => {
    try {
      const response = await api.post('/admin/sports', sportData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update sport by ID (Admin only)
   * @param {string} id - Sport ID
   * @param {Object} sportData - Sport data to update
   * @returns {Promise} Response with updated sport
   */
  updateSport: async (id, sportData) => {
    try {
      const response = await api.put(`/admin/sports/${id}`, sportData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete sport by ID (Admin only)
   * @param {string} id - Sport ID
   * @returns {Promise} Response with success message
   */
  deleteSport: async (id) => {
    try {
      const response = await api.delete(`/admin/sports/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Toggle sport active status (Admin only)
   * @param {string} id - Sport ID
   * @returns {Promise} Response with updated sport
   */
  toggleSportStatus: async (id) => {
    try {
      const response = await api.patch(`/admin/sports/${id}/toggle`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Bulk delete sports (Admin only)
   * @param {Array<string>} ids - Array of sport IDs to delete
   * @returns {Promise} Response with deleted count
   */
  bulkDeleteSports: async (ids) => {
    try {
      const response = await api.post('/admin/sports/bulk-delete', { ids });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ==================== STATISTICS & ANALYTICS ====================

  /**
   * Get sports statistics
   * @returns {Promise} Response with statistics data
   */
  getStats: async () => {
    try {
      const response = await api.get('/admin/sports/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get sports by category
   * @param {string} category - Category name
   * @returns {Promise} Response with filtered sports
   */
  getSportsByCategory: async (category) => {
    try {
      const response = await api.get('/admin/sports', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search sports
   * @param {string} query - Search query
   * @returns {Promise} Response with search results
   */
  searchSports: async (query) => {
    try {
      const response = await api.get('/admin/sports', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ==================== HELPER METHODS ====================

  /**
   * Validate sport data before submission
   * @param {Object} sportData - Sport data to validate
   * @returns {Object} Validation result { isValid, errors }
   */
  validateSportData: (sportData) => {
    const errors = {};

    // Required fields
    if (!sportData.name || sportData.name.trim() === '') {
      errors.name = 'Sport name is required';
    } else if (sportData.name.length < 2) {
      errors.name = 'Sport name must be at least 2 characters';
    } else if (sportData.name.length > 100) {
      errors.name = 'Sport name cannot exceed 100 characters';
    }

    if (!sportData.category || sportData.category.trim() === '') {
      errors.category = 'Category is required';
    }

    // Optional field validations
    if (sportData.description && sportData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }

    if (sportData.rulesLink && sportData.rulesLink.trim() !== '') {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(sportData.rulesLink)) {
        errors.rulesLink = 'Please provide a valid URL';
      }
    }

    const validCategories = ['Team Sport', 'Individual Sport', 'Water Sport', 'Combat Sport', 'Other'];
    if (sportData.category && !validCategories.includes(sportData.category)) {
      errors.category = `Category must be one of: ${validCategories.join(', ')}`;
    }

    const validPopularity = ['High', 'Medium', 'Low'];
    if (sportData.popularity && !validPopularity.includes(sportData.popularity)) {
      errors.popularity = `Popularity must be one of: ${validPopularity.join(', ')}`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Format sport data for display
   * @param {Object} sport - Sport object
   * @returns {Object} Formatted sport data
   */
  formatSportData: (sport) => {
    return {
      ...sport,
      createdAtFormatted: new Date(sport.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      updatedAtFormatted: new Date(sport.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      categoryIcon: getCategoryIcon(sport.category),
      popularityColor: getPopularityColor(sport.popularity),
      statusBadge: sport.isActive ? 'Active' : 'Inactive',
      statusColor: sport.isActive ? 'green' : 'red'
    };
  },

  /**
   * Export sports data to CSV
   * @param {Array} sports - Array of sports
   * @returns {string} CSV string
   */
  exportToCSV: (sports) => {
    const headers = ['Name', 'Category', 'Description', 'Popularity', 'Status', 'Created At'];
    const rows = sports.map(sport => [
      sport.name,
      sport.category,
      sport.description || '',
      sport.popularity,
      sport.isActive ? 'Active' : 'Inactive',
      new Date(sport.createdAt).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  },

  /**
   * Download CSV file
   * @param {Array} sports - Array of sports
   * @param {string} filename - Filename for download
   */
  downloadCSV: (sports, filename = 'sports_data.csv') => {
    const csv = adminService.exportToCSV(sports);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get icon for sport category
 * @param {string} category - Category name
 * @returns {string} Icon emoji
 */
const getCategoryIcon = (category) => {
  const icons = {
    'Team Sport': '⚽',
    'Individual Sport': '🏃',
    'Water Sport': '🏊',
    'Combat Sport': '🥊',
    'Other': '🏆'
  };
  return icons[category] || '🏆';
};

/**
 * Get color for popularity level
 * @param {string} popularity - Popularity level
 * @returns {string} Color class
 */
const getPopularityColor = (popularity) => {
  const colors = {
    'High': 'green',
    'Medium': 'yellow',
    'Low': 'gray'
  };
  return colors[popularity] || 'gray';
};

export default adminService;