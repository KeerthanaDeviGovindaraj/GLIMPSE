const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.post('/generate', predictionController.generatePrediction);
router.get('/match/:matchId', predictionController.getMatchPredictions);

module.exports = router;