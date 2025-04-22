const Notification = require('../models/Notification');
const User = require('../models/User');
const crypto = require('crypto');

let io = null;

// Set the Socket.IO instance (called in routes)
exports.setSocket = (ioInstance) => {
  io = ioInstance;
};

// Admin GET notifications
exports.getAdminNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ toRole: 'admin', status: 'pending' })
      .sort('-createdAt')
      .populate('fromUser', 'email username');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin notifications' });
  }
};

// Admin handles accept/deny action
exports.handleNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['accepted', 'denied'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const note = await Notification.findById(id);
    if (!note) return res.status(404).json({ message: 'Notification not found' });

    note.status = action;

    // If it's a reset request and accepted
    if (note.type === 'reset_request' && action === 'accepted') {
      const user = await User.findById(note.fromUser);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetLink = `/reset-password/${resetToken}`;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
      await user.save();

      note.link = resetLink;

      // Real-time push to user
      if (io) {
        io.to(user._id.toString()).emit('password-reset-approved', {
          link: resetLink,
          message: 'Your password reset request was approved.'
        });
      }
    }

    await note.save();

    // Emit notification update to the user (for all actions)
    if (io) {
      io.to(note.fromUser.toString()).emit('notificationUpdated', note);
    }

    res.json(note);
  } catch (err) {
    console.error('Notification handling failed:', err);
    res.status(500).json({ message: 'Failed to handle notification' });
  }
};

// User gets own notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const toRole = req.user.isAdmin ? 'admin' : 'user';
    const notes = await Notification.find({ toRole, fromUser: req.user._id }).sort('-createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your notifications' });
  }
};

// Dismiss (delete) a notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};
