// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Generate JWT token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

//Auto create guest account
const createGuestAccount = async (req, res) => {
  try {
    const guestUser = await User.create({
      username: `Guest_${Date.now()}`,
      email: `guest_${Date.now()}@guest.com`,
      password: Math.random().toString(36).slice(-8), // random temp password
      isGuest: true,
    });

    res.json({
      _id: guestUser._id,
      username: guestUser.username,
      email: guestUser.email,
      isAdmin: false,
      token: generateToken(guestUser._id, false),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create guest account' });
  }
};


// Register user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

 
    const isAdmin = email.endsWith('@admin.com');

    const user = await User.create({
      username,
      email,
      password,
      isAdmin,
    });

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin, 
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};


// Get current logged-in user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGuestAccount,
  registerUser,
  loginUser,
  getMe,
};
