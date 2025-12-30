import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import API from '../../Api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1520975682031-569d9b3c5a73?w=600';

const SaleDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sale, setSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});
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

  // Fetch cart items to check which products are already in cart
  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const res = await API.get('/api/cart');
      const items = res.data?.items || [];
      const productIds = items.map((it) => it.productId ?? it.product?.id);
      setCartItems(productIds);
    } catch (e) {
      // Silent fail
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add to cart with sale discounted price
  const addToCartWithSalePrice = async (productId, salePrice) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/(Authentication)/Login');
        return;
      }

      setAddingToCart((prev) => ({ ...prev, [productId]: true }));

      await API.post('/api/cart/add', {
        productId: Number(productId),
        quantity: 1,
        salePrice: salePrice, // Pass the discounted sale price
      });

      setCartItems((prev) => [...prev, productId]);
      Toast.show({ type: 'success', text1: 'Added to cart with sale price!' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to add to cart' });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Check if product is in cart
  const isInCart = (productId) => cartItems.includes(productId);

  const renderHeader = () => {
    if (!sale) return null;

    const discountPercent = parseFloat(sale?.discountValue || 0);

    return (
      <View className="">
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: sale.bannerUrl || FALLBACK_IMAGE }}
            style={styles.heroImage}
          />

          {/* Gradient Overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          />

          <SafeAreaView style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={25} color="#ffffff" />
              </Pressable>

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <View
                  style={{
                    backgroundColor: '#ef4444',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    transform: [{ rotate: '-3deg' }],
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                    {discountPercent}% OFF
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>

          {/* Sale Info Overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {sale.name}
              </Text>

              {sale.description && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 14,
                  }}
                  numberOfLines={2}
                >
                  {sale.description}
                </Text>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                <View
                  style={{
                    backgroundColor: '#22c55e',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    SALE LIVE
                  </Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  {products.length} Products
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sheetTopWrapper}>
        </View>
      </View>
    );
  };

  const renderProduct = ({ item, index }) => {
    const pid = item?.productId || item?.id || index;

    // Calculate discounted price based on sale discount
    const originalPrice = parseFloat(item?.sellingPrice || item?.price || 0);
    const discountPercent = parseFloat(sale?.discountValue || 0);
    const discountedPrice = discountPercent > 0
      ? (originalPrice - (originalPrice * discountPercent / 100)).toFixed(0)
      : originalPrice.toFixed(0);
    const hasDiscount = discountPercent > 0;

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

            {/* Sale Badge */}
            {hasDiscount && (
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: '#ef4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  {discountPercent}% OFF
                </Text>
              </View>
            )}

          </View>
          <View className="p-3">
            <Text className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
              {item?.productName || 'Unknown Product'}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">
              {item?.brand || 'Stylique'}
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              {hasDiscount ? (
                <View className="flex-row items-center gap-2">
                  <Text style={{
                    textDecorationLine: 'line-through',
                    color: '#9ca3af',
                    fontSize: 12,
                  }}>
                    ₹{originalPrice.toFixed(0)}
                  </Text>
                  <Text className="text-lg font-bold text-green-600">
                    ₹{discountedPrice}
                  </Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-gray-900">
                  ₹{originalPrice.toFixed(0)}
                </Text>
              )}
            </View>

            {/* Add to Cart Button */}
            {isInCart(pid) ? (
              <TouchableOpacity
                onPress={() => router.push('/(drawer)/(tabs)/Cart')}
                style={{
                  backgroundColor: '#e5e7eb',
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                  In Cart
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  addToCartWithSalePrice(pid, discountedPrice);
                }}
                disabled={addingToCart[pid]}
                style={{
                  backgroundColor: '#343434',
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="cart-outline" size={14} color="white" />
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                  {addingToCart[pid] ? 'Adding...' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            )}
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
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 24, marginHorizontal: 16 }}
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
