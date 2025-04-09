// pages/User/UserDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserQRCodes, deleteQRCode } from '../../services/qrService';
import { TrashIcon, QrCodeIcon, EyeIcon } from '@heroicons/react/24/outline';

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
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      try {
        await deleteQRCode(id);
        setQRCodes(qrCodes.filter(qr => qr._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your QR Codes</h1>
        <Link
          to="/generate-qr"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <QrCodeIcon className="h-5 w-5" />
          <span>Generate New QR</span>
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-600">You haven't generated any QR codes yet.</p>
          <Link
            to="/generate-qr"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Your First QR Code
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr._id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
              {qr.title && <h3 className="text-lg font-semibold mb-2">{qr.title}</h3>}
              <div className="flex justify-center mb-4">
                <img src={qr.qrCodeUrl} alt="QR Code" className="w-40 h-40" />
              </div>
              <div className="flex justify-between items-center">
                <Link
                  to={`/qr/${qr._id}`}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button
                  onClick={() => handleDelete(qr._id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
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