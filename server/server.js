// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const { errorHandler } = require('./middleware/error');

// Initialize Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Configure Cloudinary
configureCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the combined routes
app.use('/', require('./routes'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${process.env.ALLOWED_ORIGINS}`);
});