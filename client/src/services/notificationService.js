// client/src/services/notificationService.js
import axios from '../api/axiosConfig';

export const fetchMyNotifications   = () => axios.get('/notifications');
export const dismissNotification    = (id) => axios.delete(`/notifications/${id}`);
export const fetchAdminNotifications= () => axios.get('/notifications/admin');
export const handleAdminNotification= (id, action) => axios.put(`/notifications/admin/${id}`, { action });
