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


router.get('/redirect/:id', redirectQRCode);

// Protected routes for image-based and link-based QR codes
router.route('/')
  .post(protect, upload.single('image'), generateQRCode)
  .get(protect, getUserQRCodes);

router.post('/link', protect, generateLinkQRCode);

// Get or delete a specific QR code
router
  .route('/:id')
  .get(protect, getQRCodeById)
  .delete(protect, deleteQRCode);

module.exports = router;
