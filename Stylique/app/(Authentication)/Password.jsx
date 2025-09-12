import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import PasswordChangedPopup from "./PasswordChangedPopup";
const Password = () => {
   const params = useLocalSearchParams();
    const email = params.email;
  const [visible, setVisible] = useState(false)
  const router = useRouter();
  const ValidationSchema = yup.object().shape({
    newPassword: yup.string().min(6).required(),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ValidationSchema,
    onSubmit: async values => {
       try {
    const response = await axios.post(
      'http://192.168.1.2:3000/users/forgotpassword',
      { newPassword: values.newPassword , email: email }
    );
    
    Toast.show({
      type: 'success',
      text1: 'Password Changed Successfully',
      text2: 'Your password has been changed successfully'
    });
    setVisible(true);
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Password Change Failed',
      text2: error.response?.data?.message || 'An error occurred'
    });
    return false;
  }
    }
  });


  const onClose = () => {
    setVisible(false);
    router.push("(tabs)")
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 100}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          <View className="gap-10">
            <View className="gap-5 ">
              <Text className="text-3xl font-bold">Create new password?</Text>
              <Text className="text-gray-500">
                Your new password must be different
                from previously used password
              </Text>
            </View>

            <View className="mt-5  gap-10 ">
              <View>
              <TextInput
                placeholder='New Password'
                placeholderTextColor={'lightgray'}
                className="text-xl  border-b border-gray-400"
                autoFocus={true}
                onChangeText={formik.handleChange('newPassword')}
                onBlur={formik.handleBlur('newPassword')}
                value={formik.values.newPassword}
              />
              {formik.errors.newPassword && formik.touched.newPassword && (
                <Text className="text-red-500">{formik.errors.newPassword}</Text>
              )}
              </View>
              <View>
              <TextInput
                placeholder='Confirm Password'
                placeholderTextColor={'lightgray'}
                className="text-xl  border-b border-gray-400"
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                value={formik.values.confirmPassword}
              />
              {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                <Text className="text-red-500">{formik.errors.confirmPassword}</Text>
              )}
              </View>
            </View>
            <View className="items-center mt-10">
              <TouchableOpacity className="bg-[#2D201C] px-12 py-4 rounded-full" onPress={formik.handleSubmit}>
                <Text className="text-white text-xl font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
            {
              visible &&
              <PasswordChangedPopup visible={visible} onClose={onClose} />
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Password