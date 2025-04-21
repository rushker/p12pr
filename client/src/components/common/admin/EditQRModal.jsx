// components/admin/EditQRModal.jsx
import React, { useState, useEffect } from 'react';

const EditQRModal = ({ qrCode, onClose, onSave }) => {
  const [updatedQRCode, setUpdatedQRCode] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (qrCode) {
      setUpdatedQRCode({
        title: qrCode.title || '',
        description: qrCode.description || ''
      });
    }
  }, [qrCode]);

  const handleSave = () => {
    onSave(updatedQRCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Edit QR Code</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={updatedQRCode.title}
            onChange={(e) => setUpdatedQRCode({ ...updatedQRCode, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={updatedQRCode.description}
            onChange={(e) => setUpdatedQRCode({ ...updatedQRCode, description: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQRModal;
