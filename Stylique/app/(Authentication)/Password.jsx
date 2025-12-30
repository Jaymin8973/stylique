import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PasswordChangedPopup from "./PasswordChangedPopup";

import { useAuth } from '../../hooks/useAuth';

const Password = () => {
  const params = useLocalSearchParams();
  const email = params.email;
  const [visible, setVisible] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { resetPassword } = useAuth();

  const ValidationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password')
  });



  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ValidationSchema,
    onSubmit: async values => {
      try {
        const response = await resetPassword(
          { newPassword: values.newPassword, email: email }
        );

        Toast.show({
          type: 'success',
          text1: 'Password Changed Successfully',
          text2: 'Your password has been updated'
        });
        setVisible(true);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Password Change Failed',
          text2: error.response?.data?.message || 'An error occurred'
        });
      }
    }
  });

  const onClose = () => {
    setVisible(false);
    router.push("(tabs)");
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: '#EF4444' };
    if (strength <= 3) return { strength, label: 'Medium', color: '#F59E0B' };
    return { strength, label: 'Strong', color: '#10B981' };
  };

  const passwordStrength = getPasswordStrength(formik.values.newPassword);

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
            Create New Password
          </Text>
          <Text className="text-base text-gray-500 text-center mt-3 px-4">
            Your new password must be different from previously used passwords
          </Text>
        </View>

        {/* New Password Input */}
        <View className="mt-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            New Password
          </Text>
          <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500' : 'border-gray-200'
            }`}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              secureTextEntry={!showNewPassword}
              autoFocus={true}
              onChangeText={formik.handleChange('newPassword')}
              onBlur={formik.handleBlur('newPassword')}
              value={formik.values.newPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <MaterialCommunityIcons
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-500 ml-1 text-sm">{formik.errors.newPassword}</Text>
            </View>
          )}

          {/* Password Strength Indicator */}
          {formik.values.newPassword.length > 0 && (
            <View className="mt-3">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Password Strength</Text>
                <Text className="text-sm font-semibold" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </Text>
              </View>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4].map((level) => (
                  <View
                    key={level}
                    className="flex-1 h-2 rounded-full"
                    style={{
                      backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : '#E5E7EB'
                    }}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Confirm Password Input */}
        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </Text>
          <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
            }`}>
            <MaterialCommunityIcons name="lock-check-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              secureTextEntry={!showConfirmPassword}
              onChangeText={formik.handleChange('confirmPassword')}
              onBlur={formik.handleBlur('confirmPassword')}
              value={formik.values.confirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
              <Text className="text-red-500 ml-1 text-sm">{formik.errors.confirmPassword}</Text>
            </View>
          )}
        </View>

        {/* Password Requirements */}
        <View className="mt-6 bg-gray-50 p-4 rounded-2xl">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Password Requirements:
          </Text>
          <View className="space-y-2">
            {[
              { text: 'At least 8 characters', met: formik.values.newPassword.length >= 8 },
              { text: 'One lowercase letter', met: /[a-z]/.test(formik.values.newPassword) },
              { text: 'One uppercase letter', met: /[A-Z]/.test(formik.values.newPassword) },
              { text: 'One number', met: /[0-9]/.test(formik.values.newPassword) },
            ].map((req, index) => (
              <View key={index} className="flex-row items-center">
                <MaterialCommunityIcons
                  name={req.met ? "check-circle" : "circle-outline"}
                  size={16}
                  color={req.met ? "#10B981" : "#9CA3AF"}
                />
                <Text className={`ml-2 text-sm ${req.met ? 'text-green-600' : 'text-gray-600'}`}>
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-8 py-4 rounded-2xl ${formik.isValid && formik.dirty ? 'bg-black' : 'bg-gray-300'
            }`}
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || !formik.dirty}
        >
          <Text className="text-white text-center text-base font-bold">
            Reset Password
          </Text>
        </TouchableOpacity>

        {visible && <PasswordChangedPopup visible={visible} onClose={onClose} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Password;