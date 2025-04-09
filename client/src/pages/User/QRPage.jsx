import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQRCode } from '../../services/qrService';
import QRCode from 'react-qr-code';

const QRPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [qrCode, setQRCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', title);
      formData.append('description', description);

      const newQRCode = await generateQRCode(formData);
      setQRCode(newQRCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate QR Code</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {preview && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-64 rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {qrCode && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your QR Code</h2>
          <div className="flex flex-col items-center">
          <QRCode value={`${window.location.origin}/qr/${qrCode._id}`} size={200} />
            <p className="mt-4 text-gray-600">
              Scan this QR code to view your image
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRPage;