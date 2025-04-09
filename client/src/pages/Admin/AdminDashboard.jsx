import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch admin stats from the backend
    const fetchStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalUsers: 42,
          totalQRCodes: 128,
          recentQRCodes: 15,
        });
      } catch (err) {
        setError('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total QR Codes</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalQRCodes}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent QR Codes (7d)</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.recentQRCodes}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, {user?.username}</h2>
        <p className="text-gray-600">
          You have admin privileges to manage the application.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;