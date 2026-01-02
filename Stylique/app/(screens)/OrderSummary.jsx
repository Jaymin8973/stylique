

import { ThemedContainer, ThemedSection, ThemedButton } from '@/components/ThemedComponents';
import THEME from '@/constants/Theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useOrders } from '@hooks/useOrders';

// Cancellable statuses - can cancel before shipping
const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing'];
// Return possible only on delivered
const RETURNABLE_STATUSES = ['delivered'];

const OrderSummary = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.id;

  // Get order hooks
  const { useOrderDetail, cancelOrder, isCancelling, returnOrder, isReturning } = useOrders();
  const { data: order, isLoading: loading } = useOrderDetail(orderId);

  // Cancel order handler
  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder({ orderId, reason: 'Customer cancelled' });
            } catch (e) {
              // toast handled by hook
            }
          }
        }
      ]
    );
  };

  // Return request handler
  const handleReturnRequest = () => {
    Alert.alert(
      'Return Request',
      'Select a reason for return:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Size issue',
          onPress: () => submitReturnRequest('Size issue - size does not fit')
        },
        {
          text: 'Quality issue',
          onPress: () => submitReturnRequest('Quality issue - poor product quality')
        },
        {
          text: 'Wrong item',
          onPress: () => submitReturnRequest('Wrong item - received wrong product')
        }
      ]
    );
  };

  const submitReturnRequest = async (reason) => {
    try {
      await returnOrder({ orderId, reason });
    } catch (e) {
      // toast handled
    }
  };

  // Status display helper
  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { text: 'Payment Pending', color: '#FFA500' },
      confirmed: { text: 'Order Confirmed', color: '#4CAF50' },
      processing: { text: 'Being Prepared', color: '#2196F3' },
      shipped: { text: 'Shipped', color: '#9C27B0' },
      out_for_delivery: { text: 'Out for Delivery', color: '#FF9800' },
      delivered: { text: 'Delivered', color: '#4CAF50' },
      cancelled: { text: 'Cancelled', color: '#F44336' },
      return_requested: { text: 'Return Requested', color: '#FF5722' },
      return_approved: { text: 'Return Approved', color: '#795548' },
      return_picked: { text: 'Return Picked', color: '#607D8B' },
      refunded: { text: 'Refunded', color: '#9E9E9E' },
    };
    return statusMap[status] || { text: status, color: '#9E9E9E' };
  };

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
  const statusInfo = getStatusDisplay(order.status);
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const canReturn = RETURNABLE_STATUSES.includes(order.status);

  return (
    <ThemedContainer>
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="flex-row items-center mb-2 py-4">
            <Text className="flex-1 text-center text-2xl font-bold text-gray-900">Order #{order.orderNumber?.replace('ORD', '') || order.id}</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Status Banner */}
          <View className="rounded-2xl p-6 flex-row items-center justify-between mb-6" style={{ backgroundColor: statusInfo.color }}>
            <View className="flex-1 mr-3">
              <Text className="text-white text-base font-semibold">{statusInfo.text}</Text>
              <Text className="text-white/80 text-xs mt-1">
                {order.status === 'delivered' ? 'Rate products to earn points' :
                  order.status === 'cancelled' ? 'Order has been cancelled' :
                    order.status?.includes('return') ? 'Return in progress' :
                      'Your order is being processed'}
              </Text>
            </View>
            <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
              <Ionicons
                name={order.status === 'cancelled' ? 'close-circle' :
                  order.status === 'delivered' ? 'checkmark-circle' :
                    order.status?.includes('return') ? 'arrow-undo' : 'cube'}
                size={22}
                color="#fff"
              />
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

          {/* Action Buttons */}
          <View className="mb-6">
            <ThemedButton
              title="View Invoice"
              variant="secondary"
              onPress={() => router.push({ pathname: 'Invoice', params: { id: String(order.id) } })}
              icon="document-text-outline"
              className="border"
            />
          </View>

          {/* Cancel Button - sirf cancellable status pe show */}
          {canCancel && (
            <View className="mb-4">
              <ThemedButton
                title={isCancelling ? "Cancelling..." : "Cancel Order"}
                variant="danger"
                onPress={handleCancelOrder}
                disabled={isCancelling}
                icon="close-circle-outline"
              />
            </View>
          )}

          {/* Return Button - sirf delivered pe show */}
          {canReturn && (
            <View className="mb-4">
              <ThemedButton
                title={isReturning ? "Requesting..." : "Request Return"}
                variant="secondary"
                onPress={handleReturnRequest}
                disabled={isReturning}
                icon="arrow-undo-outline"
                className="border border-orange-400"
              />
            </View>
          )}

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

