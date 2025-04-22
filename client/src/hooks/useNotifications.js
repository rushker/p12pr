// client/src/hooks/useNotifications.js
import { create } from 'zustand'; 
import { fetchMyNotifications, dismissNotification } from '../services/notificationService';

export const useNotifications = create(set => ({
  list: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading:true });
    try {
      const { data } = await fetchMyNotifications();
      set({ list:data });
    } catch(e) {
      set({ error:e.message });
    } finally {
      set({ loading:false });
    }
  },
  dismiss: async (id) => {
    await dismissNotification(id);
    set(state => ({ list: state.list.filter(n => n._id !== id) }));
  }
}));
