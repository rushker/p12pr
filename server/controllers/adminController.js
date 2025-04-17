//server/controllers/adminController.js
const bcrypt = require('bcryptjs');
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
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
     
    // Update password if provided
     if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    await user.save();

    res.json({ 
      message: 'User updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Optional: Delete user's QR codes
    await QRCode.deleteMany({ user: user._id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    res.json({ totalUsers });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Failed to fetch user count' });
  }
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

const getTotalQRCodes = async (req, res) => {
  try {
    const totalQRCodes = await QRCode.countDocuments();
    res.json({ totalQRCodes });
  } catch (error) {
    console.error('Error fetching QR code count:', error);
    res.status(500).json({ message: 'Failed to fetch QR count' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  getQRCodeStats,
  getRecentQRCodes,
  getTotalUsers,
  getTotalQRCodes,
  deleteUser,
};
