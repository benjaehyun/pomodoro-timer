import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import userRoutes from '../server/routes/users';
import cycleRoutes from '../server/routes/cycles';
import configurationRoutes from '../server/routes/configurations';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.VERCEL_URL || '*'
    : process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Database connection with connection pooling for serverless
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Maintain up to 10 socket connections
      maxPoolSize: 10,
      // Close sockets after 10 seconds of inactivity
      socketTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Middleware to ensure DB connection for each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/configurations', configurationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

export default app;