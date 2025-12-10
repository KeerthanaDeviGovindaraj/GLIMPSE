const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const commentaryRoutes = require('./routes/commentary');
const sportsRoutes = require('./routes/sports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/commentaries', commentaryRoutes);
app.use('/api/sports', sportsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sports Commentary API is running',
    endpoints: {
      auth: '/api/auth',
      commentaries: '/api/commentaries',
      sports: '/api/sports'
    }
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});