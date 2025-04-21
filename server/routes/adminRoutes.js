//routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
} = require('../controllers/adminController');
const { updateQRCode } = require('../controllers/qrController');
const { deleteUser, deleteQRCode } = require('../controllers/deleteController');
const { protect, admin } = require('../middleware/auth');

// Admin-protected routes

// GET all users - Admin only
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUser);

// DELETE a user and their QR codes - Admin only
router.delete('/users/:id', protect, admin, deleteUser);

router.get('/qr-codes/count', protect, admin, getQRCodeStats);
router.get('/qr-codes/recent', protect, admin, getRecentQRCodes);
router.put('/qr-codes/:id', protect, admin, updateQRCode);

// DELETE a QR code (owner or admin)
router.delete('/qr-codes/:id', protect, admin, deleteQRCode);

module.exports = router;
