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

// Admin-protected routes
router.use(protect, admin);

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
