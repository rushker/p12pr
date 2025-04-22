const Notification = require('../models/Notification');
const User = require('../models/User');
const crypto = require('crypto');

// Admin GET notifications
exports.getAdminNotifications = async (req, res) => {
  const notes = await Notification.find({ toRole: 'admin', status: 'pending' })
    .sort('-createdAt')
    .populate('fromUser', 'email username');
  res.json(notes);
};

// Admin handles accept/deny action
exports.handleNotification = (io) => async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!['accepted', 'denied'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const note = await Notification.findById(id);
  if (!note) return res.status(404).json({ message: 'Notification not found' });

  note.status = action;

  if (note.type === 'reset_request' && action === 'accepted') {
    const user = await User.findById(note.fromUser);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `/reset-password/${resetToken}`;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    note.link = resetLink;
  }

  await note.save();

  // Real-time notification to user
  io.to(note.fromUser.toString()).emit('notificationUpdated', note);

  res.json(note);
};

// User gets own notifications
exports.getMyNotifications = async (req, res) => {
  const toRole = req.user.isAdmin ? 'admin' : 'user';
  const notes = await Notification.find({ toRole, fromUser: req.user._id }).sort('-createdAt');
  res.json(notes);
};

// Dismiss (delete) a notification
exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
