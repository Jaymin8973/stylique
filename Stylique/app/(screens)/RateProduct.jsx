import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import API from '../../Api';
import { THEME } from '../../constants/Theme';
import { ThemedButton, ThemedContainer, ThemedSection } from '../../components/ThemedComponents';

const MAX_CHARS = 250;

const RateProduct = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = useMemo(() => {
    const raw = params.productId;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }, [params.productId]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectStar = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!productId) {
      Toast.show({ type: 'error', text1: 'Missing product information' });
      return;
    }
    if (!rating || rating < 1) {
      Toast.show({ type: 'error', text1: 'Please select a rating' });
      return;
    }

    try {
      setSubmitting(true);
      await API.post(`/rating/${productId}`, {
        rating,
        comment: comment.trim() || null,
      });
      Toast.show({ type: 'success', text1: 'Review submitted' });
      router.back();
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to submit review';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (!productId) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Invalid product</Text>
          <ThemedButton title="Back" onPress={() => router.back()} />
        </View>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer>
      <ScrollView className="flex-1">
        <ThemedSection className="pt-4 pb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="chevron-back"
              size={22}
              color="#111"
              onPress={() => router.back()}
            />
            <Text className="flex-1 text-center text-2xl font-bold text-gray-900">Rate Product</Text>
            <View style={{ width: 22 }} />
          </View>

          <View className="bg-[#575757] rounded-2xl p-4 flex-row items-center justify-between mb-6">
            <View className="flex-1 mr-3">
              <Text className="text-white text-base font-semibold">Submit your review to get 5 points</Text>
            </View>
            <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center">
              <Ionicons name="gift-outline" size={20} color="#fff" />
            </View>
          </View>

          <View className="items-center mb-6">
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => handleSelectStar(star)}
                  className="mx-1"
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color={THEME.colors.rating || '#f5a623'}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <TextInput
              className="bg-white rounded-2xl border border-gray-200 px-4 py-3 text-base h-40 text-gray-900"
              multiline
              textAlignVertical="top"
              placeholder="Would you like to write anything about this product?"
              value={comment}
              onChangeText={(t) => {
                if (t.length <= MAX_CHARS) setComment(t);
              }}
            />
            <Text className="text-gray-400 text-xs mt-2 text-right">
              {comment.length}/{MAX_CHARS} characters
            </Text>
          </View>

          <View className="flex-row mb-8">
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                className="flex-1 h-16 mr-3 last:mr-0 rounded-2xl border border-dashed border-gray-300 items-center justify-center"
              >
                <Ionicons name={i === 0 ? 'image-outline' : 'camera-outline'} size={22} color="#9CA3AF" />
              </View>
            ))}
          </View>

          <ThemedButton
            title={submitting ? 'Submitting...' : 'Submit Review'}
            onPress={handleSubmit}
            disabled={submitting}
          />
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

export default RateProduct;
