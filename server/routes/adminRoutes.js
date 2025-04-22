// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
} = require('../controllers/adminController');
const { updateQRCode } = require('../controllers/qrController');
const { deleteUser, deleteQRCode } = require('../controllers/deleteController');
const {
  getAdminNotifications,
  handleNotification,
  deleteNotification
} = require('../controllers/notificationController');

// Admin-protected routes
router.use(protect, admin);

// Notifications
router.get('/notifications', getAdminNotifications);
router.put('/notifications/:id', handleNotification);
router.delete('/notifications/:id', deleteNotification);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// QR Codes
router.get('/qr-codes/count', getQRCodeStats);
router.get('/qr-codes/recent', getRecentQRCodes);
router.put('/qr-codes/:id', updateQRCode);
router.delete('/qr-codes/:id', deleteQRCode);

module.exports = router;
