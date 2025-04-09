// client/src/components/common/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, UserCircleIcon, QrCodeIcon, HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <QrCodeIcon className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">QRShare</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {user?.isAdmin && (
                <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                <HomeIcon className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-indigo-600">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;