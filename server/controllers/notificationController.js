// server/controllers/notificationController.js
const Notification = require('../models/Notification');
const QRCode = require('../models/QRCode');

// GET /api/admin/notifications
// (admin only)
exports.getAdminNotifications = async (req,res) => {
  const notes = await Notification.find({ toRole:'admin', status:'pending' })
    .sort('-createdAt')
    .populate('fromUser','email username');
  res.json(notes);
};

// PUT /api/admin/notifications/:id
// body: { action: 'accepted'|'denied' }
exports.handleNotification = async (req,res) => {
  const { id } = req.params;
  const { action } = req.body;
  if (!['accepted','denied'].includes(action)) 
    return res.status(400).json({ message:'bad action' });

  const note = await Notification.findById(id);
  if (!note) return res.status(404).json({ message:'not found' });
  note.status = action;
  await note.save();

  // if it was a reset_request & accepted, you might email the user or
  // let them know they can now visit note.link
  res.json(note);
};

// GET /api/notifications
// for any logged-in user
exports.getMyNotifications = async (req,res) => {
  const toRole = req.user.isAdmin ? 'admin' : 'user';
  const notes = await Notification.find({ toRole }).sort('-createdAt');
  res.json(notes);
};

// DELETE /api/notifications/:id
// dismiss a notification
exports.deleteNotification = async (req,res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success:true });
};
