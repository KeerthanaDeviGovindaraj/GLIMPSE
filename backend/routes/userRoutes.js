const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

// Apply rate limiting
router.use(apiLimiter);

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);
router.put('/preferences', auth, userController.updatePreferences);
router.get('/stats', auth, userController.getUserStats);
router.delete('/account', auth, userController.deleteAccount);

// Admin routes
router.get('/', auth, userController.getAllUsers);
router.put('/:userId/role', auth, userController.updateUserRole);
router.put('/:userId/ban', auth, userController.toggleUserBan);

module.exports = router;