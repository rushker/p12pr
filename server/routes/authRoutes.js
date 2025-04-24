// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  createGuestAccount,
  registerUser,
  loginUser,
  getMe,
  
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { deleteGuestAccount } = require('../controllers/deleteController');

router.post('/guest', createGuestAccount);
router.post('/register', registerUser);
router.post('/login',    loginUser);
router.get( '/me',       protect, getMe);
router.delete('/guest/:id', deleteGuestAccount);
router.post('/guest/:id/delete', deleteGuestAccount);
module.exports = router;
