// utils/constants.js

module.exports = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500
  },

  // User Roles
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
    GUEST: 'guest'
  },

  // Commentary Types
  COMMENTARY_TYPES: {
    LIVE: 'live',
    REPLAY: 'replay',
    HIGHLIGHT: 'highlight',
    ANALYSIS: 'analysis'
  },

  // Voice Options
  VOICE_OPTIONS: {
    DEFAULT: 'default',
    MALE: 'male',
    FEMALE: 'female',
    EXCITED: 'excited',
    CALM: 'calm'
  },

  // Languages
  LANGUAGES: {
    ENGLISH: 'en-US',
    SPANISH: 'es-ES',
    FRENCH: 'fr-FR',
    GERMAN: 'de-DE',
    ITALIAN: 'it-IT'
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 300,      // 5 minutes
    MEDIUM: 1800,    // 30 minutes
    LONG: 3600,      // 1 hour
    VERY_LONG: 86400 // 24 hours
  },

  // Rate Limits
  RATE_LIMITS: {
    DEFAULT: 100,
    AUTH: 5,
    API: 1000
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    ALLOWED_EXTENSIONS: ['.mp3', '.wav', '.ogg']
  },

  // Error Messages
  ERRORS: {
    INTERNAL_SERVER: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials'
  },

  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Data fetched successfully'
  }
};