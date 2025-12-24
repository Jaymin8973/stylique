import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import IpAddress from '../../Config.json';

const ForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const ValidationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const API = axios.create({
    baseURL: `http://${IpAddress.IpAddress}:5001`,
  });

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await API.post(`api/user/sendOtp`, values);
        Toast.show({
          type: 'success',
          text1: 'Verification Code Sent',
          text2: 'Check your email for the OTP code'
        });
        router.push({
          pathname: 'Verification',
          params: { email: values.email },
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Send Code',
          text2: error.response?.data?.message || 'Please try again'
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Forgot Password?
          </Text>
          <Text className="text-base text-gray-500 text-center mt-3 px-4">
            Don't worry! Enter your email address and we'll send you a verification code to reset your password
          </Text>
        </View>

        {/* Email Input Section */}
        <View className="mt-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </Text>
          <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'
            }`}>
            <Fontisto name="email" size={20} color="#6B7280" />
            <TextInput
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              autoFocus
              autoCapitalize="none"
              editable={!loading}
              value={formik.values.email}
              onBlur={formik.handleBlur('email')}
              onChangeText={formik.handleChange('email')}
            />
            {formik.values.email.length > 0 && !loading && (
              <TouchableOpacity onPress={() => formik.setFieldValue('email', '')}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          {formik.touched.email && formik.errors.email && (
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-500 ml-1 text-sm">{formik.errors.email}</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-8 py-4 rounded-2xl ${formik.isValid && formik.values.email && !loading ? 'bg-black' : 'bg-gray-300'
            }`}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || !formik.values.email || loading}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white text-center text-base font-bold ml-2">
                Sending Code...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center text-base font-bold">
              Send Verification Code
            </Text>
          )}
        </TouchableOpacity>

        {/* Info Section */}
        <View className="mt-8 bg-blue-50 p-4 rounded-2xl">
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-sm text-gray-700 font-semibold mb-1">
                Security Tips
              </Text>
              <Text className="text-sm text-gray-600">
                • Make sure you have access to this email{'\n'}
                • Check your spam folder if you don't see the email{'\n'}
                • The code will expire in 10 minutes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPassword;