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


  // Initialize auth state
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

     
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Login function - fixed to properly handle admin
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, ...userData } = await authLogin(email, password);
      localStorage.setItem('token', token);
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

  // Register function
  const register = async (...args) => {
    setLoading(true);
    try {
      const { token, ...userData } = await authRegister(...args);
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/dashboard');
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
   
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin,
      login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);