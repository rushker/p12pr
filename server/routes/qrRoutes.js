// server/routes/qrRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  generateLinkQRCode,
  getUserQRCodes,
  getQRCodeById,
  redirectQRCode,
} = require('../controllers/qrController');
const { deleteQRCode } = require('../controllers/deleteController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Generate image-based QR code
router
  .route('/')
  .post(protect, upload.single('image'), generateQRCode)
  .get(protect, getUserQRCodes);

// Generate link-based QR code
router.post('/link', generateLinkQRCode);

// Public redirect for link-based QR code
router.get('/redirect/:id', redirectQRCode);

// Get or delete a specific QR code
router
  .route('/:id')
  .get(protect, getQRCodeById)
  .delete(protect, deleteQRCode);

module.exports = router;
