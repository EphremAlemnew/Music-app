import axiosInstance from "../axiosInstance";

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (params?: {
  is_read?: boolean;
  notification_type?: string;
  ordering?: string;
}): Promise<{ results: Notification[]; count: number }> => {
  const response = await axiosInstance.get("notifications/", { params });
  return response.data;
};

export const markNotificationRead = async (id: number): Promise<void> => {
  await axiosInstance.post(`notifications/${id}/mark_read/`);
};

export const markAllNotificationsRead = async (
  notificationIds?: number[]
): Promise<void> => {
  await axiosInstance.post("notifications/mark_all_read/", {
    notification_ids: notificationIds,
  });
};

export const getUnreadCount = async (): Promise<{ unread_count: number }> => {
  const response = await axiosInstance.get("notifications/unread_count/");
  return response.data;
};
