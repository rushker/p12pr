const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Load admin data
const adminsPath = path.join(__dirname, '../data/admins.json');
let admins = [];
if (fs.existsSync(adminsPath)) {
  admins = JSON.parse(fs.readFileSync(adminsPath, 'utf-8'));
}

// Register user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id, user.isAdmin),
  });
};

// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 🔍 Check admins.json first
    const admin = admins.find(admin => admin.email === email && admin.password === password);
    if (admin) {
      return res.json({
        _id: 'admin-id',
        username: 'Admin',
        email: admin.email,
        isAdmin: true,
        token: generateToken('admin-id', true),
      });
    }

    // 👤 Otherwise, check MongoDB
    const user = await User.findOne({ email });
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
    next(error);
  }
};

// Get current user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Generate JWT token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
