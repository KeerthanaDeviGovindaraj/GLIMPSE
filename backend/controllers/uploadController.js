// controllers/uploadController.js
const Upload = require('../models/Upload');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * @desc    Upload file
 * @route   POST /api/upload
 * @access  Private (authenticated users)
 */
exports.uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded. Please select a file.' 
      });
    }

    // Validate file size (already handled by multer, but double-check)
    const maxSize = process.env.MAX_FILE_SIZE || 10485760; // 10MB default
    if (req.file.size > maxSize) {
      // Delete the uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        success: false,
        message: `File size exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB` 
      });
    }

    // Create upload record in database
    const upload = new Upload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user?.name || req.body.uploadedBy || 'Anonymous',
      status: 'pending'
    });

    await upload.save();

    console.log(`✅ File uploaded: ${req.file.originalname} by ${upload.uploadedBy}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: upload._id,
        filename: upload.originalName,
        size: upload.size,
        mimetype: upload.mimetype,
        uploadedBy: upload.uploadedBy,
        uploadedAt: upload.createdAt,
        status: upload.status
      }
    });
    
  } catch (error) {
    console.error('Upload file error:', error);
    
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️  Cleaned up file after database error');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error uploading file', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all uploads with filtering
 * @route   GET /api/upload
 * @access  Private (authenticated users)
 */
exports.getAllUploads = async (req, res) => {
  try {
    const { status, uploadedBy, sort = '-createdAt', limit, page = 1, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (uploadedBy) {
      filter.uploadedBy = { $regex: uploadedBy, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { filename: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10) || 0;
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    let query = Upload.find(filter).sort(sort);
    
    if (limitNumber > 0) {
      query = query.skip(skip).limit(limitNumber);
    }

    const uploads = await query;
    const total = await Upload.countDocuments(filter);

    // Format response with readable file sizes
    const formattedUploads = uploads.map(upload => ({
      ...upload.toObject(),
      sizeFormatted: formatFileSize(upload.size),
      uploadedAtFormatted: formatDate(upload.createdAt)
    }));

    res.json({
      success: true,
      count: uploads.length,
      total: total,
      page: pageNumber,
      pages: limitNumber > 0 ? Math.ceil(total / limitNumber) : 1,
      data: formattedUploads
    });
    
  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching uploads', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get single upload by ID
 * @route   GET /api/upload/:id
 * @access  Private (authenticated users)
 */
exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found' 
      });
    }

    // Check if file still exists on disk
    const fileExists = fs.existsSync(upload.path);

    res.json({
      success: true,
      data: {
        ...upload.toObject(),
        sizeFormatted: formatFileSize(upload.size),
        uploadedAtFormatted: formatDate(upload.createdAt),
        fileExists: fileExists
      }
    });
    
  } catch (error) {
    console.error('Get upload error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found - Invalid ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error fetching upload', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete upload and associated file
 * @route   DELETE /api/upload/:id
 * @access  Private (authenticated users)
 */
exports.deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found' 
      });
    }

    // Delete physical file from disk
    if (fs.existsSync(upload.path)) {
      try {
        fs.unlinkSync(upload.path);
        console.log(`🗑️  Deleted file: ${upload.path}`);
      } catch (fileError) {
        console.error('Error deleting file from disk:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    } else {
      console.log(`⚠️  File not found on disk: ${upload.path}`);
    }

    // Delete database record
    await Upload.findByIdAndDelete(req.params.id);

    console.log(`✅ Upload deleted: ${upload.originalName} by ${req.user?.name || 'User'}`);

    res.json({
      success: true,
      message: 'Upload deleted successfully',
      data: {
        id: upload._id,
        filename: upload.originalName
      }
    });
    
  } catch (error) {
    console.error('Delete upload error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found - Invalid ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error deleting upload', 
      error: error.message 
    });
  }
};

/**
 * @desc    Download file
 * @route   GET /api/upload/:id/download
 * @access  Private (authenticated users)
 */
exports.downloadFile = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found' 
      });
    }

    // Check if file exists on disk
    if (!fs.existsSync(upload.path)) {
      return res.status(404).json({ 
        success: false,
        message: 'File not found on server. It may have been deleted.' 
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${upload.originalName}"`);
    res.setHeader('Content-Length', upload.size);

    // Stream file to response
    const fileStream = fs.createReadStream(upload.path);
    fileStream.pipe(res);

    console.log(`📥 File downloaded: ${upload.originalName} by ${req.user?.name || 'User'}`);
    
  } catch (error) {
    console.error('Download file error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found - Invalid ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error downloading file', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update upload status and metadata
 * @route   PUT /api/upload/:id/status
 * @access  Private (authenticated users)
 */
exports.updateUploadStatus = async (req, res) => {
  try {
    const { status, recordsCount, errorMessage } = req.body;
    
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found' 
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'processed', 'failed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }
      upload.status = status;
    }

    if (recordsCount !== undefined) {
      upload.recordsCount = parseInt(recordsCount, 10);
    }

    if (errorMessage !== undefined) {
      upload.errorMessage = errorMessage;
    }

    await upload.save();

    console.log(`✅ Upload status updated: ${upload.originalName} -> ${upload.status}`);

    res.json({
      success: true,
      message: 'Upload status updated successfully',
      data: upload
    });
    
  } catch (error) {
    console.error('Update status error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found - Invalid ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error updating upload status', 
      error: error.message 
    });
  }
};

