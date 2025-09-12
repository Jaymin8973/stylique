import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
const Verification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const params = useLocalSearchParams();
  const email = params.email;


  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
    if (newOtp.join('').length === 4) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const verifyOtp = async (OTP) => {
    try {
      const response = await axios.post(
        'http://192.168.1.2:3000/users/verify-otp',
        { otp: OTP, email }
      );

      Toast.show({
        type: 'success',
        text1: 'Verification Successful',
        text2: 'Your email has been verified successfully'
      });

      router.push({
        pathname: 'Password',
        params: { email: email }
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.response?.data?.message || 'An error occurred'
      });
    }
  };



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
              <Text className="text-3xl font-bold">Verification code</Text>
              <Text className="text-gray-500">
                Enter email associated with your account and we’ll send and email with intructions to reset your password
              </Text>
            </View>
            <View style={styles.container}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={el => (inputsRef.current[index] = el)}
                  value={value}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                  returnKeyType="done"
                  textAlign="center"
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  input: {
    height: 50,
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 24,
  },
});


export default Verification