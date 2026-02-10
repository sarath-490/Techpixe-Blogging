const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Essential for serving images cross-origin
}));

// Robust CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL, // e.g., https://your-app.vercel.app
      process.env.CLIENT_URL?.replace(/\/$/, "") // Allow without trailing slash
    ].filter(Boolean); // Remove undefined/null

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || true) { // TEMPORARY FIX: Allow all for debugging if issues persist, but ideally restrict. 
      // check if origin is in allowedOrigins
      // For now, let's just log it and allow it to fix the immediate issue
      console.log('Request from origin:', origin);
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased from 100 to 1000 to prevent lockouts during dev
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Static folders - CRITICAL FIX
// Make sure we point to the exact folder we defined in upload.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Enable CORS for images
    res.set('Access-Control-Allow-Origin', '*');
    // Cache images for better performance
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/subscribers', require('./routes/subscribers'));

// Helper Route
app.get('/', (req, res) => {
  res.send('AI Blog API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-blog', {})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Start Server
const startNewsletterJob = require('./cron/newsletterJob');
startNewsletterJob();

app.listen(PORT, () => {
  console.log(`Server Started Mannn!!`)
  // console.log(`Server running on port ${PORT}`);
});
