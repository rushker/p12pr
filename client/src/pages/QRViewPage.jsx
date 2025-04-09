import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQRCodeById } from '../services/qrService';
import '../styles/variables.css'; 
const QRViewPage = () => {
  const { id } = useParams();
  const [qrCode, setQRCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const data = await getQRCodeById(id);
        setQRCode(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {qrCode.title && (
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{qrCode.title}</h1>
        )}
        
        <div className="flex justify-center mb-6">
          <img
            src={qrCode.imageUrl}
            alt={qrCode.title || 'QR Code Image'}
            className="max-w-full h-auto max-h-96 rounded-md"
          />
        </div>

        {qrCode.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600">{qrCode.description}</p>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Shared by: {qrCode.user?.username || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default QRViewPage;