import { Link } from 'react-router-dom';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import '../styles/variables.css';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('404 Page visited:', window.location.pathname);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <FaceFrownIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          aria-label="Go to homepage"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition inline-block"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
