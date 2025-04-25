// utils/deleteUserQRCodes.js
// Admin fs only
const QRCode = require('../models/QRCode');
const deleteImageFromCloudinary = require('./deleteQRCodeWithImage');

const deleteUserQRCodes = async (userId) => {
  const qrCodes = await QRCode.find({ user: userId });

  for (const qr of qrCodes) {
    if (qr.type === 'image' && qr.publicId) {
      try {
        await deleteImageFromCloudinary(qr.publicId);
      } catch (cloudErr) {
        console.error(`Failed to delete image for QR ID ${qr._id}:`, cloudErr);
      }
    }
  }

  await QRCode.deleteMany({ user: userId });
};

module.exports = deleteUserQRCodes;
