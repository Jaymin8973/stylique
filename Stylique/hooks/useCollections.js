import { useQuery } from '@tanstack/react-query';
import API from '@/Api';

export const useCollections = () => {
    const collectionsQuery = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const response = await API.get('/api/collections/public');
            return response.data || [];
        },
    });

    const useCollectionDetail = (id) => useQuery({
        queryKey: ['collection', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await API.get(`/api/collections/public/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    return {
        collections: collectionsQuery.data || [],
        isLoading: collectionsQuery.isLoading,
        error: collectionsQuery.error,
        refetch: collectionsQuery.refetch,
        useCollectionDetail,
    };
};
