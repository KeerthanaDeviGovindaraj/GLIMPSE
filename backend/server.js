import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// This is now the single entry point for starting the server.
connectDB().then(() => {
  const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
  app.listen(PORT, () => {
    console.log(`\n✅ Server is running in ${process.env.NODE_ENV || 'development'} mode.`);
    console.log(`   - Local: ${BASE_URL}`);
    console.log(`   - Docs:  ${BASE_URL}/docs`);
  });
});