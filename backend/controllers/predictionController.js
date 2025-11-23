const Prediction = require('../models/Prediction');
const llmService = require('../services/llmService');

exports.generatePrediction = async (req, res) => {
  try {
    const { matchId } = req.body;

    console.log('🎯 Generating prediction...');
    const { text, confidence } = await llmService.generatePrediction(`Match ${matchId}`);
    console.log('✅ Prediction confidence:', confidence + '%');

    const prediction = new Prediction({
      matchId,
      text,
      confidence,
      predictionType: 'outcome'
    });

    await prediction.save();

    res.status(201).json({
      success: true,
      data: prediction
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMatchPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ matchId: req.params.matchId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;