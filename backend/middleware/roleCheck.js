// middleware/roleCheck.js

/**
 * Middleware to check if user has required role(s)
 * @param {...string} roles - Variable number of allowed roles
 * @returns {Function} Express middleware function
 */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please login first.' 
      });
    }

    // Flatten roles array in case someone passes an array
    const allowedRoles = roles.flat();

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      console.log(`❌ Access denied: ${req.user.name} (${req.user.role}) tried to access ${req.originalUrl}`);
      
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }

    // User has the required role
    console.log(`✅ Access granted: ${req.user.name} (${req.user.role}) → ${req.method} ${req.originalUrl}`);
    next();
  };
};

/**
 * Specific role checkers for common use cases
 */

// Admin only access
const isAdmin = (req, res, next) => {
  return roleCheck('Admin')(req, res, next);
};

// User only access
const isUser = (req, res, next) => {
  return roleCheck('User')(req, res, next);
};

// Admin or User (any authenticated user)
const isAdminOrUser = (req, res, next) => {
  return roleCheck('Admin', 'User')(req, res, next);
};

/**
 * Check if user owns the resource
 * Requires req.user and req.params.userId or req.body.userId
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }

  // Admin can access everything
  if (req.user.role === 'Admin') {
    return next();
  }

  // Check if user owns the resource
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({ 
    success: false,
    message: 'Access denied. You can only access your own resources.' 
  });
};

/**
 * Permission-based access control
 * @param {string[]} permissions - Array of required permissions
 */
const hasPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Admin has all permissions
    if (req.user.role === 'Admin') {
      return next();
    }

    // Check if user has required permissions
    // This assumes user model has a 'permissions' array field
    if (req.user.permissions) {
      const hasAllPermissions = permissions.every(permission => 
        req.user.permissions.includes(permission)
      );

      if (hasAllPermissions) {
        return next();
      }
    }

    return res.status(403).json({ 
      success: false,
      message: 'Insufficient permissions',
      requiredPermissions: permissions
    });
  };
};

/**
 * Rate limiting by role
 * Different rate limits for different roles
 */
const rateLimitByRole = {
  Admin: 1000,  // 1000 requests per hour
  User: 100,    // 100 requests per hour
  Analyst: 500  // 500 requests per hour
};

// Export all middleware
module.exports = {
  roleCheck,
  isAdmin,
  isUser,
  isAdminOrUser,
  isOwnerOrAdmin,
  hasPermissions,
  rateLimitByRole
};