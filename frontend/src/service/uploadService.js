// service/uploadService.js
import api, { handleApiError } from './api';

const uploadService = {
  // ==================== FILE UPLOAD OPERATIONS ====================

  /**
   * Upload file to server
   * @param {File} file - File object to upload
   * @param {string} uploadedBy - Name of uploader
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise} Response with upload data
   */
  uploadFile: async (file, uploadedBy = null, onProgress = null) => {
    try {
      // Validate file before upload
      const validation = uploadService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      if (uploadedBy) {
        formData.append('uploadedBy', uploadedBy);
      }

      // Upload with progress tracking
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload multiple files
   * @param {FileList|Array} files - Files to upload
   * @param {string} uploadedBy - Name of uploader
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Array>} Array of upload results
   */
  uploadMultipleFiles: async (files, uploadedBy = null, onProgress = null) => {
    try {
      const uploadPromises = Array.from(files).map((file, index) => {
        return uploadService.uploadFile(file, uploadedBy, (percent) => {
          if (onProgress) {
            onProgress(index, percent);
          }
        });
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all uploads with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {string} params.uploadedBy - Filter by uploader
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with uploads list
   */
  getAllUploads: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/upload${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single upload by ID
   * @param {string} id - Upload ID
   * @returns {Promise} Response with upload data
   */
  getUploadById: async (id) => {
    try {
      const response = await api.get(`/upload/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Download file by upload ID
   * @param {string} id - Upload ID
   * @param {string} filename - Desired filename for download
   * @returns {Promise} Download initiated
   */
  downloadFile: async (id, filename = 'download') => {
    try {
      const response = await api.get(`/upload/${id}/download`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Download started' };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Preview CSV file contents
   * @param {string} id - Upload ID
   * @param {number} limit - Number of rows to preview (default: 10)
   * @returns {Promise} Response with preview data
   */
  previewFile: async (id, limit = 10) => {
    try {
      const response = await api.get(`/upload/${id}/preview`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update upload status
   * @param {string} id - Upload ID
   * @param {Object} statusData - Status update data
   * @param {string} statusData.status - New status (pending|processed|failed)
   * @param {number} statusData.recordsCount - Number of records processed
   * @param {string} statusData.errorMessage - Error message if failed
   * @returns {Promise} Response with updated upload
   */
  updateUploadStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/upload/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete upload by ID
   * @param {string} id - Upload ID
   * @returns {Promise} Response with success message
   */
  deleteUpload: async (id) => {
    try {
      const response = await api.delete(`/upload/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Bulk delete uploads
   * @param {Array<string>} ids - Array of upload IDs to delete
   * @returns {Promise} Response with deleted count
   */
  bulkDeleteUploads: async (ids) => {
    try {
      const response = await api.post('/upload/bulk-delete', { ids });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get upload statistics
   * @returns {Promise} Response with statistics
   */
  getUploadStats: async () => {
    try {
      const response = await api.get('/upload/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ==================== FILE VALIDATION ====================

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result { isValid, error }
   */
  validateFile: (file) => {
    // Check if file exists
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${uploadService.formatFileSize(maxSize)}`
      };
    }

    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/plain'
    ];

    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
      };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validate multiple files
   * @param {FileList|Array} files - Files to validate
   * @returns {Object} Validation result { isValid, errors }
   */
  validateMultipleFiles: (files) => {
    const errors = [];
    const validFiles = [];

    Array.from(files).forEach((file, index) => {
      const validation = uploadService.validateFile(file);
      if (!validation.isValid) {
        errors.push({ index, filename: file.name, error: validation.error });
      } else {
        validFiles.push(file);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validFiles
    };
  },

  // ==================== HELPER METHODS ====================

  /**
   * Format file size to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get file extension
   * @param {string} filename - Filename
   * @returns {string} File extension
   */
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  },

  /**
   * Get file icon based on type
   * @param {string} filename - Filename or mimetype
   * @returns {string} Icon emoji
   */
  getFileIcon: (filename) => {
    const ext = uploadService.getFileExtension(filename);
    const icons = {
      'csv': '📊',
      'xlsx': '📗',
      'xls': '📗',
      'json': '📄',
      'txt': '📝'
    };
    return icons[ext] || '📁';
  },

  /**
   * Format upload data for display
   * @param {Object} upload - Upload object
   * @returns {Object} Formatted upload data
   */
  formatUploadData: (upload) => {
    return {
      ...upload,
      sizeFormatted: uploadService.formatFileSize(upload.size),
      uploadedAtFormatted: new Date(upload.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      fileIcon: uploadService.getFileIcon(upload.originalName),
      fileExtension: uploadService.getFileExtension(upload.originalName),
      statusColor: getStatusColor(upload.status),
      statusIcon: getStatusIcon(upload.status)
    };
  },

  /**
   * Parse CSV file on client side
   * @param {File} file - CSV file
   * @returns {Promise<Array>} Parsed CSV data
   */
  parseCSV: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const rows = text.split('\n');
          const headers = rows[0].split(',').map(h => h.trim());
          
          const data = rows.slice(1)
            .filter(row => row.trim() !== '')
            .map(row => {
              const values = row.split(',').map(v => v.trim());
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            });

          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  },

  /**
   * Convert upload data to CSV
   * @param {Array} uploads - Array of uploads
   * @returns {string} CSV string
   */
  exportUploadsToCSV: (uploads) => {
    const headers = ['Filename', 'Size', 'Type', 'Uploaded By', 'Status', 'Date'];
    const rows = uploads.map(upload => [
      upload.originalName,
      uploadService.formatFileSize(upload.size),
      upload.mimetype,
      upload.uploadedBy,
      upload.status,
      new Date(upload.createdAt).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get color for upload status
 * @param {string} status - Upload status
 * @returns {string} Color class
 */
const getStatusColor = (status) => {
  const colors = {
    'pending': 'yellow',
    'processed': 'green',
    'failed': 'red'
  };
  return colors[status] || 'gray';
};

/**
 * Get icon for upload status
 * @param {string} status - Upload status
 * @returns {string} Icon emoji
 */
const getStatusIcon = (status) => {
  const icons = {
    'pending': '⏳',
    'processed': '✅',
    'failed': '❌'
  };
  return icons[status] || '📄';
};

export default uploadService;