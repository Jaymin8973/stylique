import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import API from '../../Api';
import * as SecureStore from 'expo-secure-store';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const idStr = await SecureStore.getItemAsync('userId');
        if (idStr) setUserId(Number(idStr));
      } catch {}
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await API.get(`/wishlist/user/${userId}`);
      setWishlistItems(res.data || []);
    } catch (e) {
      console.error('Wishlist fetch error:', e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setRemoving((r) => ({ ...r, [productId]: true }));
      await API.post('/wishlist/remove', { user_id: userId, productId });
      setWishlistItems((items) => items.filter((i) => i.productId !== productId));
    } catch (e) {
      console.error('Wishlist remove error:', e?.response?.data || e.message);
    } finally {
      setRemoving((r) => ({ ...r, [productId]: false }));
    }
  };

  const goProduct = (id) => router.push(`ProductDetail?id=${id}`);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Pressable onPress={() => goProduct(item.product.id)}>
        <View style={styles.cardImgWrap}>
          <Image source={{ uri: item.product.imageUrl }} style={styles.cardImg} />
          <TouchableOpacity style={styles.heartBadge} onPress={() => removeFromWishlist(item.productId)} disabled={!!removing[item.productId]}>
            {removing[item.productId] ? (
              <ActivityIndicator size="small" color="#e74c3c" />
            ) : (
              <Ionicons name="heart" size={18} color="#e74c3c" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={1}>{item.product.productName}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{parseFloat(item.product.sellingPrice || '0').toFixed(2)}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#2ecc71" />
            <Ionicons name="star" size={14} color="#2ecc71" />
            <Ionicons name="star" size={14} color="#2ecc71" />
            <Ionicons name="star" size={14} color="#2ecc71" />
            <Ionicons name="star-outline" size={14} color="#2ecc71" />
            <Text style={styles.ratingCount}> (50)</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Segments */}
      <View style={styles.segmentWrap}>
        <Pressable style={[styles.segment, styles.segmentActive]} onPress={() => setActiveTab('all')}>
          <Text style={[styles.segmentText, styles.segmentTextActive]}>All items</Text>
        </Pressable>
        <Pressable style={[styles.segment, styles.segmentRight]} onPress={() => setActiveTab('boards')}>
          <Text style={styles.segmentText}>Boards</Text>
        </Pressable>
      </View>

      {/* List / Empty */}
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="heart-outline" size={56} color="#ccc" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySub}>Tap the heart icon to save items for later</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('AlllProducts')}>
            <Text style={styles.shopText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  segmentWrap: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8 },
  segment: { flex: 1, height: 36, borderRadius: 4, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  segmentRight: { backgroundColor: '#fff' },
  segmentActive: { backgroundColor: '#000' },
  segmentText: { fontSize: 14, fontWeight: '600', color: '#000' },
  segmentTextActive: { color: '#fff' },

  grid: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ededed', marginBottom: 16, overflow: 'hidden' },
  cardImgWrap: { position: 'relative', padding: 8 },
  cardImg: { width: '100%', height: 160, borderRadius: 12, backgroundColor: '#f5f5f5' },
  heartBadge: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
  title: { fontSize: 14, color: '#333', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  price: { fontSize: 16, fontWeight: '700', color: '#000' },
  oldPrice: { fontSize: 12, color: '#9e9e9e', textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingCount: { fontSize: 12, color: '#6b7280' },

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginTop: 12, color: '#333' },
  emptySub: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 6 },
  shopBtn: { backgroundColor: '#000', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, marginTop: 20 },
  shopText: { color: '#fff', fontWeight: '600' },
});

export default Wishlist;
