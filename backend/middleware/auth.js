const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ResponseHandler.unauthorized(res, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return ResponseHandler.unauthorized(res, 'User not found');
    }

    if (!req.user.isActive) {
      return ResponseHandler.forbidden(res, 'Account has been deactivated');
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return ResponseHandler.unauthorized(res, 'Not authorized to access this route');
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ResponseHandler.forbidden(
        res,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

// Export as default for compatibility
module.exports = exports.protect;
module.exports.authorize = exports.authorize;