import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cgpaRoutes from './routes/cgpa.js';
import debugRoutes from './routes/debug.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cgpa', cgpaRoutes);
app.use('/api/debug', debugRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cgpa-calculator';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;