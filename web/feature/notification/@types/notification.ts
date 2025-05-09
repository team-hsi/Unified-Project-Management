export type NotificationType = "chat" | "project" | "workspace" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: {
    workspaceId?: string;
    projectId?: string;
    chatId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  getByType: (type: NotificationType) => Notification[];
}
