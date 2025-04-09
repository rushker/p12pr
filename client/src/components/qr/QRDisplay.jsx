import React from 'react';

const QRDisplay = ({ code }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = code;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your QR Code</h2>

      <div className="flex justify-center items-center bg-gray-100 p-4 rounded-md border border-gray-300">
        <img src={code} alt="QR Code" className="w-48 h-48 object-contain" />
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition"
      >
        Download QR
      </button>
    </div>
  );
};

export default QRDisplay;
