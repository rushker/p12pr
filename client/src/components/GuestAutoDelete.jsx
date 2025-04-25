//src/components/qr/GuestAutoDelete.jsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // adjust path as needed

const GuestAutoDelete = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleUnload = () => {
      if (user?.isGuest) {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/guest/${user._id}`;
        navigator.sendBeacon(url);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [user]);

  return null;
};

export default GuestAutoDelete;
