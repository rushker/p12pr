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

    // Check if the user is the owner or an admin
    const isOwner = qrCode.user.toString() === req.user.id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this QR code' });
    }

    // Delete from Cloudinary only if image-based and has publicId
    if (qrCode.type === 'image' && qrCode.publicId) {
      try {
        await deleteImageFromCloudinary(qrCode.publicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr);
        // Continue with DB deletion even if Cloudinary fails
      }
    }

    // Delete from MongoDB
    await qrCode.deleteOne();

    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Delete QR error:', error);
    res.status(500).json({ message: 'Server error while deleting QR code' });
  }
};

// DELETE /user/:id — admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userQRCodes = await QRCode.find({ user: user._id });

    // Delete images from Cloudinary only for image-type QR codes
    for (const qr of userQRCodes) {
      if (qr.type === 'image' && qr.publicId) {
        try {
          await deleteImageFromCloudinary(qr.publicId);
        } catch (cloudErr) {
          console.error(`Failed to delete image for QR ID ${qr._id}:`, cloudErr);
        }
      }
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

// DELETE /auth/guest/:id — guest auto-deletion
const deleteGuestAccount = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user || !user.isGuest) {
      return res.status(404).json({ message: 'Guest user not found' });
    }

    const userQRCodes = await QRCode.find({ user: user._id });

    // Delete images from Cloudinary
    for (const qr of userQRCodes) {
      if (qr.type === 'image' && qr.publicId) {
        try {
          await deleteImageFromCloudinary(qr.publicId);
        } catch (cloudErr) {
          console.error(`Failed to delete image for QR ID ${qr._id}:`, cloudErr);
        }
      }
    }

    // Delete all QR codes from DB
    await QRCode.deleteMany({ user: user._id });

    // Finally, delete the user
    await user.deleteOne();

    res.status(200).json({ message: 'Guest account and data deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  deleteQRCode,
  deleteUser,
  deleteGuestAccount,
};
