import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../Api';
import { THEME } from '../../constants/Theme';
import { ThemedContainer, ThemedSection } from '../../components/ThemedComponents';
import { ScrollView } from 'react-native';

const OrderItem = ({ order, onPress }) => {
  const firstItem = order.items?.[0];
  const itemCount = order._count?.items || 0;
  
  return (
    <Pressable 
      onPress={onPress}
      className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex-row"
    >
      <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4">
        {firstItem?.product?.imageUrl ? (
          <Image 
            source={{ uri: firstItem.product.imageUrl }} 
            className="w-full h-full" 
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-100">
            <Ionicons name="cube-outline" size={24} color={THEME.colors.primary} />
          </View>
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-gray-900 font-medium">Order #{order.orderNumber?.replace('ORD', '') || order.id}</Text>
          <Text className="text-gray-900 font-semibold">₹{parseFloat(order.total).toFixed(2)}</Text>
        </View>
        
        <Text className="text-gray-500 text-sm mt-1">
          {itemCount} item{itemCount > 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        
        <View className="flex-row items-center mt-2">
          <View 
            className="h-2 rounded-full mr-2" 
            style={{
              width: 8,
              backgroundColor: 
                order.status === 'delivered' ? THEME.colors.success : 
                order.status === 'cancelled' ? THEME.colors.danger : 
                THEME.colors.warning
            }}
          />
          <Text className="text-sm text-gray-700 capitalize">
            {order.status?.replace(/-/g, ' ')}
          </Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-2" />
    </Pressable>
  );
};
const EmptyState = () => (
  <View className="flex-1 items-center justify-center py-12">
    <Ionicons name="cube-outline" size={48} color={THEME.colors.text.tertiary} />
    <Text className="text-gray-500 text-lg font-medium mt-4">No orders yet</Text>
    <Text className="text-gray-400 text-center mt-2 px-8">
      Your order history will appear here when you make a purchase
    </Text>
  </View>
);

export default function MyOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      
      const res = await API.get(`/api/orders?${params.toString()}`);
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const handleOrderPress = (order) => {
    router.push({ pathname: 'OrderSummary', params: { id: String(order.id) } });
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  return (
    <ThemedContainer>
      <View className="flex-1">
        <ThemedSection className="pt-4 pb-2">
         

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeTab === tab.id 
                    ? 'bg-black' 
                    : 'bg-gray-100'
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedSection>

        <ThemedSection className="flex-1 pt-2">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
          ) : orders.length > 0 ? (
            <FlatList
              data={orders}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <OrderItem 
                  order={item} 
                  onPress={() => handleOrderPress(item)} 
                />
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState />
          )}
        </ThemedSection>
      </View>
    </ThemedContainer>
  );
}
