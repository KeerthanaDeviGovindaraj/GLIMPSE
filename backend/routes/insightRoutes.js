const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const auth = require('../middleware/auth');
const { apiLimiter, aiLimiter } = require('../middleware/rateLimit');

// Apply rate limiting to all routes
router.use(apiLimiter);

// @route   POST /api/insights/generate
router.post('/generate', auth, aiLimiter, insightsController.generateInsights);

// @route   GET /api/insights/:matchId
router.get('/:matchId', insightsController.getInsights);

// @route   PUT /api/insights/:insightId/feedback
router.put('/:insightId/feedback', auth, insightsController.updateFeedback);

module.exports = router;