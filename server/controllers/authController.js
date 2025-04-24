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

// Auto-create guest account
const createGuestAccount = async (req, res) => {
  try {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Step 1: Use `new User()` instead of `User.create()` so we can set the skipHashing flag
    const guestUser = new User({
      username: `Guest_${Date.now()}`,
      email: `guest_${Date.now()}@guest.com`,
      password: hashedPassword,
      isGuest: true,
    });

    // Step 2: Set custom flag to bypass rehashing
    guestUser.skipHashing = true;

    // Step 3: Save manually
    await guestUser.save();

    // Step 4: Return user data including the plain password
    res.status(201).json({
      _id: guestUser._id,
      username: guestUser.username,
      email: guestUser.email,
      password: randomPassword, // Send plain password to client
      isAdmin: false,
      token: generateToken(guestUser._id, false),
    });
  } catch (err) {
    console.error('Guest account creation error:', err);
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
