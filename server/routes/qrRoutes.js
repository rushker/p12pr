const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  generateLinkQRCode,
  getUserQRCodes,
  getQRCodeById,
  redirectQRCode, // keep just one redirect handler
} = require('../controllers/qrController');
const { deleteQRCode } = require('../controllers/deleteController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: Redirect handler for link/image QR codes
router.get('/redirect/:id', redirectQRCode);

// Protected: Create and retrieve QR codes
router.route('/')
  .post(protect, upload.single('image'), generateQRCode)
  .get(protect, getUserQRCodes);

// Protected: Create QR code from a link
router.post('/link', protect, generateLinkQRCode);

// Protected: Get or delete a specific QR code
router.route('/:id')
  .get(protect, getQRCodeById)
  .delete(protect, deleteQRCode);

module.exports = router;
