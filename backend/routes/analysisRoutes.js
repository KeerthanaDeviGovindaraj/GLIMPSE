const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

router.post('/generate', analysisController.generateAnalysis);
router.get('/match/:matchId', analysisController.getMatchAnalysis);

module.exports = router;