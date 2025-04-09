// pages/User/QRViewPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQRCodeById } from '../services/qrService';
import QRCode from 'react-qr-code';

const QRViewPage = () => {
  const { id } = useParams();
  const [qrData, setQRData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const data = await getQRCodeById(id);
        setQRData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'QR Code not found');
      }
    };
    fetchQR();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading QR Code...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{qrData.title || 'QR Code Viewer'}</h1>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
          <QRCode value={window.location.href} size={200} />

          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Linked Image:</h2>
            <img
              src={qrData.imageUrl}
              alt="Uploaded"
              className="w-full max-h-[400px] object-contain rounded border"
            />
          </div>
        </div>

        {qrData.description && (
          <p className="mt-6 text-gray-600 italic">{qrData.description}</p>
        )}
      </div>
    </div>
  );
};

export default QRViewPage;