/**
 * @desc    Preview CSV file contents
 * @route   GET /api/upload/:id/preview
 * @access  Private (authenticated users)
 */
exports.previewFile = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ 
        success: false,
        message: 'Upload not found' 
      });
    }

    // Check if file exists
    if (!fs.existsSync(upload.path)) {
      return res.status(404).json({ 
        success: false,
        message: 'File not found on server' 
      });
    }

    // Only support preview for CSV files
    if (!upload.mimetype.includes('csv') && !upload.originalName.toLowerCase().endsWith('.csv')) {
      return res.status(400).json({ 
        success: false,
        message: 'Preview is only available for CSV files' 
      });
    }

    // Read CSV file
    const results = [];
    const limitNumber = parseInt(limit, 10);

    fs.createReadStream(upload.path)
      .pipe(csv())
      .on('data', (data) => {
        if (results.length < limitNumber) {
          results.push(data);
        }
      })
      .on('end', () => {
        res.json({
          success: true,
          data: {
            filename: upload.originalName,
            previewRows: results.length,
            totalSize: formatFileSize(upload.size),
            rows: results
          }
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ 
          success: false,
          message: 'Error parsing CSV file', 
          error: error.message 
        });
      });
    
  } catch (error) {
    console.error('Preview file error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error previewing file', 
      error: error.message 
    });
  }
};

/**
 * @desc    Bulk delete uploads
 * @route   POST /api/upload/bulk-delete
 * @access  Private (authenticated users)
 */
exports.bulkDeleteUploads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide an array of upload IDs to delete' 
      });
    }

    // Find all uploads
    const uploads = await Upload.find({ _id: { $in: ids } });

    // Delete physical files
    let filesDeleted = 0;
    uploads.forEach(upload => {
      if (fs.existsSync(upload.path)) {
        try {
          fs.unlinkSync(upload.path);
          filesDeleted++;
        } catch (error) {
          console.error(`Error deleting file ${upload.path}:`, error);
        }
      }
    });

    // Delete database records
    const result = await Upload.deleteMany({ _id: { $in: ids } });

    console.log(`✅ Bulk deleted ${result.deletedCount} uploads, ${filesDeleted} files by ${req.user?.name || 'User'}`);

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} upload(s)`,
      data: {
        deletedCount: result.deletedCount,
        filesDeleted: filesDeleted
      }
    });
    
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting uploads', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get upload statistics
 * @route   GET /api/upload/stats
 * @access  Private (authenticated users)
 */
exports.getUploadStats = async (req, res) => {
  try {
    const totalUploads = await Upload.countDocuments();
    const pendingUploads = await Upload.countDocuments({ status: 'pending' });
    const processedUploads = await Upload.countDocuments({ status: 'processed' });
    const failedUploads = await Upload.countDocuments({ status: 'failed' });

    // Total storage used
    const storageStats = await Upload.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$size' }
        }
      }
    ]);

    const totalStorage = storageStats.length > 0 ? storageStats[0].totalSize : 0;

    // Uploads by user
    const byUser = await Upload.aggregate([
      {
        $group: {
          _id: '$uploadedBy',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Uploads by file type
    const byMimeType = await Upload.aggregate([
      {
        $group: {
          _id: '$mimetype',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent uploads
    const recentUploads = await Upload.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName uploadedBy status createdAt size');

    res.json({
      success: true,
      data: {
        overview: {
          totalUploads,
          pendingUploads,
          processedUploads,
          failedUploads,
          totalStorage: formatFileSize(totalStorage),
          totalStorageBytes: totalStorage
        },
        byUser: byUser.map(u => ({
          user: u._id,
          count: u.count,
          totalSize: formatFileSize(u.totalSize)
        })),
        byMimeType: byMimeType.map(m => ({
          mimeType: m._id,
          count: m.count
        })),
        recentUploads: recentUploads.map(u => ({
          ...u.toObject(),
          sizeFormatted: formatFileSize(u.size)
        }))
      }
    });
    
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching upload statistics', 
      error: error.message 
    });
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to readable format
 */
function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
}