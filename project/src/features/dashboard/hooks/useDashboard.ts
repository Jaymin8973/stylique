import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../services/api';

export const useDashboard = () => {
    const dashboardQuery = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => apiService.getDashboardStats(),
    });

    return {
        stats: dashboardQuery.data,
        isLoading: dashboardQuery.isLoading,
        isError: dashboardQuery.isError,
        error: dashboardQuery.error,
    };
};
