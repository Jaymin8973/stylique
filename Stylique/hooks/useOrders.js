import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../Api';
import Toast from 'react-native-toast-message';

export const useOrders = (status = 'all') => {

    const ordersQuery = useQuery({
        queryKey: ['orders', status],
        queryFn: async () => {
            const endpoint = status && status !== 'all' ? `/api/orders?status=${status}` : '/api/orders';
            const response = await API.get(endpoint);
            return response.data || [];
        },
    });

    const useOrder = (id) => {
        return useQuery({
            queryKey: ['order', id],
            queryFn: async () => {
                const response = await API.get(`/api/orders/${id}`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    const queryClient = useQueryClient();

    const cancelOrderMutation = useMutation({
        mutationFn: async ({ orderId, reason }) => {
            await API.post(`/api/orders/${orderId}/cancel`, { reason });
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Order cancelled successfully' });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order'] });
        },
        onError: (e) => {
            Toast.show({ type: 'error', text1: e?.response?.data?.error || 'Failed to cancel order' });
        }
    });

    const returnOrderMutation = useMutation({
        mutationFn: async ({ orderId, reason }) => {
            await API.post(`/api/orders/${orderId}/return`, { reason });
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Return request submitted successfully' });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order'] });
        },
        onError: (e) => {
            Toast.show({ type: 'error', text1: e?.response?.data?.error || 'Failed to submit return request' });
        }
    });

    const createOrderMutation = useMutation({
        mutationFn: async (orderData) => {
            const response = await API.post('/api/orders', orderData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const useOrderDetail = (id) => useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            if (!id) return null;
            const res = await API.get(`/api/orders/${id}`);
            return res.data;
        },
        enabled: !!id,
        retry: false
    });

    const useTrackOrder = (trackingNumber) => useQuery({
        queryKey: ['order', 'track', trackingNumber],
        queryFn: async () => {
            if (!trackingNumber) return null;
            const res = await API.get(`/api/orders/track/${trackingNumber}`);
            return res.data;
        },
        enabled: !!trackingNumber,
        retry: false
    });

    const useInvoiceDetail = (orderId) => useQuery({
        queryKey: ['invoice', orderId],
        queryFn: async () => {
            if (!orderId) return null;
            const res = await API.get(`/api/orders/${orderId}/invoice`);
            return res.data;
        },
        enabled: !!orderId
    });

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        error: ordersQuery.error,
        refetch: ordersQuery.refetch,
        useOrderDetail,
        useTrackOrder,
        useInvoiceDetail,
        cancelOrder: cancelOrderMutation.mutateAsync,
        isCancelling: cancelOrderMutation.isPending,
        returnOrder: returnOrderMutation.mutateAsync,
        isReturning: returnOrderMutation.isPending,
        createOrder: createOrderMutation.mutateAsync,
        isCreating: createOrderMutation.isPending
    };
};
