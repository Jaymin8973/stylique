import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../Api';
import Toast from 'react-native-toast-message';
import { THEME } from '../../constants/Theme';
import { ThemedButton, ThemedContainer, ThemedSection } from '../../components/ThemedComponents';

const OrderSummary = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = useMemo(() => {
    const raw = params.id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }, [params.id]);

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const loadOrder = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await API.get(`/api/orders/${orderId}`);
      setOrder(res.data);
    } catch (e) {
      Toast.show({ type: 'error', text1: e?.response?.data?.error || 'Failed to load order' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-semibold text-gray-900 mb-2">Invalid order</Text>
          <ThemedButton title="Back to Home" onPress={() => router.replace('(tabs)')} />
        </View>
      </ThemedContainer>
    );
  }

  if (loading || !order) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text className="mt-4 text-gray-600">Loading order...</Text>
        </View>
      </ThemedContainer>
    );
  }

  const subtotal = parseFloat(order.subtotal || '0');
  const shipping = parseFloat(order.shipping || '0');
  const total = parseFloat(order.total || `${subtotal + shipping}`);
  const firstItem = order.items?.[0];

  return (
    <ThemedContainer>
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="flex-row items-center mb-2 py-4">
            <Text className="flex-1 text-center text-2xl font-bold text-gray-900">Order #{order.orderNumber?.replace('ORD', '') || order.id}</Text>
            <View style={{ width: 22 }} />
          </View>

          <View className="bg-[#575757] rounded-2xl p-6 flex-row items-center justify-between mb-6">
            <View className="flex-1 mr-3">
              <Text className="text-white text-base font-semibold">Your order is confirmed</Text>
              <Text className="text-white/80 text-xs mt-1">Rate products to earn points</Text>
            </View>
            <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center">
              <Ionicons name="cube-outline" size={22} color="#fff" />
            </View>
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Order number</Text>
              <Text className="text-gray-900 font-medium">#{order.orderNumber?.replace('ORD', '') || order.id}</Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Tracking Number</Text>
              <Pressable onPress={() => router.push({ pathname: 'TrackOrder', params: { id: String(order.id) } })}>
                <Text className="text-gray-900 font-medium underline">{order.trackingNumber || '—'}</Text>
              </Pressable>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Delivery address</Text>
              <Text className="text-gray-900 font-medium flex-1 text-right ml-4" numberOfLines={2}>{order.addressText}</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            {order.items?.map((it) => (
              <View key={it.id} className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-900" numberOfLines={1}>{it.productName}</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-2">x{it.quantity}</Text>
                  <Text className="text-gray-900 font-medium">₹{(parseFloat(it.unitPrice || '0') * it.quantity).toFixed(2)}</Text>
                </View>
              </View>
            ))}
            <View className="border-t border-gray-200 mt-2 pt-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600">Sub Total</Text>
                <Text className="text-gray-900">{subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="text-gray-900">{shipping.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-900 font-semibold">Total</Text>
                <Text className="text-gray-900 font-bold">₹{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <ThemedButton title="Return home" variant="secondary" onPress={() => router.replace('(tabs)')} className='border' />
            </View>
            <View className="flex-1 ml-3">
              <ThemedButton
                title="Rate"
                onPress={() => {
                  if (!firstItem) {
                    Toast.show({ type: 'error', text1: 'No items to rate in this order' });
                    return;
                  }
                  router.push({
                    pathname: 'RateProduct',
                    params: { productId: String(firstItem.productId) },
                  });
                }}
              />
            </View>
          </View>
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

export default OrderSummary;
