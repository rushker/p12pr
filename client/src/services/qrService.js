// client/src/services/qrService.js
import axios from '../api/axiosConfig';

export const generateImageQRCode = formData =>
  axios.post('/qr', formData); // For image QR

export const generateLinkQRCode = data =>
  axios.post('/qr/link', data); // For link QR

export const getUserQRCodes = () =>
  axios.get('/qr');

export const getQRCodeById = id =>
  axios.get(`/qr/${id}`);

export const deleteQRCode = id =>
  axios.delete(`/qr/${id}`);
