// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },        // e.g. 'reset_request'
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toRole: { type: String, enum: ['admin','user'], required: true }, // who should see it
  message: { type: String, required: true },
  link: { type: String },                         // e.g. '/reset-password/<token>'
  status: { type: String, enum: ['pending','accepted','denied'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
