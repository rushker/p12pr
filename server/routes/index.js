// server/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/qr', require('./qrRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;