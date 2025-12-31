import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, SalePayload } from '../../../services/api';
import toast from 'react-hot-toast';

export const useSales = () => {
    const queryClient = useQueryClient();

    const salesQuery = useQuery({
        queryKey: ['sales'],
        queryFn: () => apiService.getSales(),
    });

    const createSaleMutation = useMutation({
        mutationFn: (payload: SalePayload) => apiService.createSale(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            toast.success('Sale created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create sale');
        }
    });

    return {
        sales: salesQuery.data || [],
        isLoading: salesQuery.isLoading,
        isError: salesQuery.isError,
        error: salesQuery.error,
        createSale: createSaleMutation.mutateAsync,
        isCreating: createSaleMutation.isPending,
        refetch: salesQuery.refetch,
    };
};
