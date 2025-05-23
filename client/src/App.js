// src/App.js
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // 👈 ADD THIS BACK
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/admin/AdminRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import GuestAutoDelete from './components/GuestAutoDelete';

import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import UserDashboard from './pages/User/UserDashboard';
import QRPage from './pages/User/QRPage';
import QRViewPage from './pages/QRViewPage';
import QRRedirect from './components/qr/QRRedirect';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <AuthProvider> 
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <GuestAutoDelete />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/qr/:id" element={<QRViewPage />} />
            <Route path="/redirect/:id" element={<QRRedirect />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/generate-qr" element={<QRPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
