require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const app = express(); // ✅ Only ONE app instance
const server = http.createServer(app);

// Socket.IO initialization
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined ${roomId}`);

    io.to(roomId).emit('user_joined', {
      clientId: socket.id,
      roomId
    });
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`👋 ${socket.id} left ${roomId}`);

    io.to(roomId).emit('user_left', {
      clientId: socket.id,
      roomId
    });
  });

  socket.on('commentary', ({ roomId, payload }) => {
    io.to(roomId).emit('commentary', {
      from: socket.id,
      payload
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Expose io for other files
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Socket.IO active at ws://localhost:${PORT}`);
});

module.exports = { app, server, io };
