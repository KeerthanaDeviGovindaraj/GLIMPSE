// backend/controllers/matchController.js
const Match = require('../models/Match');

// Get all live matches
exports.getLiveMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: 'Live' })
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });

  } catch (error) {
    console.error('Get live matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live matches'
    });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });

  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch match'
    });
  }
};

// Create match (Admin/Analyst only)
exports.createMatch = async (req, res) => {
  try {
    const matchData = req.body;
    matchData.createdBy = req.user._id;

    const match = new Match(matchData);
    await match.save();

    res.status(201).json({
      success: true,
      data: match
    });

  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create match'
    });
  }
};

// Update match (Admin/Analyst only)
exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const match = await Match.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });

  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update match'
    });
  }
};

module.exports = exports;