import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import NotificationApi, { BroadcastPayload } from '../services/notificationApi';

export const useNotifications = () => {
    const queryClient = useQueryClient();

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

    const unreadCountQuery = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: NotificationApi.getUnreadCount,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const notificationsQuery = useQuery({
        queryKey: ['notifications', 'seller'],
        queryFn: NotificationApi.getSellerNotifications,
    });

    const markAsReadMutation = useMutation({
        mutationFn: NotificationApi.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'seller'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: NotificationApi.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'seller'] });
        },
    });

    const clearAllNotificationsMutation = useMutation({
        mutationFn: NotificationApi.clearAllNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'seller'] });
            toast.success('All notifications cleared');
        },
        onError: () => {
            toast.error('Failed to clear notifications');
        }
    });

    return {
        sendBroadcast: broadcastMutation.mutateAsync,
        isSending: broadcastMutation.isPending,
        error: broadcastMutation.error,
        unreadCount: unreadCountQuery.data?.count || 0,
        notifications: notificationsQuery.data || [],
        isLoadingNotifications: notificationsQuery.isLoading,
        markAsRead: markAsReadMutation.mutateAsync,
        markAllAsRead: markAllAsReadMutation.mutateAsync,
        clearAllNotifications: clearAllNotificationsMutation.mutateAsync,
    };
};
