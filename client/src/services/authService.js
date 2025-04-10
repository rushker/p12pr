// services/authService.js
import axios from '../api/axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Login
const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
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

// Register
const register = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
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

// Get current user
const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { login, register, getMe };
