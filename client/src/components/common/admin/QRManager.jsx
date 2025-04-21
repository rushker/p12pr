// components/admin/QRManager.jsx
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const QRManager = ({ qrCodes, onEdit, onDelete }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {qrCodes.map((qr) => (
        <li key={qr._id} className="px-6 py-4 flex justify-between items-center text-sm text-gray-700">
          <div>
            <span className="font-medium">{qr.title || 'Untitled QR Code'}</span>
            <span className="ml-4 text-gray-500">By: {qr.user?.email || 'Unknown'}</span>
          </div>
          <div className="space-x-2">
            <button onClick={() => onEdit(qr)} className="text-blue-600 hover:text-blue-800">
              <PencilIcon className="h-5 w-5 inline" />
            </button>
            <button onClick={() => onDelete(qr._id)} className="text-red-600 hover:text-red-800">
              <TrashIcon className="h-5 w-5 inline" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default QRManager;
