// client/src/services/qrService.js
import axios from '../api/axios/axiosConfig';

// Generate QR code from image
export const generateImageQRCode = async (formData) => {
  const res = await axios.post('/qr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Generate QR code from link
export const generateLinkQRCode = async (data) => {
  const res = await axios.post('/qr/link', data);
  return res.data;
};

// Fetch all QR codes for current user
export const getUserQRCodes = async () => {
  const res = await axios.get('/qr');
  return res.data;
};

// Fetch a single QR code by ID
export const getQRCodeById = async (id) => {
  const res = await axios.get(`/qr/${id}`);
  return res.data;
};

// Delete a QR code by ID
export const deleteQRCode = async (id) => {
  const res = await axios.delete(`/qr/${id}`);
  return res.data;
};
