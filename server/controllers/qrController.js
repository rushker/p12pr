const QRCode = require('../models/QRCode');
const cloudinary = require('cloudinary').v2;
const QRCodeGen = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const streamifier = require('streamifier');
const asyncHandler = require('express-async-handler');

// Generate QR code from uploaded image
const generateQRCode = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

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
    type: 'image',
  });

  await qrCode.populate('user', 'username email');
  res.status(201).json(qrCode);
});

// Generate QR code from a link
const generateLinkQRCode = asyncHandler(async (req, res) => {
  const { link, title, description } = req.body;
  if (!link) {
    return res.status(400).json({ message: 'Link is required' });
  }

  const qr = await QRCode.create({
    user: req.user.id,
    imageUrl: null,
    qrCodeUrl: null,
    publicId: null,
    title,
    description,
    originalUrl: link,
    type: 'link',
  });

  const redirectUrl = `${process.env.BASE_URL}/api/qr/redirect/${qr._id}`;
  const qrCodeDataUrl = await QRCodeGen.toDataURL(redirectUrl);

  qr.qrCodeUrl = qrCodeDataUrl;
  await qr.save();
  await qr.populate('user', 'username email');

  res.status(201).json({
    ...qr.toObject(),
    publicUrl: redirectUrl, // for external usage
  });
});

// Get all QR codes for the current user
const getUserQRCodes = asyncHandler(async (req, res) => {
  const qrCodes = await QRCode.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(qrCodes);
});

// Get a specific QR code by ID
const getQRCodeById = asyncHandler(async (req, res) => {
  const qrCode = await QRCode.findById(req.params.id).populate('user', 'username email');
  if (!qrCode) {
    return res.status(404).json({ message: 'QR code not found' });
  }
  res.json(qrCode);
});

// PUBLIC: Redirect to original URL
const redirectQRCode = asyncHandler(async (req, res) => {
  const qr = await QRCode.findById(req.params.id);
  if (!qr) return res.status(404).send('QR code not found');

  if (qr.type === 'link' && qr.originalUrl) {
    return res.redirect(qr.originalUrl);
  }

  res.status(400).send('Invalid QR code type');
});

// Update title & description of QR code
const updateQRCode = asyncHandler(async (req, res) => {
  const qrCode = await QRCode.findById(req.params.id);
  if (!qrCode) return res.status(404).json({ message: 'QR code not found' });

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
});

module.exports = {
  generateQRCode,
  generateLinkQRCode,
  getUserQRCodes,
  getQRCodeById,
  updateQRCode,
  redirectQRCode,
};
