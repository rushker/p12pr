import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateImageQRCode, generateLinkQRCode } from '../../services/qrService';
import QRCode from 'react-qr-code';

const QRPage = () => {
  const [mode, setMode] = useState('image'); // 'image' or 'link'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [qrCode, setQRCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    setError('');
    setSuccess(false);
    setQRCode(null);

    if (mode === 'image' && !image) {
      setError('Please select an image');
      return;
    }

    if (mode === 'link' && !link.trim()) {
      setError('Please enter a valid link');
      return;
    }

    try {
      setLoading(true);

      let newQRCode;
      if (mode === 'image') {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('description', description);
        newQRCode = await generateImageQRCode(formData);
      } else {
        newQRCode = await generateLinkQRCode({ link, title, description });
      }

      setQRCode(newQRCode);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Generate a QR Code</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setMode('image')}
          className={`px-4 py-2 rounded-l-md ${mode === 'image' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Image
        </button>
        <button
          onClick={() => setMode('link')}
          className={`px-4 py-2 rounded-r-md ${mode === 'link' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Link
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
          QR Code generated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="My QR Code"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Details about this QR code..."
          ></textarea>
        </div>

        {mode === 'image' ? (
          <>
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {preview && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Image Preview</h3>
                <img src={preview} alt="Preview" className="max-w-full h-auto max-h-64 rounded-md shadow" />
              </div>
            )}
          </>
        ) : (
          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-1">
              Enter Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {qrCode && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your QR Code</h2>
          <QRCode value={`${window.location.origin}/qr/${qrCode._id}`} size={180} />
          <p className="mt-4 text-gray-600 text-sm">Scan to view the {mode === 'link' ? 'link' : 'image'}</p>
        </div>
      )}
    </div>
  );
};

export default QRPage;
