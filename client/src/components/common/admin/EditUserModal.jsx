// components/admin/EditUserModal.jsx
import React from 'react';

const EditUserModal = ({
  user,
  updatedUserData,
  setUpdatedUserData,
  onClose,
  onSave,
  isUpdating
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Edit User</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={updatedUserData.username || ''}
            onChange={e => setUpdatedUserData({ ...updatedUserData, username: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={updatedUserData.email || ''}
            onChange={e => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-gray-500">(leave blank to keep)</span>
          </label>
          <input
            type="password"
            value={updatedUserData.password || ''}
            onChange={e => setUpdatedUserData({ ...updatedUserData, password: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isUpdating}
            className={`px-4 py-2 text-sm rounded text-white ${
              isUpdating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUpdating ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
