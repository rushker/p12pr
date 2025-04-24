import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';

const QRRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // We expect this route to be handled by the backend redirect logic
        const response = await axios.get(`/qr/redirect/${id}`, {
          // Allow redirects to go through
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 400,
        });
        // If backend doesn't handle redirect (unlikely), fallback
        if (response?.data?.url) {
          window.location.href = response.data.url;
        }
      } catch (err) {
        navigate('/'); // fallback to home if error
      }
    };

    handleRedirect();
  }, [id, navigate]);

  return <div>Redirecting...</div>;
};

export default QRRedirect;
