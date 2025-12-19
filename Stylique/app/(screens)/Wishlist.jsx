import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as SecureStore from 'expo-secure-store';
import API from '../../Api';
import { Ionicons } from '@expo/vector-icons';
const Wishlist = () => {


  const [wishlistItems, setWishlistItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [removing, setRemoving] = React.useState({});
  const router = useRouter();

  const [userId, setUserId] = React.useState(null);


  useEffect(() => {
    const loadUserId = async () => {
      try {
        const idStr = await SecureStore.getItemAsync('userId');
        if (idStr) setUserId(Number(idStr));
      } catch (e) {
        console.error('Error loading userId from SecureStore:', e);
      }
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



  const renderAllCard = ({ item }) => (

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



  const FirstRoute = () => (
    <View className="flex-1 bg-white p-4">
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
          renderItem={renderAllCard}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );





  const SecondRoute = () => (
    <View className="flex-1 bg-white p-4">
      {/* Grid wrapper */}
      <View className="flex-row gap-2 h-56  rounded-xl  overflow-hidden">

        {/* Box 1 → grid-row: span 3 */}
        <View className="w-[28%] h-[100%] bg-red-300 items-center justify-center">
          <Image source={{ uri: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Box 2 → grid-row: span 3 */}
        <View className="w-[28%] h-[100%] bg-blue-300 items-center justify-center">
          <Image source={{ uri: "https://plus.unsplash.com/premium_photo-1667520043080-53dcca77e2aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Box 3 → grid-row: span 2 */}
        <View className="w-[19.5%] h-[60%] bg-green-300 items-center justify-center">
          <Image source={{ uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Box 4 → col 3, row 3 */}
        <View className="absolute left-[59.5%] top-[63%] w-[19.5%] h-[40%] bg-yellow-300 items-center justify-center">
          <Image source={{ uri: "https://plus.unsplash.com/premium_photo-1682096515837-81ef4d728980?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Box 5 → col 4, row 1 */}
        <View className="absolute left-[80.5%] top-0 w-[19.5%] h-[40%] bg-purple-300 items-center justify-center">
          <Image source={{ uri: "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

        {/* Box 6 → col 4, row 2–3 span */}
        <View className="absolute left-[80.5%] top-[43%] w-[19.5%] h-[60%] bg-orange-300 items-center justify-center">
          <Image source={{ uri: "https://images.unsplash.com/photo-1611042553484-d61f84d22784?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fHww" }} style={{ width: '100%', height: '100%' }} />
        </View>

      </View>
      <Pressable className="flex-row items-end justify-between mt-4 ">
        <Text className="text-3xl font-semibold mt-4 ">Going out outfits</Text>
        <Ionicons name="chevron-forward" size={20} color="#343434" />
      </Pressable>
      <Text className="text-gray-400 mt-2">12 Items</Text>
    </View>
  );


  const layout = Dimensions.get('window');


  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'All items' },
    { key: 'second', title: 'Boards' },

  ]);
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={(props) => (
        <View className=" bg-white">
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicator}
            activeColor='white'
            inactiveColor='black'
          />
        </View>
      )}
      onIndexChange={setIndex}
    />
  )
}

const styles = StyleSheet.create({


  tabBar: {
    backgroundColor: "white",
    elevation: 0,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 16,
    marginTop: 16,
  },

  indicator: {
    backgroundColor: "#000",
    height: "100%",
  },


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

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginTop: 12, color: '#333' },
  emptySub: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 6 },
  shopBtn: { backgroundColor: '#000', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, marginTop: 20 },
  shopText: { color: '#fff', fontWeight: '600' },
});

export default Wishlist