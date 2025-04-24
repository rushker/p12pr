// src/components/qr/QRRedirect.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import publicAxios from '../../api/axios/publicAxios';

const QRRedirect = () => {
  const { id } = useParams();

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      try {
        await publicAxios.get(`/qr/redirect/${id}`);
        // This will be redirected from the backend, no need to handle originalUrl here
      } catch (err) {
        console.error('Redirect failed:', err);
        window.location.href = '/not-found';
      }
    };

    redirectToOriginalUrl();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
      Redirecting...
    </div>
  );
};

export default QRRedirect;
