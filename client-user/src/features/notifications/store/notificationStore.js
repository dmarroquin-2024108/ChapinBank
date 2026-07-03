import { create } from 'zustand';
import {
  getMyNotificationsRequest,
  markNotificationReadRequest,
} from '../../../shared/api/notifications.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await getMyNotificationsRequest();
      set({
        notifications: data.data || [],
        unreadCount: data.unread || 0,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al cargar notificaciones');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await markNotificationReadRequest(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al marcar notificación');
      set({ error: message });
      return { success: false, error: message };
    }
  },

  markAllAsRead: async () => {
    const unread = get().notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => markNotificationReadRequest(n._id)));
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));
