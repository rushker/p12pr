import { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import {
  UsersIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import QRManager from '../../components/common/admin/QRManager';
import UserManager from '../../components/common/admin/UserManager';
import EditUserModal from '../../components/common/admin/EditUserModal';
import EditQRModal from '../../components/common/admin/EditQRModal';
import StatCard from '../../components/common/admin/StatCard';
import SectionCard from '../../components/common/admin/SectionCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQRCodes: 0,
    recentQRCodes: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditQRModal, setShowEditQRModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [updatedQRData, setUpdatedQRData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, qrRes, recentQRRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/qr-codes/count'),
        axios.get('/admin/qr-codes/recent')
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

  // Edit User Modal
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({ username: user.username, email: user.email });
    setShowEditUserModal(true);
  };

  const handleUserUpdate = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/admin/users/${selectedUser._id}`, updatedUserData);
      setShowEditUserModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit QR Modal
  const openEditQRModal = (qr) => {
    setSelectedQR(qr);
    setUpdatedQRData({ title: qr.title, description: qr.description });
    setShowEditQRModal(true);
  };

  const handleQRUpdate = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/admin/qr-codes/${selectedQR._id}`, updatedQRData);
      setShowEditQRModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update QR code:', err);
      setError(err.response?.data?.message || 'Failed to update QR code');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Delete QR Code
  const handleDeleteQR = async (qrId) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    try {
      await axios.delete(`/admin/qr-codes/${qrId}`);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete QR code');
    }
  };

  const closeModal = () => {
    setShowEditUserModal(false);
    setShowEditQRModal(false);
    setSelectedUser(null);
    setSelectedQR(null);
    setUpdatedUserData({});
    setUpdatedQRData({});
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
          <QRManager qrCodes={stats.recentQRCodes} onEdit={openEditQRModal} onDelete={handleDeleteQR} />
        </SectionCard>

        {/* User Management */}
        <SectionCard title="User Management" icon={<UsersIcon className="h-5 w-5 text-gray-500" />}>
          <UserManager users={stats.users} onEdit={openEditUserModal} onDelete={handleDeleteUser} />
        </SectionCard>
      </div>

      {/* Edit Modals */}
      {showEditUserModal && (
        <EditUserModal
          user={selectedUser}
          updatedUserData={updatedUserData}
          setUpdatedUserData={setUpdatedUserData}
          onClose={closeModal}
          onSave={handleUserUpdate}
          isUpdating={isUpdating}
        />
      )}

      {showEditQRModal && (
        <EditQRModal
          qr={selectedQR}
          updatedQRData={updatedQRData}
          setUpdatedQRData={setUpdatedQRData}
          onClose={closeModal}
          onSave={handleQRUpdate}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
