const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  text: { type: String, required: true },
  analysisType: { type: String, required: true },
  keyInsights: [String]
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);