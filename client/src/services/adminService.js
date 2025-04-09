// client/src/services/adminService.js
import axios from 'axios';  

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

export const getAdminStats = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getRecentQRCodes = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/admin/recent-qrcodes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
