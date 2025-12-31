import axiosClient from '../../../api/axiosClient';

export interface BroadcastPayload {
  title: string;
  body: string;
}

const NotificationApi = {
  sendBroadcast: async (payload: BroadcastPayload): Promise<void> => {
    await axiosClient.post('/api/notifications/broadcast', payload);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await axiosClient.get('/api/notifications/seller/unread-count');
    return response.data;
  },

  getSellerNotifications: async (): Promise<any[]> => {
    const response = await axiosClient.get('/api/notifications/seller');
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await axiosClient.patch(`/api/notifications/seller/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosClient.patch('/api/notifications/seller/read-all');
  },

  clearAllNotifications: async (): Promise<void> => {
    await axiosClient.delete('/api/notifications/seller/clear-all');
  },
};

export default NotificationApi;
