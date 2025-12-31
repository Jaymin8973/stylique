import { useQuery } from '@tanstack/react-query';
import API from '@/Api';

export const useSales = () => {
    const salesQuery = useQuery({
        queryKey: ['sales'],
        queryFn: async () => {
            const response = await API.get('/api/sales/public');
            return response.data || [];
        },
    });

    const useSaleDetail = (id) => useQuery({
        queryKey: ['sale', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await API.get(`/api/sales/public/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    return {
        sales: salesQuery.data || [],
        isLoading: salesQuery.isLoading,
        error: salesQuery.error,
        refetch: salesQuery.refetch,
        useSaleDetail,
    };
};
