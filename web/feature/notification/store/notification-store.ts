import { create } from "zustand";
import {
  Notification,
  NotificationState,
  NotificationType,
} from "../@types/notification";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  getByType: (type: NotificationType) => {
    return get().notifications.filter(
      (notification) => notification.type === type
    );
  },
}));
