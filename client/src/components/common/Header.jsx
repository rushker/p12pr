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
  const auth = useAuth();

  if (!auth) return null;

  const { user, logout, isAuthenticated, isAdmin } = auth;

  // Handle guest deletion on logout
  const handleLogout = async () => {
    if (user?.isGuest) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/guest/${user._id}`, {
          method: 'POST',
        });

        if (res.ok) {
          console.log('✅ Guest account deleted');
        } else {
          console.error('❌ Failed to delete guest account');
        }
      } catch (error) {
        console.error('⚠️ Error during guest deletion:', error);
      }
    }

    logout(); // Proceed with logout
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <QrCodeIcon className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">P12Pr</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition"
                >
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2 ml-4">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
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
