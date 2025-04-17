// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMe } = require('../controllers/authController');
const { getUserQRCodes } = require('../controllers/qrController');

router.get('/me', protect, getMe);
router.get('/dashboard', protect, getUserQRCodes);

module.exports = router;