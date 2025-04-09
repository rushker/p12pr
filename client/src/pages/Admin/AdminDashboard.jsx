import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/AdminDashboard.css';

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
    <div className="admin-dashboard container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="stats mb-4 d-flex gap-4">
        <div className="stat-box p-3 bg-light rounded shadow-sm">
          <h5>Total Users</h5>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-box p-3 bg-light rounded shadow-sm">
          <h5>Total QR Codes</h5>
          <p>{totalQRCodes}</p>
        </div>
      </div>

      <h4 className="mt-4">Recent QR Codes</h4>
      <ul className="list-group mb-5">
        {recentQRCodes.map((qr) => (
          <li key={qr._id} className="list-group-item">
            <strong>{qr.name || 'Unnamed QR'}</strong> — Uploaded by {qr.user?.email || 'N/A'}
          </li>
        ))}
      </ul>

      <h4>Edit Users</h4>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.name} ({user.email})</span>
            <button className="btn btn-sm btn-primary" onClick={() => openEditModal(user)}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedUserData.name}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUserUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
