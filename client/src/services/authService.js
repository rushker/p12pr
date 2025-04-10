// services/authService.js
import axios from '../api/axiosConfig';

// Login
const login = async (email, password) => {
  const response = await axios.post(`/auth/login`, {
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
  const response = await axios.post(`/auth/register`, {
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
  const response = await axios.get(`/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export { login, register, getMe };
