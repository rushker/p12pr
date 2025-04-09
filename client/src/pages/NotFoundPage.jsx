import { Link } from 'react-router-dom';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('404 Page visited:', window.location.pathname);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <FaceFrownIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
