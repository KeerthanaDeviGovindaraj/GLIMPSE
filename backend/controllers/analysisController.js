const Analysis = require('../models/Analysis');
const llmService = require('../services/llmService');

exports.generateAnalysis = async (req, res) => {
  try {
    const { matchId, analysisType = 'tactical' } = req.body;

    console.log('🧠 Generating analysis...');
    const text = await llmService.generateAnalysis(`Match ${matchId}`, analysisType);
    console.log('✅ Analysis generated');

    const analysis = new Analysis({
      matchId,
      text,
      analysisType,
      keyInsights: []
    });

    await analysis.save();

    res.status(201).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMatchAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.find({ matchId: req.params.matchId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;