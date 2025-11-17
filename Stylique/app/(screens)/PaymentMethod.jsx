import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import API from '../../Api';
import { THEME } from '../../constants/Theme';
import { ThemedButton, ThemedContainer, ThemedSection } from '../../components/ThemedComponents';

const PaymentMethod = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [processing, setProcessing] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState(null); // 'GPay' | 'CRED'
  const [bank, setBank] = useState(null); // e.g., 'HDFC'

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

  const upiValid = useMemo(() => {
    if (!upiId) return false;
    const re = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{2,}$/;
    return re.test(upiId.trim());
  }, [upiId]);

  const handlePlaceOrder = async () => {
    if (!amount || amount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid payment amount' });
      return;
    }
    if (!agree) {
      Toast.show({ type: 'error', text1: 'Please agree to Terms and conditions' });
      return;
    }

    if (selectedMethod === 'upi' && !upiApp && !upiValid) {
      Toast.show({ type: 'error', text1: 'Enter a valid UPI ID or choose a UPI app' });
      return;
    }
    if (selectedMethod === 'netbanking' && !bank) {
      Toast.show({ type: 'error', text1: 'Please select a bank' });
      return;
    }

    try {
      setProcessing(true);
      await API.post('/api/payment/charge', {
        amount,
        currency: 'INR',
        method: selectedMethod,
        upiId: selectedMethod === 'upi' ? (upiValid ? upiId.trim() : undefined) : undefined,
        upiApp: selectedMethod === 'upi' ? upiApp || undefined : undefined,
        bank: selectedMethod === 'netbanking' ? bank || undefined : undefined,
      });

      await API.delete('/api/cart/clear');

      Toast.show({ type: 'success', text1: 'Payment successful', text2: 'Your order has been placed.' });
      router.replace('(tabs)');
    } catch (error) {
      if (error?.response) {
        Toast.show({
          type: 'error',
          text1: error.response.data.message || error.response.data.error || 'Payment failed',
        });
      } else {
        Toast.show({ type: 'error', text1: 'Network error, please try again' });
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!amount || amount <= 0) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-semibold text-gray-900 mb-2">No payment required</Text>
          <Text className="text-gray-600 text-center mb-4">There is no active order amount to pay.</Text>
          <ThemedButton title="Back to Home" onPress={() => router.replace('(tabs)')} />
        </View>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer>
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="mb-4">
            <Text className="text-sm tracking-widest text-gray-500">STEP 2</Text>
            <Text className="text-3xl font-extrabold text-gray-900 mt-1">Payment</Text>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">Cards</Text>
          <View className="bg-white rounded-2xl border border-gray-200 p-3 mb-6">
            <Pressable
              onPress={() => {
                setSelectedMethod('card');
                router.push('Addnewcard');
              }}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center mr-3">
                  <Ionicons name="card-outline" size={18} color="#333" />
                </View>
                <Text className="text-gray-900 text-base">Cards</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
            </Pressable>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">UPI</Text>
          <View className="bg-white rounded-2xl border border-gray-200 p-3 mb-6">
            <View className="flex-row items-center justify-around py-2">
              <Pressable onPress={() => { setSelectedMethod('upi'); setUpiApp('GPay'); }} className={`items-center px-3 py-2 rounded-xl border ${upiApp === 'GPay' ? 'border-black' : 'border-gray-300'}`}>
                <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center">
                  <Ionicons name="logo-google" size={18} color="#333" />
                </View>
                <Text className="mt-1 text-gray-800 text-xs">GPay</Text>
              </Pressable>
              <Pressable onPress={() => { setSelectedMethod('upi'); setUpiApp('CRED'); }} className={`items-center px-3 py-2 rounded-xl border ${upiApp === 'CRED' ? 'border-black' : 'border-gray-300'}`}>
                <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center">
                  <Ionicons name="shield-checkmark-outline" size={18} color="#333" />
                </View>
                <Text className="mt-1 text-gray-800 text-xs">CRED UPI</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => { setSelectedMethod('upi'); setUpiApp(null); }}
              className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl py-3 items-center"
            >
              <Text className="text-yellow-700 font-medium">Other UPI Options</Text>
            </Pressable>
            {!upiApp && (
              <View className="mt-3">
                <Text className="text-gray-600 mb-2">Enter UPI ID</Text>
                <TextInput
                  className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="name@bank"
                  autoCapitalize="none"
                />
              </View>
            )}
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">Pay On Delivery</Text>
          <View className="bg-white rounded-2xl border border-gray-200 p-3 mb-6">
            <Pressable onPress={() => setSelectedMethod('cod')} className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center mr-3">
                  <Ionicons name="cash-outline" size={18} color="#333" />
                </View>
                <Text className="text-gray-900 text-base">Cash On Delivery</Text>
              </View>
              <View className={`w-5 h-5 rounded-full border-2 ${selectedMethod === 'cod' ? 'border-black' : 'border-gray-300'} items-center justify-center`}>
                {selectedMethod === 'cod' && <View className="w-3 h-3 rounded-full bg-black" />}
              </View>
            </Pressable>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">Net Banking</Text>
          <View className="bg-white rounded-2xl border border-gray-200 p-3 mb-6">
            <View className="flex-row items-center justify-between">
              {['SBI','HDFC','ICICI','Axis'].map((b) => (
                <Pressable
                  key={b}
                  onPress={() => { setSelectedMethod('netbanking'); setBank(b); }}
                  className={`items-center px-3 py-2 rounded-xl border ${bank === b ? 'border-black' : 'border-gray-300'}`}
                >
                  <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center">
                    <Ionicons name="business-outline" size={18} color="#333" />
                  </View>
                  <Text className="mt-1 text-gray-800 text-xs">{b}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Product price</Text>
              <Text className="text-gray-900">₹{productPrice.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-900">{shippingPrice <= 0 ? 'Freeship' : `₹${shippingPrice.toFixed(2)}`}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900 font-bold">₹{amount.toFixed(2)}</Text>
            </View>
          </View>

          <Pressable onPress={() => setAgree(!agree)} className="flex-row items-center mb-4">
            <View className={`w-5 h-5 rounded-md mr-3 border ${agree ? 'bg-black border-black' : 'bg-white border-gray-400'} items-center justify-center`}>
              {agree && <Ionicons name="checkmark" size={12} color="#ffffff" />}
            </View>
            <Text className="text-gray-900">I agree to <Text className="text-blue-600">Terms and conditions</Text></Text>
          </Pressable>

          <ThemedButton
            title={processing ? 'Placing...' : 'Place my order'}
            onPress={handlePlaceOrder}
            disabled={processing || !agree}
          />
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

export default PaymentMethod;

