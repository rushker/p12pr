// services/authService.js
import axios from '../api/axiosConfig';
import { API_BASE_URL } from '../api/endpoints';

const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

  return {
    user: {
      _id: response.data._id,
      username: response.data.username,
      email: response.data.email,
      isAdmin: response.data.isAdmin,
    },
    token: response.data.token,
  };
};

const register = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    email,
    password,
  });

  return {
    user: {
      _id: response.data._id,
      username: response.data.username,
      email: response.data.email,
      isAdmin: response.data.isAdmin,
    },
    token: response.data.token,
  };
};

const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { login, register, getMe };
