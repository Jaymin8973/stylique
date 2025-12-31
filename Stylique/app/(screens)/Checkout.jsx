import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '@constants/Theme';
import { ThemedContainer, ThemedSection, ThemedButton } from '@components/ThemedComponents';

// Hooks
import { useAddress } from '@hooks/useAddress';
import { useCart } from '@hooks/useCart';

const Checkout = () => {
  const router = useRouter();

  // Hooks logic
  const { defaultAddress: address, isLoading: addrLoading } = useAddress();
  const { cartItems, isLoading: cartLoading } = useCart();

  // Derived cart object structure to match existing usage
  const cart = {
    items: cartItems,
    subtotal: cartItems.reduce((sum, item) => sum + (parseFloat(item.unitPrice || item.product?.sellingPrice || 0) * item.quantity), 0)
  };

  const loading = addrLoading || cartLoading;
  const subtotal = cart?.subtotal || 0;

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/(Authentication)/Login');
        return;
      }
    };
    init();
  }, []);

  const handleChangeAddress = () => {
    router.push('Address');
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      Toast.show({ type: 'error', text1: 'Please add a delivery address first' });
      return;
    }
    if (!cart || !cart.items?.length) {
      Toast.show({ type: 'error', text1: 'Your cart is empty' });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Order placed successfully',
      text2: 'Proceeding to payment...',
    });

    router.push({
      pathname: 'PaymentMethod',
      params: {
        amount: String(subtotal),
        productPrice: String(subtotal),
        shipping: '0',
      },
    });
  };

  if (loading) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text className="mt-4 text-gray-600">Loading checkout...</Text>
        </View>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer className="bg-white">
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Delivery Address</Text>
            {address ? (
              <View className="bg-white rounded-2xl border border-gray-200 p-4">
                <View className="flex-row items-center mb-2">
                  <Text className="font-semibold text-gray-900 mr-2">Delivery Address</Text>
                  {address.isDefault && (
                    <View className="bg-black px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-medium">Default</Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="font-bold text-gray-900 mr-2">{address.firstName} {address.lastName}</Text>
                </View>
                <Text className="text-gray-700 mb-1">{address.houseNo}, {address.street}</Text>
                <Text className="text-gray-700 mb-1">{address.city}, {address.state}</Text>
                <Text className="text-gray-700">{address.pincode}</Text>
                <ThemedButton
                  title="Change"
                  variant="secondary"
                  className="mt-4"
                  onPress={handleChangeAddress}
                />
              </View>
            ) : (
              <View className="bg-white rounded-2xl border border-dashed border-gray-300 p-4">
                <Text className="text-gray-600 mb-2">
                  No delivery address found. Add an address to continue.
                </Text>
                <ThemedButton
                  title="Add Address"
                  onPress={() => router.push('AddressForm')}
                />
              </View>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Order Summary</Text>
            {cart && cart.items?.length ? (
              <View className="bg-white rounded-2xl border border-gray-200 p-4">
                {cart.items.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between items-center mb-3"
                  >
                    <View className="flex-1 mr-3">
                      <Text
                        className="text-gray-900 font-medium"
                        numberOfLines={1}
                      >
                        {item.product?.productName}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-semibold">
                      ₹{(parseFloat(item.unitPrice || '0') * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
                <View className="border-t border-gray-200 mt-3 pt-3 flex-row justify-between items-center">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="text-lg font-bold text-gray-900">
                    ₹{Number(subtotal).toFixed(2)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="bg-white rounded-2xl border border-dashed border-gray-300 p-4">
                <Text className="text-gray-600">
                  Your cart is empty.
                </Text>
              </View>
            )}
          </View>

          <ThemedButton
            title="Place Order"
            onPress={handlePlaceOrder}
            className="mt-2"
          />
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

export default Checkout;
