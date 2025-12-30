import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../Api';

export const useProducts = () => {
    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await API.get('api/products/all');
            return response.data;
        },
    });

    const useProduct = (id) => {
        return useQuery({
            queryKey: ['product', id],
            queryFn: async () => {
                const response = await API.get(`api/products/${id}`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    const useSubCategoryProducts = (subcategory) => {
        return useQuery({
            queryKey: ['products', 'subcategory', subcategory],
            queryFn: async () => {
                // Keeping existing POST method as per original code
                const response = await API.post('api/products/subcat', { subcategory });
                return response.data;
            },
            enabled: !!subcategory,
        });
    };

    const useProductRating = (productId) => {
        return useQuery({
            queryKey: ['rating', productId],
            queryFn: async () => {
                const response = await API.get(`/rating/${productId}`);
                return response.data || { avgRating: 0, totalCount: 0 };
            },
            enabled: !!productId,
        });
    };

    const useRecommendations = (id) => {
        return useQuery({
            queryKey: ['recommendations', id],
            queryFn: async () => {
                const res = await API.get(`/api/products/recommendations/${id}`);
                return res.data || [];
            },
            enabled: !!id
        });
    };

    const useCategoryCounts = () => {
        return useQuery({
            queryKey: ['categoryCounts'],
            queryFn: async () => {
                const response = await API.get('api/products/categoryCounts');
                return response.data || { clothing: [], footwear: [], accessories: [] };
            }
        });
    };


    const submitRatingMutation = useMutation({
        mutationFn: async ({ productId, rating, comment }) => {
            const response = await API.post(`/rating/${productId}`, { rating, comment });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate product queries or ratings
            queryClient.invalidateQueries({ queryKey: ['product'] }); // Updated to use queryKey object
            queryClient.invalidateQueries({ queryKey: ['rating'] }); // Invalidate ratings as well
        }
    });

    return {
        products: productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        error: productsQuery.error,
        refetch: productsQuery.refetch,
        useProduct,
        useProductRating,
        useRecommendations,
        useSubCategoryProducts,
        useCategoryCounts,
        submitRating: submitRatingMutation.mutateAsync,
        isSubmittingRating: submitRatingMutation.isPending
    };
};
