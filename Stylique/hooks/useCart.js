import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/Api';
import Toast from 'react-native-toast-message';

export const useCart = () => {
    const queryClient = useQueryClient();

    const cartQuery = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await API.get('/api/cart');
            return response.data?.items || [];
        },
    });

    const addToCartMutation = useMutation({
        mutationFn: async (payload) => {
            const response = await API.post('/api/cart/add', payload);
            return response.data;
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Added to cart' });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error) => {
            Toast.show({ type: 'error', text1: 'Failed to add to cart' });
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: async ({ itemId, quantity }) => {
            const response = await API.patch(`/api/cart/item/${itemId}`, { quantity });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: () => {
            Toast.show({ type: 'error', text1: 'Failed to update quantity' });
        }
    });

    const removeFromCartMutation = useMutation({
        mutationFn: async (itemId) => {
            await API.delete(`/api/cart/item/${itemId}`);
        },
        onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Removed from cart' });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: () => {
            Toast.show({ type: 'error', text1: 'Failed to remove item' });
        }
    });

    const checkInCart = (productId) => {
        if (!cartQuery.data) return false;
        return cartQuery.data.some((item) => {
            const pid = item.productId ?? item.product?.id ?? item.product?.productId;
            return String(pid) === String(productId);
        });
    }

    return {
        cartItems: cartQuery.data || [],
        isLoading: cartQuery.isLoading,
        addToCart: addToCartMutation.mutateAsync,
        isAdding: addToCartMutation.isPending,
        updateQuantity: updateQuantityMutation.mutateAsync,
        isUpdating: updateQuantityMutation.isPending,
        removeFromCart: removeFromCartMutation.mutateAsync,
        isRemoving: removeFromCartMutation.isPending,
        checkInCart
    };
};
