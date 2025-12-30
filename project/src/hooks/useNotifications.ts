import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import NotificationApi, { BroadcastPayload } from '../services/notificationApi';

export const useNotifications = () => {
    const broadcastMutation = useMutation({
        mutationFn: (payload: BroadcastPayload) => NotificationApi.sendBroadcast(payload),
        onSuccess: () => {
            toast.success('Notification sent to all active users');
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.error || error?.message || 'Failed to send notification';
            toast.error(msg);
        }
    });

    return {
        sendBroadcast: broadcastMutation.mutateAsync,
        isSending: broadcastMutation.isPending,
        error: broadcastMutation.error
    };
};
