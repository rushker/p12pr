//server/utils/deleteQRCodeWithImage.js
const cloudinary = require('cloudinary').v2;

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

module.exports = deleteImageFromCloudinary;
