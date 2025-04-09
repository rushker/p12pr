import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserQRCodes, deleteQRCode } from '../../services/qrService';
import QRCode from 'react-qr-code';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const data = await getUserQRCodes();
        setQRCodes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteQRCode(id);
      setQRCodes(qrCodes.filter((qr) => qr._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your QR Codes</h1>
        <Link
          to="/generate-qr"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Generate New QR
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          You haven't generated any QR codes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr._id} className="bg-white p-4 rounded-lg shadow-md">
              {qr.title && <h3 className="text-lg font-semibold mb-2">{qr.title}</h3>}
              <div className="flex justify-center mb-4">
              <QRCode value={`${window.location.origin}/qr/${qr._id}`} size={128} />
              </div>
              <div className="flex justify-between items-center">
                <Link
                  to={`/qr/${qr._id}`}
                  className="text-indigo-600 hover:underline flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View
                </Link>
                <button
                  onClick={() => handleDelete(qr._id)}
                  className="text-red 600 hover:underline flex items-center">
                <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                </button>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
);
};

export default UserDashboard;   