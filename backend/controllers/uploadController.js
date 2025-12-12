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
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      uploadedBy: req.user?._id || req.user?.userId,
      status: 'pending'
    });

    await upload.save();

    console.log(`✅ File uploaded: ${req.file.originalname} by ${req.user?.name || 'User'}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: upload._id,
        filename: upload.originalName,
        size: upload.fileSize,
        mimetype: upload.fileType,
        uploadedBy: upload.uploadedBy,
        uploadedAt: upload.uploadDate,
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
 * @desc    Get upload history
 * @route   GET /api/upload/history
 * @access  Private (authenticated users)
 */
exports.getUploadHistory = async (req, res) => {
  try {
    const { status, uploadedBy, sort = '-uploadDate', limit, page = 1, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (uploadedBy) {
      filter.uploadedBy = uploadedBy;
    }

    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const uploads = await Upload.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .populate('uploadedBy', 'name email');

    const total = await Upload.countDocuments(filter);

    // Format response with readable file sizes
    const formattedUploads = uploads.map(upload => ({
      ...upload.toObject(),
      sizeFormatted: formatFileSize(upload.fileSize),
      uploadedAtFormatted: formatDate(upload.uploadDate)
    }));

    res.json({
      success: true,
      count: uploads.length,
      total: total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: formattedUploads
    });
    
  } catch (error) {
    console.error('Get upload history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching upload history', 
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
    if (fs.existsSync(upload.filePath)) {
      try {
        fs.unlinkSync(upload.filePath);
        console.log(`🗑️  Deleted file: ${upload.filePath}`);
      } catch (fileError) {
        console.error('Error deleting file from disk:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    } else {
      console.log(`⚠️  File not found on disk: ${upload.filePath}`);
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
 * @desc    Preview upload data
 * @route   GET /api/upload/preview/:id
 * @access  Private (authenticated users)
 */
exports.previewUpload = async (req, res) => {
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
    if (!fs.existsSync(upload.filePath)) {
      return res.status(404).json({ 
        success: false,
        message: 'File not found on server' 
      });
    }

    // Only support preview for CSV files
    if (!upload.fileType.includes('csv') && !upload.originalName.toLowerCase().endsWith('.csv')) {
      return res.status(400).json({ 
        success: false,
        message: 'Preview is only available for CSV files' 
      });
    }

    // Read CSV file
    const results = [];
    const limitNumber = parseInt(limit, 10);

    fs.createReadStream(upload.filePath)
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
            totalSize: formatFileSize(upload.fileSize),
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
 * @desc    Process uploaded data
 * @route   POST /api/upload/process
 * @access  Private (authenticated users)
 */
exports.processUploadedData = async (req, res) => {
  try {
    const { uploadId } = req.body;

    if (!uploadId) {
      return res.status(400).json({
        success: false,
        message: 'Upload ID is required'
      });
    }

    const upload = await Upload.findById(uploadId);

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(upload.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Update status to processing
    upload.status = 'processing';
    await upload.save();

    // Process CSV file
    const results = [];
    
    fs.createReadStream(upload.filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          // Update upload with processed data
          upload.status = 'completed';
          upload.recordCount = results.length;
          upload.processedData = results;
          await upload.save();

          console.log(`✅ Processed ${results.length} records from ${upload.originalName}`);

          res.json({
            success: true,
            message: 'Data processed successfully',
            data: {
              uploadId: upload._id,
              recordCount: results.length,
              status: upload.status,
              preview: results.slice(0, 5) // Send first 5 records as preview
            }
          });
        } catch (saveError) {
          console.error('Error saving processed data:', saveError);
          upload.status = 'failed';
          upload.errorMessage = saveError.message;
          await upload.save();

          res.status(500).json({
            success: false,
            message: 'Error saving processed data',
            error: saveError.message
          });
        }
      })
      .on('error', async (error) => {
        console.error('CSV processing error:', error);
        
        upload.status = 'failed';
        upload.errorMessage = error.message;
        await upload.save();

        res.status(500).json({
          success: false,
          message: 'Error processing CSV file',
          error: error.message
        });
      });

  } catch (error) {
    console.error('Process uploaded data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing uploaded data',
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