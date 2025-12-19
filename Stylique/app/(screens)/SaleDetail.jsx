import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import API from '../../Api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1520975682031-569d9b3c5a73?w=600';

const SaleDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sale, setSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  useEffect(() => {
    if (id) {
      fetchSale();
    }
  }, [id]);

    useEffect(() => {
    if (id) fetchUserWishlist();
  }, [id]);

    const fetchUserWishlist = async () => {
    try {
      if (!id) return;
      const response = await API.get(`/wishlist/user/${id}`);
      const wishlistProductIds = response.data.map(item => item.productId);
      setWishlistItems(wishlistProductIds);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (!id) return;
      const isInWishlist = wishlistItems.includes(productId);

      if (isInWishlist) {
        // Remove from wishlist
        await API.post('/wishlist/remove', { user_id: id, productId });
        setWishlistItems(wishlistItems.filter(id => id !== productId));
      } else {
        // Add to wishlist
        await API.post('/wishlist/add', { user_id: id, productId });
        setWishlistItems([...wishlistItems, productId]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const fetchSale = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/sales/public/${id}`);
      const s = res.data || null;
      setSale(s);
      const items = Array.isArray(s?.items) ? s.items : [];
      const prods = items
        .map((it) => it?.product)
        .filter((p) => !!p && (p.id != null || p.productId != null));
      setProducts(prods);
    } catch (e) {
      console.error('Error fetching sale detail:', e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    if (!sale) return null;

    return (
      <View className="">
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: sale.bannerUrl || FALLBACK_IMAGE }}
            style={styles.heroImage}
          />

          <SafeAreaView style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={25} color="#ffffff" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.sheetTopWrapper}>
        </View>
      </View>
    );
  };

  const renderProduct = ({ item, index }) => {
    const pid = item?.productId || item?.id || index;

    return (
     <Pressable
            onPress={() => router.push({
              pathname: 'ProductDetail',
              params: { id: item?.productId || item?.id || index }
            })}
            className="mb-4 mt-10"
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
                  onPress={() => toggleWishlist(item?.productId || item?.id)}
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
        <Text className="mt-4 text-gray-600">Loading sale...</Text>
      </View>
    );
  }

  if (!sale) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Sale not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {renderHeader()}
      <FlatList
        data={products}
        keyExtractor={(item, index) =>
          item?.productId?.toString() || item?.id?.toString() || index.toString()
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between'}}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 24 ,marginHorizontal: 16 }}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    height: 250,
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

  productImage: {
    width: '100%',
    height: 200,
    contentFit: 'cover',
  },
});

export default SaleDetail;
