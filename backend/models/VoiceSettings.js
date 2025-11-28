const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  voice: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    min: 0.1,
    max: 2.0,
    default: 1.0
  },
  pitch: {
    type: Number,
    min: 0,
    max: 2.0,
    default: 1.0
  },
  volume: {
    type: Number,
    min: 0,
    max: 1.0,
    default: 1.0
  },
  language: {
    type: String,
    default: 'en-US'
  }
}, { _id: true });

const voiceSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  voice: {
    type: String,
    enum: ['professional', 'enthusiastic', 'analytical', 'casual'],
    default: 'professional'
  },
  rate: {
    type: Number,
    min: 0.1,
    max: 2.0,
    default: 0.95
  },
  pitch: {
    type: Number,
    min: 0,
    max: 2.0,
    default: 0.95
  },
  volume: {
    type: Number,
    min: 0,
    max: 1.0,
    default: 0.95
  },
  language: {
    type: String,
    default: 'en-US'
  },
  autoSpeak: {
    type: Boolean,
    default: false
  },
  customPresets: [presetSchema],
  usageStats: {
    totalSynthesized: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    lastUsed: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes
voiceSettingsSchema.index({ userId: 1 });

// Method to increment usage
voiceSettingsSchema.methods.recordUsage = async function(duration) {
  this.usageStats.totalSynthesized += 1;
  this.usageStats.totalDuration += duration;
  this.usageStats.lastUsed = new Date();
  return await this.save();
};

module.exports = mongoose.model('VoiceSettings', voiceSettingsSchema);