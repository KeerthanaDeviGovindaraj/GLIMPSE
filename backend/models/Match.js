const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  league: String,
  home: {
    name: { type: String, required: true },
    score: mongoose.Schema.Types.Mixed,
    logo: String
  },
  away: {
    name: { type: String, required: true },
    score: mongoose.Schema.Types.Mixed,
    logo: String
  },
  status: { type: String, enum: ['Upcoming', 'Live', 'Completed'], default: 'Upcoming' },
  minute: Number,
  quarter: String,
  over: String,
  set: String,
  possession: { home: Number, away: Number },
  stats: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);