import { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL;

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQRCodes, setTotalQRCodes] = useState(0);
  const [recentQRCodes, setRecentQRCodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});

  const fetchDashboardData = async () => {
    try {
      const [usersRes, qrRes, recentQRRes] = await Promise.all([
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/qr-codes/count`),
        axios.get(`${API}/admin/qr-codes/recent`)
      ]);

      setUsers(usersRes.data);
      setTotalUsers(usersRes.data.length);
      setTotalQRCodes(qrRes.data.count);
      setRecentQRCodes(recentQRRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({ name: user.name, email: user.email });
    setShowEditModal(true);
  };

  const handleUserUpdate = async () => {
    try {
      await axios.put(`${API}/admin/users/${selectedUser._id}`, updatedUserData);
      setShowEditModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <h5 className="text-lg font-semibold text-gray-700">Total Users</h5>
          <p className="text-2xl mt-2 text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <h5 className="text-lg font-semibold text-gray-700">Total QR Codes</h5>
          <p className="text-2xl mt-2 text-blue-600">{totalQRCodes}</p>
        </div>
      </div>

      {/* Recent QR Codes */}
      <div className="mb-10">
        <h4 className="text-xl font-semibold mb-4">Recent QR Codes</h4>
        <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
          {recentQRCodes.map((qr) => (
            <li key={qr._id} className="px-4 py-3">
              <span className="font-medium text-gray-700">{qr.name || 'Unnamed QR'}</span>
              <span className="text-sm text-gray-500 block">Uploaded by {qr.user?.email || 'N/A'}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Users */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Edit Users</h4>
        <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user._id} className="flex justify-between items-center px-4 py-3">
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => openEditModal(user)}
                className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={updatedUserData.name}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUserUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
