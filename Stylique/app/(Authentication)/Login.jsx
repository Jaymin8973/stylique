import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import * as SecureStore from 'expo-secure-store';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';



import { useAuth } from '../../hooks/useAuth';
import { Image } from 'expo-image';

const Login = () => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const { login, registerPushToken } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('(tabs)');
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
  });
  const formik = useFormik({

    initialValues: { email: '', password: '' },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await login(values);
        const token = response.token;
        const userId = String(response.user.id);
        await AsyncStorage.setItem('userToken', token);
        await SecureStore.setItemAsync('userId', userId);
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          console.log('Notification permission existingStatus:', existingStatus);
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log('Notification permission after request:', status);
          }
          if (finalStatus !== 'granted') {
            console.log('Notification permission not granted, skipping push token registration');
          } else {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId
              ?? Constants?.expoConfig?.projectId
              ?? Constants?.expoConfig?.slug;
            console.log('Using projectId for push token:', projectId);
            const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
            console.log('Expo push token:', pushToken?.data);
            if (pushToken?.data) {
              try {
                // Pass userToken explicitly if API interceptor might not catch it yet (though it reads from async storage)
                // Actually, API interceptor reads from AsyncStorage, which we just set.
                // But just in case, we can pass it if the hook supports it or just rely on interceptor.
                // The hook implementation: const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
                const res = await registerPushToken({ token: pushToken.data, userToken: token });
                console.log('Register push token response:', res);
              } catch (regErr) {
                console.log('Failed to register push token:', regErr?.response?.data || regErr?.message);
              }
            } else {
              console.log('No pushToken.data returned from getExpoPushTokenAsync');
            }
          }
        } catch (e) {
          console.log('Error during notification setup:', e?.message);
        }
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!'
        });
        setLoading(false);
        router.replace('(tabs)');
      } catch (error) {
        setLoading(false);
        console.log(error.message);
        if (error.response) {
          const data = error.response.data || {};
          alert(data.error || data.message || "Server error");
        } else if (error.request) {
          alert("Network error, please try again");
        } else {
          console.log(error.message);
          alert(error.message);
        }
      }
    },
  });

  if (Loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" className="px-8">
            <View className="flex-1 mt-5 gap-10 justify-center">
              <View className="gap-2">
                <Text className="text-3xl font-bold">Log into</Text>
                <Text className="text-3xl font-bold">your account</Text>
              </View>
              <View className=" mt-5 gap-8">
                <View>
                  <TextInput
                    placeholder='Email address'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    onBlur={formik.handleBlur('email')}
                    keyboardType='email-address'
                  />
                  {formik.touched.email && formik.errors.email && <Text className="text-red-500 mt-1">{formik.errors.email}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                    secureTextEntry
                  />
                  {formik.touched.password && formik.errors.password && <Text className="text-red-500 mt-1">{formik.errors.password}</Text>}
                </View>
                <TouchableOpacity className="items-end" onPress={() => router.push("ForgotPassword")}>
                  <Text className='text-gray-500' >Forgot Password? </Text>
                </TouchableOpacity>
              </View>
              <View className="items-center gap-10">
                <TouchableOpacity className="border w-40 rounded-full bg-[#2D201C] justify-center items-center" onPress={formik.handleSubmit}>
                  {Loading ? (
                    <ActivityIndicator size="small" color="#fff" className="p-5" />
                  ) : (
                    <Text className="text-white  p-5">LOG IN</Text>
                  )}
                </TouchableOpacity>
                <Text>
                  Or log in with
                </Text>
                <View className="  flex-row gap-3 justify-center items-center" style={{ height: 65 }}>
                  <Pressable className="border p-4 rounded-full  justify-center items-center">
                    <Image source={require("../../assets/images/apple-logo.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                  <Pressable className="border rounded-full p-4 justify-center items-center">
                    <Image source={require("../../assets/images/google.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                  <Pressable className="border rounded-full p-4 justify-center items-center">
                    <Image source={require("../../assets/images/facebook.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                </View>
              </View>
              <View className="justify-center items-center mt-10">
                <View className="flex-row justify-center items-center"><Text>Don't have an account?</Text><TouchableOpacity className="ms-2 border-b" onPress={() => (router.push("Signup"))}><Text>Sign Up </Text></TouchableOpacity></View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
  else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" className="px-8">
            <View className="flex-1 mt-5 gap-10 justify-center">
              <View className="gap-2">
                <Text className="text-3xl font-bold">Log into</Text>
                <Text className="text-3xl font-bold">your account</Text>
              </View>
              <View className=" mt-5 gap-8">
                <View>
                  <TextInput
                    placeholder='Email address'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    onBlur={formik.handleBlur('email')}
                    keyboardType='email-address'
                  />
                  {formik.touched.email && formik.errors.email && <Text className="text-red-500 mt-1">{formik.errors.email}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                    secureTextEntry
                  />
                  {formik.touched.password && formik.errors.password && <Text className="text-red-500 mt-1">{formik.errors.password}</Text>}
                </View>
                <TouchableOpacity className="items-end" onPress={() => router.push("ForgotPassword")}>
                  <Text className='text-gray-500' >Forgot Password? </Text>
                </TouchableOpacity>
              </View>
              <View className="items-center gap-10">
                <TouchableOpacity className="border w-40 rounded-full bg-[#2D201C] justify-center items-center" onPress={formik.handleSubmit}>
                  <Text className="text-white p-5 ">LOG IN</Text>
                </TouchableOpacity>
                <Text>
                  Or log in with
                </Text>
                <View className="  flex-row gap-3 justify-center items-center" style={{ height: 65 }}>
                  <Pressable className="border p-4 rounded-full  justify-center items-center">
                    <Image source={require("../../assets/images/apple-logo.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                  <Pressable className="border rounded-full p-4 justify-center items-center">
                    <Image source={require("../../assets/images/google.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                  <Pressable className="border rounded-full p-4 justify-center items-center">
                    <Image source={require("../../assets/images/facebook.png")} style={{ height: 30, width: 30 }} />
                  </Pressable>
                </View>
              </View>
              <View className="justify-center items-center mt-10">
                <View className="flex-row justify-center items-center"><Text>Don't have an account?</Text><TouchableOpacity className="ms-2 border-b" onPress={() => (router.push("Signup"))}><Text>Sign Up </Text></TouchableOpacity></View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

export default Login