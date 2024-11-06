// api/[...slug].js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/users';  // Make sure these routes are in your api folder
import cycleRoutes from './routes/cycles';
import configurationRoutes from './routes/configurations';

// Initialize express
const app = express();

// Configure middleware
app.use(cors({
  origin: process.env.VERCEL_URL ? 
    [`https://${process.env.VERCEL_URL}`, process.env.PRODUCTION_URL].filter(Boolean) : 
    '*',
  credentials: true
}));
app.use(express.json());

// Configure routes
app.use('/users', userRoutes);
app.use('/cycles', cycleRoutes);
app.use('/configurations', configurationRoutes);

// Database connection
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Main handler function
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Connect to database
  try {
    await connectDB();
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed' });
  }

  // Log incoming request
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    path: req.url.replace('/api', '')  // Clean path for express routing
  });

  return new Promise((resolve, reject) => {
    // Create a mock req object that Express can work with
    req.url = req.url.replace('/api', '');
    
    app(req, res, (err) => {
      if (err) {
        console.error('Express error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}