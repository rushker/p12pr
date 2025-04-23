// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const { errorHandler } = require('./middleware/error');
const listEndpoints = require('express-list-endpoints');
const notificationController = require('./controllers/notificationController');

// Create Express + HTTP server
const app = express();
const server = http.createServer(app);
  
// Connect to DB and configure Cloudinary
connectDB();
configureCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim());

const corsOptions = {
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
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inject Socket.IO instance into controller
notificationController.initialize(io);

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join-room', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room.`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/notifications', require('./routes/notificationRoutes')(io));
app.use('/api', require('./routes'));

// Log registered endpoints
console.log('🗺️ Registered API endpoints:\n',
  listEndpoints(app)
    .filter(r => r.path.startsWith('/api'))
    .map(r => `${r.methods.join(',')}  ${r.path}`)
    .join('\n')
);

// Safe catch-all for unknown API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  next();
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
});