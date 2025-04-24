require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const { errorHandler } = require('./middleware/error');
const listEndpoints = require('express-list-endpoints');

const app = express();

// Connect to database and Cloudinary
connectDB();
configureCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Setup
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', qrRoutes);

// Log registered endpoints
console.log('🗺️ Registered API endpoints:\n',
  listEndpoints(app)
    .filter(r => r.path.startsWith('/api'))
    .map(r => `${r.methods.join(',')}  ${r.path}`)
    .join('\n')
);

// Catch-all for unknown API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  next();
});

// Error handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
});
