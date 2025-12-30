import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import API from '../Api';

export const useUser = () => {
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const userId = await SecureStore.getItemAsync('userId');
            if (!userId) return null;
            const response = await API.get(`/api/user/${userId}`);
            return response.data;
        },
    });

    const queryClient = useQueryClient();

    const updateUserMutation = useMutation({
        mutationFn: async ({ email, ...values }) => {
            const response = await API.put(`/users/updateUser`, {
                email,
                ...values,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        }
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        error: userQuery.error,
        refetch: userQuery.refetch,
        updateUser: updateUserMutation.mutateAsync,
        isUpdating: updateUserMutation.isPending
    };
};
