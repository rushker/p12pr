// server/routes/notificationRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
  getAdminNotifications, handleNotification,
  getMyNotifications, deleteNotification
} = require('../controllers/notificationController');
const router = express.Router();

// Admin inbox
router.get('/admin', protect, admin, getAdminNotifications);
router.put('/admin/:id', protect, admin, handleNotification);

// My (user) inbox
router.get('/', protect, getMyNotifications);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
