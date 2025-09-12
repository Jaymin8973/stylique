import { Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import IpAddress from '../../Config.json';

const ForgotPassword = () => {
  const router = useRouter();
  const ValidationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });
const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:3000`,
});
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await API.post(`/users/otp`, values);
        Toast.show({
          type: 'success',
          text1: 'Password Reset Email Sent',
          text2: 'Check your inbox for instructions'
        });
        router.push({
          pathname: 'Verification',
          params: { email: values.email },
        });
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message || "Server error");
        } else if (error.request) {
          alert("Network error, please try again");
        } else {
          alert(error.message);
        }
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 1}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          <View className="gap-10">
            <View className="gap-5 ">
              <Text className="text-3xl font-bold">Forgot password?</Text>
              <Text className="text-gray-500">
                Enter email associated with your account and we’ll send and email with intructions to reset your password
              </Text>
            </View>
            <View >
              <View className="flex-row justify-center items-center border-b border-gray-400  px-3 py-2">
                <Fontisto name="email" size={20} color="gray" />
                <TextInput
                  keyboardType="email-address"
                  placeholder="Enter your email here"
                  placeholderTextColor="gray"
                  className="flex-1 ml-2 text-base text-black"
                  autoFocus
                  value={formik.values.email}
                  onBlur={formik.handleBlur('email')}
                  onChangeText={formik.handleChange('email')}
                />
              </View>

              {formik.touched.email && formik.errors.email && <Text className="text-red-500 mt-2">{formik.errors.email}</Text>}
            </View>
            <View className="items-center mt-10">
              <TouchableOpacity className="bg-[#2D201C] px-12 py-4 rounded-full" onPress={formik.handleSubmit}>
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ForgotPassword