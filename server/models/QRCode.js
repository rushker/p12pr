// server/models/QRCode.js
const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
  qrCodeUrl: {
    type: String,
    required: true,
  },
  publicId: String,
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  originalUrl: String, // for link-based QR codes
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('QRCode', qrCodeSchema);