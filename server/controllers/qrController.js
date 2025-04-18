// server/controllers/qrController.js
const QRCode = require('../models/QRCode');
const cloudinary = require('cloudinary').v2;
const QRCodeGenerator = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Generate QR code
const generateQRCode = async (req, res, next) => {
  const { title, description } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'qr-code-images',
      public_id: `${uuidv4()}`,
      resource_type: 'auto',
    });

    // Generate QR code for the image URL
    const qrCodeDataUrl = await QRCodeGenerator.toDataURL(result.secure_url);

    // Save to database
    const qrCode = await QRCode.create({
      user: req.user.id,
      imageUrl: result.secure_url,
      qrCodeUrl: qrCodeDataUrl,
      publicId: result.public_id,
      title,
      description,
    });

    await qrCode.populate('user', 'username email');

    res.status(201).json(qrCode);
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Get all QR codes for a user
const getUserQRCodes = async (req, res, next) => {
  try {
    const qrCodes = await QRCode.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(qrCodes);
  } catch (error) {
    next(error);
  }
};

// Get QR code by ID
const getQRCodeById = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id).populate('user', 'username email');

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json(qrCode);
  } catch (error) {
    next(error);
  }
};

// Delete QR code
const deleteQRCode = async (req, res) => {
  try {
    const qr = await QRCode.findById(req.params.id);

    if (!qr) {
      console.log('QR not found for ID:', req.params.id);
      return res.status(404).json({ message: 'QR code not found' });
    }

    console.log('QR fetched:', qr);
    console.log('Requesting user:', req.user);

    const qrUserId = qr.user.toString();
    const requesterId = req.user.id;

    if (qrUserId !== requesterId && !req.user.isAdmin) {
      console.log('Not authorized to delete this QR code:', {
        qrUser: qrUserId,
        reqUserId: requesterId,
        isAdmin: req.user.isAdmin,
      });
      return res.status(403).json({ message: 'Not authorized to delete this QR code' });
    }

    // Delete image from Cloudinary
    if (qr.publicId) {
      try {
        const cloudRes = await cloudinary.uploader.destroy(qr.publicId);
        console.log('Cloudinary delete result:', cloudRes);
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err.message);
      }
    }

    // Delete from MongoDB
    await qr.deleteOne();

    return res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Server error in deleteQRCode:', error);
    return res.status(500).json({ message: 'Internal server error while deleting QR code' });
  }
};

module.exports = {
  generateQRCode,
  getUserQRCodes,
  getQRCodeById,
  deleteQRCode,
};
