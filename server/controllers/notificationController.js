const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Make sure this exists

// GET /api/notifications - For the logged-in user
exports.getMyNotifications = async (req, res) => {
  const toRole = req.user.isAdmin ? 'admin' : 'user';
  const notes = await Notification.find({ toRole }).sort('-createdAt');
  res.json(notes);
};

// DELETE /api/notifications/:id - Dismiss a notification
exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// GET /api/notifications/admin - Admin sees pending requests
exports.getAdminNotifications = async (req, res) => {
  const notes = await Notification.find({ toRole: 'admin', status: 'pending' })
    .sort('-createdAt')
    .populate('fromUser', 'email username');
  res.json(notes);
};

// PUT /api/notifications/admin/:id - Admin handles accept/deny
// Body: { action: 'accepted' | 'denied' }
exports.handleNotification = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!['accepted', 'denied'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const note = await Notification.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  note.status = action;
  await note.save();

  // If reset request was accepted, notify the requesting user
  if (note.type === 'reset_request' && action === 'accepted') {
    const user = await User.findById(note.fromUser);
    if (user && note.link) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Your Password Reset Request Was Approved',
          html: `
            <p>Hello ${user.username},</p>
            <p>Your password reset request has been approved.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${note.link}" style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #22c55e;
              color: white;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
            ">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
        });
      } catch (err) {
        console.error('Failed to send reset email:', err.message);
        // Optionally still return success even if email fails
      }
    }
  }

  res.json(note);
};
