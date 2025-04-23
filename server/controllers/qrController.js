// server/controllers/qrController.js
const QRCode       = require('../models/QRCode');
const cloudinary   = require('cloudinary').v2;
const QRCodeGen    = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const streamifier  = require('streamifier');

// Generate image to QR code
const generateQRCode = async (req, res, next) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  try {
    // 1) stream buffer into Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'qr-code-images',
          public_id: uuidv4(),
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    // 2) generate QR code (data URL) pointing at that image
    const qrCodeDataUrl = await QRCodeGen.toDataURL(uploadResult.secure_url);

    // 3) persist
    const qrCode = await QRCode.create({
      user:       req.user.id,
      imageUrl:   uploadResult.secure_url,
      qrCodeUrl:  qrCodeDataUrl,
      publicId:   uploadResult.public_id,
      title,
      description,
    });
    await qrCode.populate('user', 'username email');

    res.status(201).json(qrCode);
  } catch (error) {
    next(error);
  }
};  

// Generate link to QR code
const generateLinkQRCode = async (req, res, next) => {
  const { link, title, description } = req.body;
  if (!link) {
    return res.status(400).json({ message: 'Link is required' });
  }

  try {
    // 1) Generate the QR‐code Data URL for that link
    const qrCodeDataUrl = await QRCodeGen.toDataURL(link);

    // 2) Save to DB (we leave imageUrl/publicId null)
    const qr = await QRCode.create({
      user:       req.user.id,
      imageUrl:   null,
      qrCodeUrl:  qrCodeDataUrl,
      publicId:   null,
      title,
      description,
      originalUrl: link // optional: store the actual link
    });

    await qr.populate('user', 'username email');
    res.status(201).json(qr);
  } catch (err) {
    next(err);
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

// Update QR code
const updateQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Check if the user is the owner or an admin
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
};
