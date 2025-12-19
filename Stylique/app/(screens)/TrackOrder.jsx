import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import API from '../../Api';
import { THEME } from '../../constants/Theme';
import { ThemedButton, ThemedContainer, ThemedSection } from '../../components/ThemedComponents';

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month} ${time}`;
  } catch {
    return '';
  }
};

export default function TrackOrder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = useMemo(() => {
    const raw = params.id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }, [params.id]);
  const tracking = useMemo(() => {
    const raw = params.tracking;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.tracking]);

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const res = await API.get(`/api/orders/${id}`);
        setOrder(res.data);
        setEvents((res.data.tracking || []).sort((a, b) => new Date(b.eventAt) - new Date(a.eventAt)));
      } else if (tracking) {
        const res = await API.get(`/api/orders/track/${tracking}`);
        setOrder(res.data);
        setEvents((res.data.tracking || []).sort((a, b) => new Date(b.eventAt) - new Date(a.eventAt)));
      } else {
        Toast.show({ type: 'error', text1: 'No order to track' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: e?.response?.data?.error || 'Failed to load tracking' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, tracking]);

  if (loading || !order) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text className="mt-4 text-gray-600">Loading tracking...</Text>
        </View>
      </ThemedContainer>
    );
  }

  // Guess delivered date if any event mentions delivered
  const deliveredEvent = events.find((e) => /delivered/i.test(e.status));
  const deliveredText = deliveredEvent ? `Delivered on ${new Date(deliveredEvent.eventAt).toLocaleDateString('en-GB')}` : '';

  return (
    <ThemedContainer>
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="chevron-back" size={22} color="#111" onPress={() => router.back()} />
            <Text className="flex-1 text-center text-2xl font-bold text-gray-900">Track Order</Text>
            <View style={{ width: 22 }} />
          </View>

          <View className="px-1 mb-4">
            {deliveredText ? (
              <Text className="text-gray-500 mb-2">{deliveredText}</Text>
            ) : (
              <Text className="text-gray-500 mb-2">Tracking started</Text>
            )}
            <Text className="text-gray-600">Tracking Number : <Text className="font-semibold text-gray-900">{order.trackingNumber || '-'}</Text></Text>
          </View>

          <View className="mt-4 mb-6">
            {events.map((ev, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === events.length - 1;
              const dateStr = formatDate(ev.eventAt);
              return (
                <View key={ev.id} className="flex-row items-start mb-5">
                  <View className="items-center" style={{ width: 24 }}>
                    <View className={`w-5 h-5 rounded-full ${isFirst ? 'bg-black' : 'border border-gray-400'}`} />
                    {!isLast && (
                      <View className="w-px bg-gray-300" style={{ height: 28 }} />
                    )}
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-900">
                      {ev.status}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs">{dateStr}</Text>
                </View>
              );
            })}
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-4">
            <Text className="text-gray-900 font-semibold mb-1">Don't forget to rate</Text>
            <Text className="text-gray-500 text-xs mb-3">Rate product to get 5 points for collect.</Text>
            <View className="flex-row mt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Ionicons key={i} name="star-outline" size={20} color={THEME.colors.rating || '#f5a623'} style={{ marginRight: 6 }} />
              ))}
            </View>
          </View>

          <View className="mt-6">
            <ThemedButton title="Back to orders" variant="secondary" onPress={() => router.replace('(tabs)')} />
          </View>
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
}
