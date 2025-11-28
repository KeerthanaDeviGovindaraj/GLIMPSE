const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return ResponseHandler.badRequest(res, 'Please provide all required fields');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return ResponseHandler.badRequest(
        res, 
        existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return ResponseHandler.badRequest(res, 'Password must be at least 6 characters');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Generate token
    const token = generateToken(user._id);

    ResponseHandler.created(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    ResponseHandler.error(res, 'Registration failed', 500);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return ResponseHandler.badRequest(res, 'Please provide email and password');
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    ResponseHandler.success(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    ResponseHandler.error(res, 'Login failed', 500);
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('preferences');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    ResponseHandler.success(res, user);

  } catch (error) {
    console.error('Get profile error:', error);
    ResponseHandler.error(res, 'Failed to fetch profile', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, avatar, bio } = req.body;
    const userId = req.user.id;

    // Check if username or email is already taken by another user
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return ResponseHandler.badRequest(
          res,
          existingUser.username === username
            ? 'Username already taken'
            : 'Email already in use'
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatar && { avatar }),
        ...(bio !== undefined && { bio })
      },
      { new: true, runValidators: true }
    ).select('-password');

    ResponseHandler.success(res, updatedUser, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    ResponseHandler.error(res, 'Failed to update profile', 500);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return ResponseHandler.badRequest(res, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return ResponseHandler.badRequest(res, 'New password must be at least 6 characters');
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return ResponseHandler.unauthorized(res, 'Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    ResponseHandler.success(res, null, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    ResponseHandler.error(res, 'Failed to change password', 500);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { theme, language, notifications, defaultSport, autoGenerateInterval } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(theme && { 'preferences.theme': theme }),
          ...(language && { 'preferences.language': language }),
          ...(notifications !== undefined && { 'preferences.notifications': notifications }),
          ...(defaultSport && { 'preferences.defaultSport': defaultSport }),
          ...(autoGenerateInterval && { 'preferences.autoGenerateInterval': autoGenerateInterval })
        }
      },
      { new: true }
    ).select('-password');

    ResponseHandler.success(res, user, 'Preferences updated successfully');

  } catch (error) {
    console.error('Update preferences error:', error);
    ResponseHandler.error(res, 'Failed to update preferences', 500);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // This would fetch from various collections
    const stats = {
      totalCommentaryGenerated: 150,
      totalPredictions: 75,
      bookmarkedInsights: 12,
      favoriteMatches: 8,
      hoursActive: 24.5,
      accuracyRate: 87.3
    };

    ResponseHandler.success(res, stats);

  } catch (error) {
    console.error('Get stats error:', error);
    ResponseHandler.error(res, 'Failed to fetch statistics', 500);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return ResponseHandler.badRequest(res, 'Please provide your password to confirm deletion');
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ResponseHandler.unauthorized(res, 'Invalid password');
    }

    // Soft delete (mark as deleted instead of removing)
    user.isActive = false;
    user.deletedAt = new Date();
    await user.save();

    // Or hard delete:
    // await User.findByIdAndDelete(userId);

    ResponseHandler.success(res, null, 'Account deleted successfully');

  } catch (error) {
    console.error('Delete account error:', error);
    ResponseHandler.error(res, 'Failed to delete account', 500);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const filter = { isActive: true };
    
    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(filter);

    ResponseHandler.success(res, {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });

  } catch (error) {
    console.error('Get all users error:', error);
    ResponseHandler.error(res, 'Failed to fetch users', 500);
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/users/:userId/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'analyst', 'admin'].includes(role)) {
      return ResponseHandler.badRequest(res, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    ResponseHandler.success(res, user, 'User role updated successfully');

  } catch (error) {
    console.error('Update role error:', error);
    ResponseHandler.error(res, 'Failed to update user role', 500);
  }
};

// @desc    Ban/Unban user (admin only)
// @route   PUT /api/users/:userId/ban
// @access  Private/Admin
exports.toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { banned, reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: !banned,
        ...(banned && { banReason: reason })
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    ResponseHandler.success(
      res, 
      user, 
      banned ? 'User banned successfully' : 'User unbanned successfully'
    );

  } catch (error) {
    console.error('Toggle ban error:', error);
    ResponseHandler.error(res, 'Failed to update user status', 500);
  }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = exports;