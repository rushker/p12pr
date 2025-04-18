// server/controllers/qrController.js
const QRCode = require('../models/QRCode');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const QRCodeGenerator = require('qrcode');
const { v4: uuidv4 } = require('uuid');

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
    }).catch(err => {
      throw new Error(`Cloudinary upload failed: ${err.message}`);
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

    // Populate user data
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
    console.log('🗑️ deleteQRCode called for ID:', req.params.id, 'User:', req.user.id, 'isAdmin:', req.user.isAdmin);
    const qr = await QRCode.findById(req.params.id);
    console.log('🗑️ Found QR:', qr);
    if (!qr) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Ensure only owner or admin can delete
    if (qr.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this QR code' });
    }

    // Optionally skip Cloudinary delete to isolate error
    if (qr.publicId) {
      try {
        console.log('🗑️ Destroying Cloudinary publicId:', qr.publicId);
        await cloudinary.uploader.destroy(qr.publicId);
        console.log('🗑️ Cloudinary image deleted');
      } catch (err) {
        console.error('Error deleting image from Cloudinary (continuing):', err);
      }
    }

    // Remove QR code document
    await qr.remove();
    console.log('🗑️ QR document removed');

    return res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return res.status(500).json({ message: 'Internal server error while deleting QR code' });
  }
};


module.exports = {
  generateQRCode,
  getUserQRCodes,
  getQRCodeById,
  deleteQRCode,
};