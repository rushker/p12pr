// client/src/contexts/AuthContext.js
import axiosInstance from '../api/axios/axiosConfig';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return setLoading(false);
      }

      if (!token) return setLoading(false);

      try {
        const me = await getMe();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Handle guest cleanup on tab/window close
  useEffect(() => {
    const handleUnload = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.isGuest) {
        navigator.sendBeacon(`${process.env.REACT_APP_API_BASE_URL}/auth/guest/${user._id}`);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, ...userData } = await authLogin(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate(userData.isAdmin ? '/admin' : '/dashboard');
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (...args) => {
    setLoading(true);
    try {
      const { token, ...userData } = await authRegister(...args);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard');
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Logout with guest deletion
  const logout = async () => {
    console.log('[Logout triggered]');
    console.log('User:', user);
  
    if (user?.isGuest) {
      console.log(`Attempting to delete guest user: ${user._id}`);
      try {
        const response = await axiosInstance.delete(`/api/auth/guest/${user._id}`);
        console.log('Guest deleted:', response.data);
  
        // Only after successful deletion, clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      } catch (error) {
        console.error('Error deleting guest:', error.response?.data || error.message);
        alert('Failed to delete guest account. Please try again.');
        // Optionally, still logout even if guest deletion fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      }
    } else {
      console.log('Not a guest user. Skipping guest deletion.');
  
      // Normal logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin,
        login,
        register, 
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
