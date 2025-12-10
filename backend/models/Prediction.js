const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  text: { type: String, required: true },
  confidence: { type: Number, min: 0, max: 100, required: true },
  predictionType: { type: String, default: 'outcome' }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);