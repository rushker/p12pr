// server/controllers/qrController.js

const QRCode = require('../models/QRCode');
const cloudinary = require('cloudinary').v2;
const QRCodeGen = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const streamifier = require('streamifier');

// Generate image-based QR code
const generateQRCode = async (req, res, next) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'qr-code-images',
          public_id: uuidv4(),
          resource_type: 'auto',
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const qrCodeDataUrl = await QRCodeGen.toDataURL(uploadResult.secure_url);

    const qrCode = await QRCode.create({
      user: req.user.id,
      imageUrl: uploadResult.secure_url,
      qrCodeUrl: qrCodeDataUrl,
      publicId: uploadResult.public_id,
      title,
      description,
    });

    await qrCode.populate('user', 'username email');
    res.status(201).json(qrCode);
  } catch (error) {
    next(error);
  }
};

// Generate link-based QR code
const generateLinkQRCode = async (req, res, next) => {
  const { link, title, description } = req.body;
  if (!link) {
    return res.status(400).json({ message: 'Link is required' });
  }

  try {
    const qrCodeDataUrl = await QRCodeGen.toDataURL(link);

    const qr = await QRCode.create({
      user: req.user.id,
      imageUrl: null,
      qrCodeUrl: qrCodeDataUrl,
      publicId: null,
      title,
      description,
      originalUrl: link,
    });

    await qr.populate('user', 'username email');
    res.status(201).json(qr);
  } catch (err) {
    next(err);
  }
};

// Get all QR codes for the current user
const getUserQRCodes = async (req, res, next) => {
  try {
    const qrCodes = await QRCode.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(qrCodes);
  } catch (error) {
    next(error);
  }
};

// Get a specific QR code by ID
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

// Redirect to original URL for link-based QR codes
const redirectQRCode = async (req, res, next) => {
  try {
    const qr = await QRCode.findById(req.params.id);
    if (!qr || !qr.originalUrl) {
      return res.status(404).send('QR code not found or not a redirect QR');
    }
    res.redirect(qr.originalUrl);
  } catch (err) {
    next(err);
  }
};

// Update QR code (title and description)
const updateQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    const isOwner = qrCode.user.toString() === req.user.id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this QR code' });
    }

    const { title, description } = req.body;
    if (title !== undefined) qrCode.title = title;
    if (description !== undefined) qrCode.description = description;

    await qrCode.save();
    await qrCode.populate('user', 'username email');
    res.json(qrCode);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQRCode,
  generateLinkQRCode,
  getUserQRCodes,
  getQRCodeById,
  updateQRCode,
  redirectQRCode,
};
