const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const auth = require('../middleware/auth');
const { apiLimiter, aiLimiter } = require('../middleware/rateLimit');

// Apply rate limiting
router.use(apiLimiter);

// Public routes
router.get('/available', voiceController.getAvailableVoices);

// Protected routes
router.get('/settings', auth, voiceController.getVoiceSettings);
router.put('/settings', auth, voiceController.updateVoiceSettings);
router.post('/test', auth, voiceController.testVoice);
router.post('/synthesize', auth, aiLimiter, voiceController.synthesizeText);
router.get('/stats', auth, voiceController.getVoiceStats);
router.put('/auto-speak', auth, voiceController.toggleAutoSpeak);

// Presets
router.post('/presets', auth, voiceController.savePreset);
router.delete('/presets/:presetId', auth, voiceController.deletePreset);
router.put('/presets/:presetId/apply', auth, voiceController.applyPreset);

module.exports = router;