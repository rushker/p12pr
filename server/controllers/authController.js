// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const generateResetToken = require('../utils/generateResetToken');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification')

// Generate JWT token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
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
// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(404).json({ message: 'No user with that email' });

    // 1) generate a resetToken, hash it & set expiry on user
    const { resetToken, hashed, expire } = generateResetToken();
    user.resetPasswordToken  = hashed;
    user.resetPasswordExpire = expire;
    await user.save();

    // 2) build the URL for the client to consume
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 3) send (or log) the email
    await sendEmail({
      to: user.email,
      subject: 'Your password reset link',
      text:   `Click here to reset your password:\n\n${resetURL}\n\nThis link expires in 10 minutes.`,
    });

    // 4) create a Notification for admins
    await Notification.create({
      type:     'reset_request',
      fromUser: user._id,
      toRole:   'admin',
      message:  `${user.email} requested a password reset.`,
      link:     `/reset-password/${resetToken}`    // ← use resetToken, not "token"
    });

    console.log(`🛠️  RESET LINK → ${resetURL}`);
    res.json({
      message: 'Password‑reset request received, waiting for admin approval',
      userId: user._id.toString()
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) 
      return res.status(400).json({ message: 'Invalid or expired token' });

    const { password } = req.body;
    if (!password) 
      return res.status(400).json({ message: 'Password is required' });

    // Save new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Your password has been reset.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
