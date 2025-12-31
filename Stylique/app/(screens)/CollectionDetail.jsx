import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useCollections } from '@hooks/useCollections';
import { useWishlist } from '@hooks/useWishlist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1520975682031-569d9b3c5a73?w=600';

const CollectionDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  /* Hook Integration */
  const { useCollectionDetail } = useCollections();
  const { data: collection, isLoading: loading } = useCollectionDetail(id);

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getUserId = async () => {
      const uid = await AsyncStorage.getItem('userId');
      if (uid) setUserId(Number(uid));
    };
    getUserId();
  }, []);

  const { useUserWishlist, toggleWishlist } = useWishlist(userId);
  const { data: wishlistItemsData = [] } = useUserWishlist();
  const wishlistItems = Array.isArray(wishlistItemsData) ? wishlistItemsData.map(item => item.productId || item.id) : [];

  const products = collection?.items?.map(it => it?.product).filter(p => !!p) || [];

  const handleToggleWishlist = async (productId) => {
    if (!userId) {
      router.push('/(Authentication)/Login');
      return;
    }
    const isInWishlist = wishlistItems.includes(productId);
    await toggleWishlist({ productId, isInWishlist });
  };



  const renderProduct = ({ item, index }) => {
    const pid = item?.productId || item?.id || index;

    return (
      <Pressable
        onPress={() => router.push({
          pathname: 'ProductDetail',
          params: { id: item?.productId || item?.id || index }
        })}
        className="mb-4 "
        style={{ width: '45%' }}
      >
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <View className="relative">
            <Image
              source={{
                uri: item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'
              }}
              style={styles.productImage}
            />
            <Pressable
              onPress={() => handleToggleWishlist(item?.productId || item?.id)}
              className="absolute top-2 left-2 bg-white/90 rounded-full p-2"
            >
              <Ionicons
                name={wishlistItems.includes(item?.productId || item?.id) ? 'heart' : 'heart-outline'}
                size={18}
                color={wishlistItems.includes(item?.productId || item?.id) ? '#e74c3c' : '#343434'}
              />
            </Pressable>

          </View>
          <View className="p-3">
            <Text className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
              {item?.productName || 'Unknown Product'}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">
              {item?.brand || 'Stylique'}
            </Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-900">
                ₹{item?.sellingPrice || '0.00'}
              </Text>

            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading collection...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Collection not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white ">
      <FlatList
        data={products}
        keyExtractor={(item, index) =>
          item?.productId?.toString() || item?.id?.toString() || index.toString()
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 24 }}

        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    height: 320,
    backgroundColor: '#E5E5E5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    contentFit: 'cover',
  },
  heroSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTopWrapper: {
    marginTop: -24,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  productImage: {
    width: '100%',
    height: 200,
    contentFit: 'cover',
  },
});

export default CollectionDetail;
