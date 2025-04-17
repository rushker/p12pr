import { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import {
  UsersIcon,
  QrCodeIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

console.log('🤖 axios baseURL =', axios.defaults.baseURL);
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQRCodes: 0,
    recentQRCodes: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, qrRes, recentQRRes] = await Promise.all([
        axios.get(`/admin/users`),
        axios.get(`/admin/qr-codes/count`),
        axios.get(`/admin/qr-codes/recent`)
      ]);

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalQRCodes: qrRes.data?.count || 0,
        recentQRCodes: recentQRRes.data || [],
        users: usersRes.data || []
      });
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      username: user.username,
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleUserUpdate = async () => {
    try {
      setIsUpdating(true);
      const payload = { username: updatedUserData.username, email: updatedUserData.email };
      if (updatedUserData.password) payload.password = updatedUserData.password;
      await axios.put(`/admin/users/${selectedUser._id}`, updatedUserData);
      setShowEditModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user with ID:', userId);
    console.log('🤖 about to DELETE →', axios.defaults.baseURL + `/admin/users/${userId}`);
  
    if (!window.confirm('Are you sure you want to delete this user?')) return;
  
    try {
      const resp = await axios.delete(`/admin/users/${userId}`);
      console.log('Delete successful:', resp.data);
      await fetchDashboardData();
    } catch (err) {
      // More detailed logging:
      console.error('Axios error object:', err);
      if (err.response) {
        console.error('→ Status:', err.response.status);
        console.error('→ Body:', err.response.data);
        setError(
          err.response.data.message ||
          `Failed to delete user (status ${err.response.status})`
        );
      } else {
        setError(err.message);
      }
    }
  };
  

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setUpdatedUserData({});
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="h-10 w-10 mx-auto text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-red-800">Error loading dashboard</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of system stats and user management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<UsersIcon className="h-6 w-6 text-white" />} value={stats.totalUsers} label="Total Users" color="blue" />
          <StatCard icon={<QrCodeIcon className="h-6 w-6 text-white" />} value={stats.totalQRCodes} label="Total QR Codes" color="green" />
          <StatCard icon={<ClockIcon className="h-6 w-6 text-white" />} value={stats.recentQRCodes.length} label="Recent QR Codes" color="purple" />
        </div>

        {/* Recent QR Codes */}
        <SectionCard title="Recent QR Codes" icon={<QrCodeIcon className="h-5 w-5 text-gray-500" />}>
          {stats.recentQRCodes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stats.recentQRCodes.map((qr) => (
                <li key={qr._id} className="px-6 py-4">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">{qr.title || 'Untitled QR Code'}</span>
                    <span className="text-gray-500">By: {qr.user?.email || 'Unknown'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">No recent QR codes found.</div>
          )}
        </SectionCard>

        {/* User Management */}
        <SectionCard title="User Management" icon={<UsersIcon className="h-5 w-5 text-gray-500" />}>
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
                {stats.users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5 inline" />
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold">Edit User</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={updatedUserData.username}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, username: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
              <input
                type="password"
                value={updatedUserData.password}
                onChange={e => setUpdatedUserData({ ...updatedUserData, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleUserUpdate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
    <div className={`p-3 rounded-md bg-${color}-500`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

// Reusable SectionCard component
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="px-4 py-5 border-b border-gray-200 flex items-center space-x-2">
      {icon}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div>{children}</div>
  </div>
);

export default AdminDashboard;
