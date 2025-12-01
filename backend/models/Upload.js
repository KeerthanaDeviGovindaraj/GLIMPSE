const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  recordCount: {
    type: Number,
    default: 0,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  processedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

uploadSchema.index({ uploadedBy: 1, uploadDate: -1 });

module.exports = mongoose.model('Upload', uploadSchema);