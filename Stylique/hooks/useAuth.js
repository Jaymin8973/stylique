import { useMutation } from '@tanstack/react-query';
import API from '../Api';

export const useAuth = () => {
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await API.post('/api/auth/login', credentials);
            return response.data;
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await API.post('/api/auth/register', userData);
            return response.data;
        },
    });

    const registerPushTokenMutation = useMutation({
        mutationFn: async ({ token, userToken }) => {
            const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
            const response = await API.post('/api/notifications/register', { token }, { headers });
            return response.data;
        },
    });

    const sendOtpMutation = useMutation({
        mutationFn: async (data) => {
            const response = await API.post('/api/user/sendOtp', data);
            return response.data;
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async (data) => {
            const response = await API.post('/api/user/verifyOtp', data);
            return response.data;
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async (data) => {
            const response = await API.patch('/api/user/resetPassword', data);
            return response.data;
        },
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerPushToken: registerPushTokenMutation.mutateAsync,
        sendOtp: sendOtpMutation.mutateAsync,
        isSendingOtp: sendOtpMutation.isPending,
        verifyOtp: verifyOtpMutation.mutateAsync,
        isVerifyingOtp: verifyOtpMutation.isPending,
        resetPassword: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending,
    };
};
