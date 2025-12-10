const mongoose = require('mongoose');

const commentarySchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  minute: { type: Number, required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['goal', 'save', 'foul', 'setpiece', 'sub', 'general'], default: 'general' },
  sentiment: { type: String, enum: ['exciting', 'disappointing', 'neutral'], default: 'neutral' },
  generatedBy: { type: String, enum: ['AI', 'Manual'], default: 'AI' }
}, { timestamps: true });

module.exports = mongoose.model('Commentary', commentarySchema);