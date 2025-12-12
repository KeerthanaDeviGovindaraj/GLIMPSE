require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();

// Connect to MongoDB
connectDB();

// ✅ UPDATED: CORS Configuration for Vite (port 5173)
app.use(cors({
  origin: [
    'http://localhost:5173',  // ✅ Vite dev server
    'http://localhost:4000',  // Backend server
    'http://localhost:3000',  // Backup for Create React App
    process.env.FRONTEND_URL  // From .env file
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));      // ✅ Authentication routes
app.use('/api/upload', require('./routes/uploadRoutes'));  // ✅ Upload routes
app.use('/api/admin', require('./routes/adminRoutes'));    // ✅ Admin routes
app.use('/api/users', require('./routes/users'));          // ⭐ NEW: User management routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'InsightOS Backend API - Admin & Sports Management',
    version: '1.0.0',
    author: 'Gayatri',
    port: PORT,
    frontend: 'Vite (localhost:5173)',
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      auth: '/api/auth',
      admin: '/api/admin',
      upload: '/api/upload',
      users: '/api/users'  // ⭐ Added to documentation
    }
  });
});

// ✅ Added health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'InsightOS API is running',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// ✅ CHANGED: Default port 5000 → 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Vite Frontend: http://localhost:5173`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================\n');
});

module.exports = app;