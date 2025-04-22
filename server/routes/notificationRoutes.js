// routes/notificationRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

module.exports = (io) => {
  const router = express.Router();

  // Inject `io` into controller
  notificationController.setSocket(io);

  router.get('/admin', protect, admin, notificationController.getAdminNotifications);
  router.put('/admin/:id', protect, admin, notificationController.handleNotification);

  router.get('/', protect, notificationController.getMyNotifications);
  router.delete('/:id', protect, notificationController.deleteNotification);

  return router;
};
