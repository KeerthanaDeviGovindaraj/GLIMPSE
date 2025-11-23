const Commentary = require('../models/Commentary');
const llmService = require('../services/llmService');

function detectType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('goal')) return 'goal';
  if (lower.includes('save')) return 'save';
  if (lower.includes('foul')) return 'foul';
  return 'general';
}

function detectSentiment(text) {
  const lower = text.toLowerCase();
  if (lower.includes('goal') || lower.includes('brilliant')) return 'exciting';
  if (lower.includes('miss')) return 'disappointing';
  return 'neutral';
}

exports.generateCommentary = async (req, res) => {
  try {
    const { matchId, customPrompt } = req.body;

    const matchContext = `Match ${matchId}`;
    
    console.log('🎙️ Generating commentary...');
    const text = await llmService.generateCommentary(matchContext, customPrompt);
    console.log('✅ Generated:', text.substring(0, 50) + '...');

    const commentary = new Commentary({
      matchId,
      minute: Math.floor(Math.random() * 90) + 1,
      text,
      type: detectType(text),
      sentiment: detectSentiment(text),
      generatedBy: 'AI'
    });

    await commentary.save();

    res.status(201).json({
      success: true,
      data: commentary
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMatchCommentary = async (req, res) => {
  try {
    const commentary = await Commentary.find({ matchId: req.params.matchId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: commentary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCommentary = async (req, res) => {
  try {
    await Commentary.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;