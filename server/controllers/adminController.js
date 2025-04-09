//server/controllers/adminController.js
const User = require('../models/User');
const QRCode = require('../models/QRCode');

// GET /admin/users
const getAllUsers = async (req, res) => {
  const users = await User.find({}, '-password'); // exclude password
  res.json(users);
};

// PUT /admin/users/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();

  res.json({ message: 'User updated successfully' });
};

// GET /admin/qr-codes/count
const getQRCodeStats = async (req, res) => {
  const count = await QRCode.countDocuments();
  res.json({ count });
};

// GET /admin/qr-codes/recent
const getRecentQRCodes = async (req, res) => {
  const recent = await QRCode.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'email name');
  res.json(recent);
};

module.exports = {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
};
