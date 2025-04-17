//server/controllers/adminController.js
const User = require('../models/User');
const QRCode = require('../models/QRCode');

// GET /admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
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
  try {
    const count = await QRCode.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting QR codes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET /admin/qr-codes/recent
const getRecentQRCodes = async (req, res) => {
  try {
    const recent = await QRCode.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username email');
    res.json(recent);
  } catch (error) {
    console.error('Error fetching recent QR codes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
};
