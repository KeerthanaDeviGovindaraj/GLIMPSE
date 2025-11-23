const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightos')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('⚠️  MongoDB not connected:', err.message));

app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/commentary', require('./routes/commentaryRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is healthy',
    llmProvider: process.env.LLM_PROVIDER || 'anthropic',
    llmConfigured: !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`🤖 LLM: ${process.env.LLM_PROVIDER || 'anthropic'}`);
  console.log(`🔑 API Key: ${!!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY) ? 'Set ✅' : 'Missing ❌'}`);
});