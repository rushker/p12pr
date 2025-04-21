// server/routes/qrRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  getUserQRCodes,
  getQRCodeById,
} = require('../controllers/qrController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { deleteQRCode } = require('../controllers/deleteController');
router
  .route('/')
  .post(protect, upload.single('image'), generateQRCode)
  .get(protect, getUserQRCodes);

router
  .route('/:id')
  .get(getQRCodeById)
  .delete(protect, deleteQRCode);

module.exports = router;