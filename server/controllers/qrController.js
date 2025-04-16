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
const deleteQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Check if user owns the QR code
    if (qrCode.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(qrCode.publicId);

    // Delete from database
    await qrCode.remove();

    res.json({ message: 'QR code deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQRCode,
  getUserQRCodes,
  getQRCodeById,
  deleteQRCode,
};