// server/routes/notificationRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

module.exports = (io) => {
  // Initialize Socket.IO in controller
  if (typeof notificationController.initialize === 'function') {
    notificationController.initialize(io);
  }

  const router = express.Router();

  // Admin-only routes
  router.use('/admin', protect, admin);
  router.get('/admin', notificationController.getAdminNotifications);
  router.put('/admin/:id', notificationController.handleNotification);

  // User routes (protected)
  router.use(protect);
  router.get('/', notificationController.getMyNotifications);
  router.delete('/:id', notificationController.deleteNotification);

  return router;
};
