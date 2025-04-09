import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

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
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  );
};

export default HomePage;
