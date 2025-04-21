// server/controllers/deleteController.js
const QRCode = require('../models/QRCode');
const User = require('../models/User');
const deleteImageFromCloudinary = require('../utils/deleteQRCodeWithImage');

// DELETE /qr/:id — for user or admin
const deleteQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Check if the user is the owner or admin
    const isOwner = qrCode.user.toString() === req.user.id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this QR code' });
    }

    // Delete from Cloudinary
    await deleteImageFromCloudinary(qrCode.publicId);

    // Delete from MongoDB
    await qrCode.deleteOne();

    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Delete QR error:', error);
    res.status(500).json({ message: 'Server error while deleting QR code' });
  }
};

// Delete a user and all related data
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        const userQRCodes = await QRCode.find({ user: user._id });
    
        // Delete all images from Cloudinary
        for (const qr of userQRCodes) {
          await deleteImageFromCloudinary(qr.publicId);
        }
    
        // Delete QR codes from DB
        await QRCode.deleteMany({ user: user._id });
    
        // Delete user
        await user.deleteOne();
    
        res.json({ message: 'User and associated data deleted successfully' });
      } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
      }
};

module.exports = {
  deleteQRCode,
  deleteUser,
};
