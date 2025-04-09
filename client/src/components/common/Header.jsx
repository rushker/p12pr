// components/common/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  QrCodeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <QrCodeIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">QRShare</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2 ml-4">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
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
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;