// client/src/pages/Auth/ForgotPasswordPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { forgotPassword } from '../../services/authService';
import { initializeSocket, getSocket } from '../../utils/socket';

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [userId, setUserId]     = useState(null);
  const navigate                = useNavigate();

  // Ensure socket is ready
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) initializeSocket(token);
  }, []);

  // Join the user's room & listen for approval
  useEffect(() => {
    const sock = getSocket();
    if (sock && userId) {
      sock.emit('join-room', userId);
      sock.on('reset-approved', ({ link }) => {
        navigate(link);
      });
    }
    return () => {
      const s = getSocket();
      if (s) s.off('reset-approved');
    };
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      const { message, userId } = await forgotPassword(email);
      setMessage(message);
      setUserId(userId);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}
      {error   && <div className="mb-4 p-3 bg-red-100   text-red-800   rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded-lg ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remembered?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
