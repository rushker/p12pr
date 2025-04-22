// client/src/services/notificationService.js
import axios from '../api/axiosConfig';

export const fetchMyNotifications = () => axios.get('/notifications', { withCredentials: true });
export const dismissNotification = (id) => axios.delete(`/notifications/${id}`, { withCredentials: true });
export const fetchAdminNotifications = () => axios.get('/notifications/admin', { withCredentials: true });
export const handleAdminNotification = (id, action) => axios.put(`/notifications/admin/${id}`, { action }, { withCredentials: true });
