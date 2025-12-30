import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../Api';
import Toast from 'react-native-toast-message';

export const usePayment = () => {
    const queryClient = useQueryClient();

    const addPaymentCardMutation = useMutation({
        mutationFn: async (payload) => {
            const response = await API.post('/payment-cards/add', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['paymentCards']);
            Toast.show({
                type: 'success',
                text1: 'Card Added Successfully',
                text2: 'Your card has been added!'
            });
        },
        onError: (error) => {
            // Error handling is usually done in component for specific alerts, but we can do generic here
            // Using re-throw to let component handle specific UI if needed, or handle here.
            // Component currently shows alert.
            throw error;
        }
    });

    return {
        addPaymentCard: addPaymentCardMutation.mutateAsync,
        isAddingCard: addPaymentCardMutation.isPending
    };
};
