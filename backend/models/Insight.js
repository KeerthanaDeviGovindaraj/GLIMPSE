const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  category: {
    type: String,
    enum: ['Strategic', 'Performance', 'Tactical', 'Physical', 'Momentum'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  impact: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  actionable: {
    type: Boolean,
    default: false
  },
  recommendations: [{
    type: String
  }],
  dataPoints: [{
    type: String
  }],
  source: {
    type: String,
    required: true
  },
  feedback: {
    helpfulCount: {
      type: Number,
      default: 0
    },
    appliedCount: {
      type: Number,
      default: 0
    },
    ratings: [{
      type: Number,
      min: 1,
      max: 5
    }]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
insightSchema.index({ matchId: 1, priority: 1 });
insightSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Insight', insightSchema);