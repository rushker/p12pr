// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const deleteController = require('../controllers/deleteController');
const { protect } = require('../middleware/auth');

//Guest routes
router.post('/guest', authController.createGuestAccount);
router.delete('/guest/:id', deleteController.deleteGuestAccount);

//user routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', protect, authController.getMe);
module.exports = router;
