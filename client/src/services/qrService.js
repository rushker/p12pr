import axios from '../api/axiosConfig';
import { API_BASE_URL } from '../api/endpoints';

const generateQRCode = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/qr`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getUserQRCodes = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/qr`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getQRCodeById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/qr/${id}`);
  return response.data;
};

const deleteQRCode = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_BASE_URL}/qr/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { generateQRCode, getUserQRCodes, getQRCodeById, deleteQRCode };