const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getAdminNotifications,
  getMyNotifications,
  deleteNotification,
  handleNotification, // we'll use a wrapper to inject `io`
} = require('../controllers/notificationController');

module.exports = (io) => {
  const router = express.Router();

  // Admin inbox
  router.get('/admin', protect, admin, getAdminNotifications);
  router.put('/admin/:id', protect, admin, handleNotification(io)); // inject io here

  // My (user) inbox
  router.get('/', protect, getMyNotifications);
  router.delete('/:id', protect, deleteNotification);

  return router;
};
