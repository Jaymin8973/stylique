import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

export const useOrders = () => {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: () => apiService.getOrders(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            apiService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order status updated');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update status');
        }
    });

    const shipOrderMutation = useMutation({
        mutationFn: ({ id, details }: { id: number; details: { courier: string; trackingNumber: string } }) =>
            apiService.shipOrder(id, details),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order shipped successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to ship order');
        }
    });

    // Helper to get a single order from cache or fetch list
    // Note: Since we fetch all orders, this is efficient for now
    const useOrder = (id: number) => {
        return useQuery({
            queryKey: ['orders', id],
            queryFn: async () => {
                const orders = await apiService.getOrders();
                const order = orders.find(o => o.id === id);
                if (!order) throw new Error('Order not found');
                return order;
            },
            initialData: () => {
                return queryClient.getQueryData<any[]>(['orders'])?.find(o => o.id === id);
            },
            enabled: !!id,
        });
    };

    const downloadInvoice = async (id: number) => {
        return apiService.downloadInvoiceUrl(id);
    };

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        error: ordersQuery.error,
        updateStatus: updateStatusMutation.mutateAsync,
        isUpdating: updateStatusMutation.isPending,
        shipOrder: shipOrderMutation.mutateAsync,
        isShipping: shipOrderMutation.isPending,
        refetch: ordersQuery.refetch,
        useOrder,
        downloadInvoice,
    };
};
