// client/src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const { user: userData, token } = await authLogin(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      navigate(userData.isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register user
  const register = async (username, email, password) => {
    try {
      const { user: userData, token } = await authRegister(username, email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);