import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import API from '../../Api';
import { ThemedContainer, ThemedSection } from '../../components/ThemedComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentMethod = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [processing, setProcessing] = useState(false);
  const [agree, setAgree] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('cod'); // Default to COD

  const amount = useMemo(() => {
    const raw = params.amount;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = parseFloat(value ?? '0');
    return Number.isNaN(n) ? 0 : n;
  }, [params.amount]);

  const shippingPrice = useMemo(() => {
    const raw = params.shipping;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = parseFloat(value ?? '0');
    return Number.isNaN(n) ? 0 : n;
  }, [params.shipping]);

  const productPrice = useMemo(() => {
    const raw = params.productPrice;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = parseFloat(value ?? '0');
    if (!Number.isNaN(n) && n > 0) return n;
    const guess = amount - shippingPrice;
    return guess > 0 ? guess : amount;
  }, [params.productPrice, amount, shippingPrice]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.push('/(Authentication)/Login');
          return;
        }

        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const handleCODOrder = async () => {
    if (!amount || amount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid order amount' });
      return;
    }
    if (!agree) {
      Toast.show({ type: 'error', text1: 'Please agree to Terms and conditions' });
      return;
    }

    try {
      setProcessing(true);

      // Create order with COD
      const orderRes = await API.post('/api/orders', {
        shipping: shippingPrice,
        paymentMethod: 'cod',
      });

      const orderId = orderRes?.data?.id;

      Toast.show({
        type: 'success',
        text1: 'Order Placed Successfully',
        text2: 'Pay cash when you receive your order'
      });

      if (orderId) {
        router.replace({
          pathname: 'OrderSummary',
          params: { id: String(orderId) }
        });
      } else {
        router.replace('(tabs)');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to place order',
        text2: error.response?.data?.message || 'Please try again'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!amount || amount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid payment amount' });
      return;
    }
    if (!agree) {
      Toast.show({ type: 'error', text1: 'Please agree to Terms and conditions' });
      return;
    }

    Alert.alert(
      'Online Payment',
      'Online payment will be available in the production app. For now, please use Cash on Delivery.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const PaymentOption = ({ icon, title, subtitle, method, badge }) => (
    <Pressable
      onPress={() => setSelectedMethod(method)}
      className={`mb-3 p-4 rounded-2xl border-2 ${selectedMethod === method ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
        }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 rounded-xl ${selectedMethod === method ? 'bg-black' : 'bg-gray-100'} items-center justify-center mr-3`}>
            <MaterialCommunityIcons name={icon} size={24} color={selectedMethod === method ? '#fff' : '#333'} />
          </View>
          <View className="flex-1">
            <Text className={`text-base font-semibold ${selectedMethod === method ? 'text-black' : 'text-gray-900'}`}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center">
          {badge && (
            <View className="bg-green-100 px-2 py-1 rounded-full mr-2">
              <Text className="text-xs font-semibold text-green-700">{badge}</Text>
            </View>
          )}
          <View className={`w-6 h-6 rounded-full border-2 ${selectedMethod === method ? 'border-black' : 'border-gray-300'} items-center justify-center`}>
            {selectedMethod === method && <View className="w-3 h-3 rounded-full bg-black" />}
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (!amount || amount <= 0) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center px-6">
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-900 mb-2 mt-4">No payment required</Text>
          <Text className="text-gray-600 text-center mb-4">There is no active order amount to pay.</Text>
          <Pressable
            onPress={() => router.replace('(tabs)')}
            className="bg-black px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-semibold">Back to Home</Text>
          </Pressable>
        </View>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer className='bg-white'>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ThemedSection className="pt-4 pb-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">Payment Method</Text>
            <Text className="text-gray-500 mt-1">Choose how you want to pay</Text>
          </View>

          {/* Payment Methods */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Select Payment Option</Text>

            <PaymentOption
              icon="cash"
              title="Cash on Delivery"
              subtitle="Pay when you receive your order"
              method="cod"
              badge="Available"
            />

            <PaymentOption
              icon="credit-card"
              title="Online Payment"
              subtitle="Card, UPI, Net Banking, Wallets"
              method="online"
            />
          </View>

          {/* Info Card */}
          {selectedMethod === 'online' && (
            <View className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-200">
              <View className="flex-row items-start">
                <MaterialCommunityIcons name="information" size={20} color="#F59E0B" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-gray-900 mb-1">
                    Coming Soon
                  </Text>
                  <Text className="text-sm text-gray-700">
                    Online payment with Razorpay will be available in the production version. Please use Cash on Delivery for now.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {selectedMethod === 'cod' && (
            <View className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
              <View className="flex-row items-start">
                <MaterialCommunityIcons name="check-circle" size={20} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-gray-900 mb-1">
                    Cash on Delivery
                  </Text>
                  <Text className="text-sm text-gray-700">
                    • Pay in cash when your order is delivered{'\n'}
                    • No advance payment required{'\n'}
                    • Inspect product before payment
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Price Summary */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600">Product Price</Text>
                <Text className="text-gray-900 font-semibold">₹{productPrice.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-t border-gray-200">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="text-gray-900 font-semibold">
                  {shippingPrice <= 0 ? (
                    <Text className="text-green-600">FREE</Text>
                  ) : (
                    `₹${shippingPrice.toFixed(2)}`
                  )}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-3 border-t-2 border-gray-300">
                <Text className="text-lg font-bold text-gray-900">Total Amount</Text>
                <Text className="text-xl font-bold text-black">₹{amount.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Terms Agreement */}
          <Pressable
            onPress={() => setAgree(!agree)}
            className="flex-row items-start mb-6"
          >
            <View className={`w-6 h-6 rounded-lg mr-3 border-2 ${agree ? 'bg-black border-black' : 'bg-white border-gray-400'
              } items-center justify-center`}>
              {agree && <MaterialCommunityIcons name="check" size={16} color="#ffffff" />}
            </View>
            <Text className="text-gray-700 flex-1">
              I agree to the{' '}
              <Text className="text-blue-600 font-semibold">Terms & Conditions</Text>
              {' '}and{' '}
              <Text className="text-blue-600 font-semibold">Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Place Order Button */}
          <Pressable
            onPress={selectedMethod === 'cod' ? handleCODOrder : handleOnlinePayment}
            disabled={processing || !agree}
            className={`py-4 rounded-2xl ${processing || !agree ? 'bg-gray-300' : 'bg-black'
              }`}
          >
            {processing ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white text-center text-base font-bold ml-2">
                  Placing Order...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <MaterialCommunityIcons
                  name={selectedMethod === 'cod' ? 'cash' : 'lock-check'}
                  size={20}
                  color="white"
                />
                <Text className="text-white text-center text-base font-bold ml-2">
                  {selectedMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Security Badge */}
          <View className="mt-6 items-center">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="shield-check" size={16} color="#10B981" />
              <Text className="text-sm text-gray-500 ml-1">
                100% Secure & Safe
              </Text>
            </View>
          </View>
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

export default PaymentMethod;
