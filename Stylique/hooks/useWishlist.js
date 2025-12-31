import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/Api';
import Toast from 'react-native-toast-message';

export const useWishlist = (userId) => {
    const queryClient = useQueryClient();

    const checkWishlistQuery = (productId) => useQuery({
        queryKey: ['wishlist', 'check', userId, productId],
        queryFn: async () => {
            if (!userId || !productId) return { isInWishlist: false };
            const res = await API.get(`/wishlist/check/${userId}/${productId}`);
            return res.data;
        },
        enabled: !!userId && !!productId,
    });

    const useUserWishlist = () => useQuery({
        queryKey: ['wishlist', 'user', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await API.get(`/wishlist/user/${userId}`);
            return res.data || [];
        },
        enabled: !!userId,
    });

    const toggleWishlistMutation = useMutation({
        mutationFn: async ({ productId, isInWishlist }) => {
            if (isInWishlist) {
                await API.post('/wishlist/remove', { user_id: userId, productId });
            } else {
                await API.post('/wishlist/add', { user_id: userId, productId });
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', 'check', userId, variables.productId] });
            // Invalidate user wishlist list if we had one
            queryClient.invalidateQueries({ queryKey: ['wishlist', 'user', userId] });
        },
        onError: (e) => {
            console.error('Wishlist toggle error:', e?.response?.data || e.message);
        }
    });

    return {
        checkWishlist: checkWishlistQuery,
        useUserWishlist,
        toggleWishlist: toggleWishlistMutation.mutateAsync,
        isToggling: toggleWishlistMutation.isPending
    };
};
