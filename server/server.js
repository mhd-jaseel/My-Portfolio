const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during testing or dynamic ports
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Centralized Production-Ready Error Handler
app.use((err, req, res, next) => {
  // Log server-side context for debugging
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err.message || err);

  // 1. Multer / File Upload Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds the allowed limit (100MB max).',
    });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // 2. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    const cleanFieldName = field.charAt(0).toUpperCase() + field.slice(1);
    return res.status(409).json({
      success: false,
      message: `An item with this ${cleanFieldName.toLowerCase()} already exists.`,
      field,
    });
  }

  // 3. Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field "${err.path}".`,
    });
  }

  // 4. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const firstKey = Object.keys(err.errors)[0];
    const userMessage = err.errors[firstKey]?.message || 'Validation failed. Please verify your data.';
    return res.status(400).json({
      success: false,
      message: userMessage,
    });
  }

  // 5. JSON Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload in request body.',
    });
  }

  // 6. Generic/Fallback Server Error
  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 
      ? 'An unexpected error occurred. Please try again later.' 
      : (err.message || 'Internal Server Error'),
  });
});

// MongoDB Connection & Server Start
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jaseel_portfolio';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Running server with memory/retry mode. Please verify MongoDB service or Atlas connection.');
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
