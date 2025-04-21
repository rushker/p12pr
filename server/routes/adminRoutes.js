// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
  deleteUser      
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const { updateQRCode } = require('../controllers/qrController');
// Admin-protected routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);  
router.get('/qr-codes/count', protect, admin, getQRCodeStats);
router.get('/qr-codes/recent', protect, admin, getRecentQRCodes);
router.put('/qr-codes/:id', protect, admin, updateQRCode);

module.exports = router;