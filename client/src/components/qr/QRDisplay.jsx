// src/components/qr/QRDisplay.jsx
import React from 'react';
import '../../../styles/variables.css';
import '../../../styles/QRGenerator.css';

const QRDisplay = ({ code }) => {
  return (
    <div className="qr-container p-6 rounded-xl">
      <div className="qr-code hover:shadow-lg">
        <img src={code} alt="QR Code" className="w-full h-full" />
      </div>
      <button 
        className="download-btn mt-6 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
      >
        Download QR
      </button>
    </div>
  );
};

export default QRDisplay;