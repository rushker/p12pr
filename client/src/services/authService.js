// client/src/services/authService.js
import axios from '../api/axiosConfig';

export const login = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  
  if (response.status === 401) {
    throw new Error('Invalid email or password');
  }
  
  return response.data; // Should return { _id, username, email, isAdmin, token }
};

export const forgotPassword = async (email) => {
  const res = await axios.post('/auth/forgot-password', { email });
  return res.data;  // { message: 'Password reset link sent to email' }
};

export const resetPassword = async (token, password) => {
  const res = await axios.put(`/auth/reset-password/${token}`, { password });
  return res.data;  // { message: 'Password has been reset' }
};

export const register = async (username, email, password) => {
  const response = await axios.post('/auth/register', { username, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};