// server/routes/qrRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  generateLinkQRCode,
  getUserQRCodes,
  getQRCodeById,
} = require('../controllers/qrController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { deleteQRCode } = require('../controllers/deleteController');

// Image‐based upload
router
  .route('/')
  .post(protect, upload.single('image'), generateQRCode)
  .get(protect, getUserQRCodes);

// New link‐based QR endpoint
router.post('/link', protect, generateLinkQRCode);

  router
  .route('/:id')
  .get(protect,getQRCodeById)
  .delete(protect, deleteQRCode);

module.exports = router;