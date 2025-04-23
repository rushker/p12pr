// client/src/components/user/QRDisplay.jsx
import React from 'react';

export default function QRDisplay({ qrDataUrl }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow text-center">
      <h2 className="text-xl font-bold mb-4">Your QR Code</h2>
      <div className="inline-block bg-gray-100 p-4 rounded border">
        <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
      </div>
      <button
        onClick={handleDownload}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded"
      >
        Download
      </button>
    </div>
  );
}