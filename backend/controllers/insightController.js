const ResponseHandler = require('../utils/responseHandler');
const Insight = require('../models/Insight');

// @desc    Generate AI insights
// @route   POST /api/insights/generate
// @access  Private
exports.generateInsights = async (req, res) => {
  try {
    const { matchId, category, context } = req.body;

    // Validate input
    if (!matchId) {
      return ResponseHandler.badRequest(res, 'Match ID is required');
    }

    // Generate insights using AI (mock for now)
    const insights = await generateAIInsights(matchId, category, context);

    // Save to database
    const savedInsights = await Insight.insertMany(insights);

    ResponseHandler.success(res, savedInsights, 'Insights generated successfully');
  } catch (error) {
    console.error('Error generating insights:', error);
    ResponseHandler.error(res, 'Failed to generate insights', 500);
  }
};

// @desc    Get insights for a match
// @route   GET /api/insights/:matchId
// @access  Public
exports.getInsights = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { priority, category, limit = 10 } = req.query;

    const filter = { matchId };
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const insights = await Insight.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    ResponseHandler.success(res, insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    ResponseHandler.error(res, 'Failed to fetch insights', 500);
  }
};

// @desc    Update insight feedback
// @route   PUT /api/insights/:insightId/feedback
// @access  Private
exports.updateFeedback = async (req, res) => {
  try {
    const { insightId } = req.params;
    const { helpful, applied, rating } = req.body;

    const insight = await Insight.findByIdAndUpdate(
      insightId,
      {
        $inc: { 
          'feedback.helpfulCount': helpful ? 1 : 0,
          'feedback.appliedCount': applied ? 1 : 0
        },
        $push: { 'feedback.ratings': rating }
      },
      { new: true }
    );

    if (!insight) {
      return ResponseHandler.notFound(res, 'Insight not found');
    }

    ResponseHandler.success(res, insight, 'Feedback recorded');
  } catch (error) {
    console.error('Error updating feedback:', error);
    ResponseHandler.error(res, 'Failed to update feedback', 500);
  }
};

// Helper function to generate AI insights (mock)
async function generateAIInsights(matchId, category, context) {
  // This would call your AI service in production
  return [
    {
      matchId,
      priority: 'high',
      category: category || 'Strategic',
      title: 'Tactical Advantage Detected',
      description: 'Analysis shows exploitable weakness in opponent defense on the right flank.',
      confidence: 89,
      impact: 'High',
      actionable: true,
      recommendations: [
        'Increase attacking pressure on the right side',
        'Target defender #7 who shows signs of fatigue',
        'Exploit space between midfielder and fullback'
      ],
      dataPoints: [
        'Shot success rate: 68% on right side',
        'Defender positioning error rate: 23%',
        'Historical pattern match: 87%'
      ],
      source: 'Tactical AI Engine'
    }
  ];
}

module.exports = exports;