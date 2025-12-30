import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import API from '../Api';

export const useAddress = () => {
    const addressQuery = useQuery({
        queryKey: ['address'],
        queryFn: async () => {
            const response = await API.get('/api/address');
            return response.data || [];
        },
    });

    const queryClient = useQueryClient();

    const addAddressMutation = useMutation({
        mutationFn: async (payload) => {
            const response = await API.post('/api/address', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['address']);
            Toast.show({ type: 'success', text1: 'Address added' });
        },
        onError: (e) => {
            Toast.show({
                type: 'error',
                text1: e?.response?.data?.message || e?.response?.data?.error || 'Failed to add address'
            });
        }
    });

    const updateAddressMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const response = await API.patch(`/api/address/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['address']);
            Toast.show({ type: 'success', text1: 'Address updated' });
        },
        onError: (e) => {
            Toast.show({
                type: 'error',
                text1: e?.response?.data?.message || e?.response?.data?.error || 'Failed to update address'
            });
        }
    });

    const setDefaultAddressMutation = useMutation({
        mutationFn: async (id) => {
            const response = await API.patch(`/api/address/${id}/default`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['address']);
        },
        onError: (e) => {
            Toast.show({
                type: 'error',
                text1: e?.response?.data?.message || e?.response?.data?.error || 'Failed to set default address'
            });
            throw e;
        }
    });

    return {
        addresses: addressQuery.data || [],
        isLoading: addressQuery.isLoading,
        error: addressQuery.error,
        refetch: addressQuery.refetch,
        defaultAddress: (addressQuery.data || []).find((a) => a.isDefault) || (addressQuery.data || [])[0] || null,
        addAddress: addAddressMutation.mutateAsync,
        updateAddress: updateAddressMutation.mutateAsync,
        setDefaultAddress: setDefaultAddressMutation.mutateAsync,
        isAdding: addAddressMutation.isPending,
        isUpdating: updateAddressMutation.isPending,
        isSettingDefault: setDefaultAddressMutation.isPending
    };
};
