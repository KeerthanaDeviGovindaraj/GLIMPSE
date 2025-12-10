// utils/validator.js

class Validator {
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isNotEmpty(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }

  static isLength(value, min, max) {
    const length = value ? value.toString().length : 0;
    return length >= min && length <= max;
  }

  static isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isAlphanumeric(value) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
  }

  static isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  static isInRange(value, min, max) {
    const num = parseFloat(value);
    return num >= min && num <= max;
  }

  static isArray(value) {
    return Array.isArray(value);
  }

  static isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  static matchesPattern(value, pattern) {
    return pattern.test(value);
  }

  static validateCommentaryData(data) {
    const errors = [];

    if (!this.isNotEmpty(data.text)) {
      errors.push('Commentary text is required');
    }

    if (data.text && !this.isLength(data.text, 10, 5000)) {
      errors.push('Commentary text must be between 10 and 5000 characters');
    }

    if (data.duration && !this.isNumeric(data.duration)) {
      errors.push('Duration must be a number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitize(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .trim();
  }
}

module.exports = Validator;