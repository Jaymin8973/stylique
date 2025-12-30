import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, TouchableOpacity, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth';

const Verification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const params = useLocalSearchParams();
  const email = params.email;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const { verifyOtp, sendOtp } = useAuth();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    // Handle pasting full OTP code
    if (text.length > 1) {
      const otpArray = text.slice(0, 4).split('');
      const newOtp = [...otp];
      otpArray.forEach((digit, i) => {
        if (i < 4) newOtp[i] = digit;
      });
      setOtp(newOtp);

      // Focus last filled input or verify if complete
      if (otpArray.length === 4) {
        handleVerifyOtp(newOtp.join(''));
      } else {
        const nextIndex = Math.min(otpArray.length, 3);
        inputsRef.current[nextIndex]?.focus();
      }
      return;
    }

    // Handle single digit entry
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
    if (newOtp.join('').length === 4) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };



  const handleVerifyOtp = async (OTP) => {
    try {
      const response = await verifyOtp({ otp: OTP, email });

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
      shakeInputs();
      setOtp(['', '', '', '']);
      inputsRef.current[0]?.focus();
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.response?.data?.message || 'Invalid OTP code'
      });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await sendOtp({ email });
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputsRef.current[0]?.focus();
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new verification code has been sent to your email'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Resend',
        text2: 'Please try again later'
      });
    }
  };

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
            Verify Your Email
          </Text>
          <Text className="text-base text-gray-500 text-center mt-3 px-4">
            We've sent a 4-digit verification code to
          </Text>
          <Text className="text-base font-semibold text-gray-900 text-center mt-1">
            {email}
          </Text>
        </View>

        {/* OTP Input Section */}
        <View className="mt-8">
          <Text className="text-sm font-semibold text-gray-700 text-center mb-6">
            Enter Verification Code
          </Text>
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnimation }],
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12
            }}
          >
            {otp.map((value, index) => (
              <View
                key={index}
                className={`w-16 h-16 rounded-2xl border-2 ${value ? 'border-black bg-gray-50' : 'border-gray-300 bg-white'
                  } items-center justify-center shadow-sm`}
              >
                <TextInput
                  ref={el => (inputsRef.current[index] = el)}
                  value={value}
                  className="text-2xl font-bold text-gray-900 text-center w-full h-full"
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                  returnKeyType="done"
                  selectionColor="#000000"
                  textContentType={index === 0 ? "oneTimeCode" : "none"}
                  autoComplete={index === 0 ? "sms-otp" : "off"}
                />
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Timer and Resend Section */}
        <View className="mt-8 items-center">
          {!canResend ? (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={20} color="#6B7280" />
              <Text className="text-gray-600 ml-2">
                Resend code in <Text className="font-bold text-gray-900">{timer}s</Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              className="flex-row items-center bg-gray-100 px-6 py-3 rounded-full"
            >
              <MaterialCommunityIcons name="refresh" size={20} color="#000000" />
              <Text className="text-black font-semibold ml-2">Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View className="mt-12 bg-blue-50 p-4 rounded-2xl mx-4">
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-sm text-gray-700">
                Didn't receive the code? Check your spam folder or ensure the email address is correct.
              </Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Verification;