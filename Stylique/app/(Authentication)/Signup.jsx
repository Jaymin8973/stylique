import axios from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import IpAddress from '../../Config.json';

const Signup = () => {
  const router = useRouter();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(true);
  const [Loading, setLoading] = useState(false);
  const API = axios.create({
    baseURL: `http://${IpAddress.IpAddress}:3000`,
  });
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const nameParts = values.name.trim().split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      try {
        setLoading(true);
        const result = await API.post(`/users/register`, {
          firstname,
          lastname,
          email: values.email,
          password: values.password,
        });
        const token = result.data.token;
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userEmail', values.email);
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'You have registered successfully 👋'
        });
        resetForm();
        setLoading(false);
        router.push('(tabs)');

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
  })



  if (Platform.OS === 'ios')
    return (

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
            <View className="flex-1 mt-5 gap-10 justify-center">
              <View className="gap-2">
                <Text className="text-3xl font-bold">Create</Text>
                <Text className="text-3xl font-bold">your account</Text>
              </View>
              <View className=" mt-5 gap-5">
                <View>
                  <TextInput
                    placeholder='Enter your name'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.name}
                    onBlur={formik.handleBlur('name')}
                    onChangeText={formik.handleChange('name')} />
                  {formik.touched.name && formik.errors.name && <Text className="text-red-500">{formik.errors.name}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Email address'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.email}
                    onBlur={formik.handleBlur('email')}
                    onChangeText={formik.handleChange('email')}
                    inputMode="email"
                    keyboardType='email-address'
                  />
                  {formik.touched.email && formik.errors.email && <Text className="text-red-500">{formik.errors.email}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                    onChangeText={formik.handleChange('password')}
                    secureTextEntry
                  />
                  {formik.touched.password && formik.errors.password && <Text className="text-red-500">{formik.errors.password}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Confirm Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur('confirmPassword')}
                    onChangeText={formik.handleChange('confirmPassword')}
                    secureTextEntry
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <Text className="text-red-500">{formik.errors.confirmPassword}</Text>}
                </View>
              </View>
              <View className="items-center gap-10">
                <TouchableOpacity className="border w-40 rounded-full bg-[#2D201C] justify-center items-center" onPress={formik.handleSubmit}>
                  {Loading ? (
                    <ActivityIndicator size="small" color="#fff" className="p-5" />
                  ) : (
                    <Text className="text-white p-5 font-bold">Sign up</Text>
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
              <View className="justify-center items-center mt-5">
                <View className="flex-row justify-center items-center"><Text>Already have an account?</Text><TouchableOpacity className="ms-2 border-b" onPress={() => (router.push("(Authentication)"))}><Text>Log In </Text></TouchableOpacity></View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  else
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
            <View className="flex-1 mt-5 gap-10 justify-center">
              <View className="gap-2">
                <Text className="text-3xl font-bold">Create</Text>
                <Text className="text-3xl font-bold">your account</Text>
              </View>
              <View className=" mt-5 gap-5">
                <View>
                  <TextInput
                    placeholder='Enter your name'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.name}
                    onBlur={formik.handleBlur('name')}
                    onChangeText={formik.handleChange('name')} />
                  {formik.touched.name && formik.errors.name && <Text className="text-red-500">{formik.errors.name}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Email address'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.email}
                    onBlur={formik.handleBlur('email')}
                    onChangeText={formik.handleChange('email')}
                    inputMode="email"
                    keyboardType='email-address'
                  />
                  {formik.touched.email && formik.errors.email && <Text className="text-red-500">{formik.errors.email}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                    onChangeText={formik.handleChange('password')}
                    secureTextEntry
                  />
                  {formik.touched.password && formik.errors.password && <Text className="text-red-500">{formik.errors.password}</Text>}
                </View>
                <View>
                  <TextInput
                    placeholder='Confirm Password'
                    placeholderTextColor={"black"}
                    className="h-14 text-xl border-b border-gray-300"
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur('confirmPassword')}
                    onChangeText={formik.handleChange('confirmPassword')}
                    secureTextEntry
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <Text className="text-red-500">{formik.errors.confirmPassword}</Text>}
                </View>
              </View>
              <View className="items-center gap-10">
                <TouchableOpacity className="border w-40 rounded-full bg-[#2D201C] justify-center items-center" onPress={formik.handleSubmit}>
                  <Text className="text-white p-5 font-bold">Sign up</Text>
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
              <View className="justify-center items-center mt-5">
                <View className="flex-row justify-center items-center"><Text>Already have an account?</Text><TouchableOpacity className="ms-2 border-b" onPress={() => (router.push("(Authentication)"))}><Text>Log In </Text></TouchableOpacity></View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
}

export default Signup;