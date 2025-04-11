import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const HomePage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Debug logs on load
  useEffect(() => {
    console.log('👤 Authenticated:', isAuthenticated);
    console.log('👑 Is Admin:', isAdmin);
    console.log('📦 User:', user);
  }, [isAuthenticated, isAdmin, user]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to QRShare</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-xl">
        Easily generate QR codes for your images and share them with the world.
        Upload once, share anywhere — no links or downloads required.
      </p>

      {!isAuthenticated ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>

          {/* 👇 Debug: Manually test admin redirect */}
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Go to Admin (Debug)
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
