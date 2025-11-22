import axiosClient from '../api/axiosClient';

export interface BroadcastPayload {
  title: string;
  body: string;
}

const NotificationApi = {
  sendBroadcast: async (payload: BroadcastPayload): Promise<void> => {
    await axiosClient.post('/api/notifications/broadcast', payload);
  },
};

export default NotificationApi;
