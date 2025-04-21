// components/admin/UserManager.jsx
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const UserManager = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Username</th>
            <th className="px-6 py-3 text-left font-semibold">Email</th>
            <th className="px-6 py-3 text-left font-semibold">Status</th>
            <th className="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4 text-gray-500">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button onClick={() => onEdit(user)} className="text-blue-600 hover:text-blue-800">
                  <PencilIcon className="h-5 w-5 inline" />
                </button>
                <button onClick={() => onDelete(user._id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-5 w-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
