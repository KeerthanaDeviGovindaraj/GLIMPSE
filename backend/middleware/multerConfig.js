// middleware/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created uploads directory: ${uploadDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: upload-timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with dash
      .toLowerCase();
    
    const filename = `upload-${uniqueSuffix}-${nameWithoutExt}${ext}`;
    cb(null, filename);
  }
});

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimeTypes = [
    'text/csv',                                                          // CSV
    'application/vnd.ms-excel',                                         // Excel (old)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (new)
    'application/json',                                                 // JSON
    'text/plain'                                                        // Text files
  ];
  
  // Allowed extensions
  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check both MIME type and extension
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.includes(ext);
  
  if (isMimeTypeValid || isExtensionValid) {
    console.log(`✅ File accepted: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.log(`❌ File rejected: ${file.originalname} (${file.mimetype})`);
    cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} files are allowed.`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow 1 file per request
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSize = (parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024;
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${maxSize.toFixed(2)}MB`
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only 1 file is allowed per upload.'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "file" as the field name.'
      });
    }
    
    // Generic multer error
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }
  
  // File filter error
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Pass to next error handler
  next(err);
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;