import { SimpleLineIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import BannerCarousel from '../../../components/BannerCarousel';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProducts } from '../../../hooks/useProducts';
import { useCollections } from '../../../hooks/useCollections';
import { useSales } from '../../../hooks/useSales';



const Home = () => {

  const icons = ["user", "user-female", "people", "bag"]
  const [Categories, setCategories] = useState("All");
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  // Clothing-only store: filter by gender
  const fetchedCategories = ["All", "Male", "Female", "Unisex"]


  const { products, refetch: refetchProducts } = useProducts();
  const { collections, refetch: refetchCollections } = useCollections();
  const { sales, refetch: refetchSales } = useSales();

  useEffect(() => {
    filterAndSortProducts();
  }, [Categories, products]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchProducts(), refetchCollections(), refetchSales()]);
    // filterAndSortProducts will run via useEffect dependence on products
    setRefreshing(false);
  };

  const filterAndSortProducts = () => {
    let filtered = products || [];

    // Filter by gender for clothing-only store
    if (Categories !== 'All') {
      filtered = filtered.filter(item =>
        item.gender?.toLowerCase() === Categories.toLowerCase()
      );
      filtered = filtered.slice(0, 10);
    }
    else if (filtered.length > 0) {
      filtered = filtered.slice(0, 10);
    }
    setFeaturedProducts(filtered);
  };

  /* Removed fetchCollections and fetchSales functions as they are handled by hooks */

  const collectionBanners = (collections || [])
    .filter((c) => c.imageUrl)
    .map((c) => ({ id: String(c.id), image: c.imageUrl }));




  return (
    <ScrollView horizontal={false} contentContainerStyle={styles.container} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={["black"]}
        tintColor="black"
      />
    } style={{ backgroundColor: "white" }} >
      <View className="flex-row my-5 w-screen justify-around" >
        {fetchedCategories.map((category, index) => (
          <Pressable key={index} onPress={() => setCategories(category)}>


            <View
              style={{
                height: 65,
                width: 65,
                borderRadius: 32.5,
                borderWidth: Categories === category ? 1 : 0,
                borderColor: "#3A2C27",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <View
                style={{
                  height: 55,
                  width: 55,
                  borderRadius: 27.5,
                  backgroundColor:
                    Categories === category ? "#3A2C27" : "#F3F3F3",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SimpleLineIcons
                  name={icons[index] ? icons[index].trim() : "question"}
                  size={24}
                  color={Categories === category ? "white" : "gray"}
                />
              </View>

            </View>

            <Text className="text-center text-sm mt-1">{category}</Text>

          </Pressable>
        ))}
      </View>



      <BannerCarousel
        banners={collectionBanners}
        onPressCta={(item) =>
          router.push({
            pathname: "/(screens)/CollectionDetail",
            params: { id: item.id },
          })
        }
      />
      <View className="flex-row  items-center px-5 mt-8 justify-between">
        <Text className="text-xl font-bold">Recently Added</Text>
        <Pressable onPress={() => router.push('/AlllProducts')}>
          <Text className="text-xl text-gray-500">Show all</Text>
        </Pressable>
      </View>
      <View className="mt-5 px-5 ">
        <FlatList
          ref={flatListRef}
          data={featuredProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="overflow-visible"
          keyExtractor={(item, index) =>
            item?.productId?.toString() || item?.id?.toString() || index.toString()
          }
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/ProductDetail',
                  params: { id: item?.productId || item?.id || index },
                })
              }

            >
              <View style={styles.productCard} className="m-2  bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <Image
                  source={{
                    uri:
                      item.imageUrl ||
                      item.image ||
                      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
                  }}
                  style={styles.productImage}
                />
                <View className="p-3">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.productName}
                    className="text-sm text-gray-700"
                  >
                    {item.productName || item.name}
                  </Text>

                  <Text>
                    ₹
                    {item.sellingPrice != null
                      ? item.sellingPrice
                      : item.price}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      {sales.length > 0 && (
        (() => {
          const sale = sales[0];
          const discountValue = sale.discountValue || 0;
          const endDate = sale.endAt ? new Date(sale.endAt) : null;
          const now = new Date();
          const isEnding = endDate && (endDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;

          // Calculate time remaining
          const getTimeRemaining = () => {
            if (!endDate) return null;
            const diff = endDate.getTime() - now.getTime();
            if (diff <= 0) return null;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return { days, hours, mins };
          };
          const timeLeft = getTimeRemaining();

          return (
            <View className="mt-8 px-5">
              {/* Sale Card */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/SaleDetail',
                    params: { id: String(sale.id) },
                  })
                }
              >
                <View
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 24,
                    overflow: 'hidden',
                    elevation: 10,
                    shadowColor: '#6366f1',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  }}
                >
                  {/* Top Section with Banner */}
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{
                        uri: sale.bannerUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
                      }}
                      style={{ width: '100%', height: 160 }}
                    />

                    {/* Gradient Overlay */}
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(26, 26, 46, 0.6)',
                      }}
                    />

                    {/* Discount Badge - Big and Bold */}
                    {discountValue > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: '#f43f5e',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 16,
                            transform: [{ rotate: '3deg' }],
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 28, fontWeight: '900' }}>
                            {discountValue}%
                          </Text>
                          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
                            OFF
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Sale Title on Banner */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 80,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 6,
                        }}
                      >
                        <Text style={{ fontSize: 20, marginRight: 6 }}>🔥</Text>
                        <View
                          style={{
                            backgroundColor: '#22c55e',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
                            LIVE
                          </Text>
                        </View>
                        {isEnding && (
                          <View
                            style={{
                              backgroundColor: '#ef4444',
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 6,
                              marginLeft: 6,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
                              ENDING SOON
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 22,
                          fontWeight: 'bold',
                        }}
                        numberOfLines={1}
                      >
                        {sale.name}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Section - Info & Timer */}
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: '#16213e',
                    }}
                  >
                    {/* Countdown Timer */}
                    {timeLeft && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{ color: '#94a3b8', fontSize: 12, marginRight: 10 }}>
                          Ends in:
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          {/* Days */}
                          <View
                            style={{
                              backgroundColor: '#1e3a5f',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 10,
                              alignItems: 'center',
                              minWidth: 50,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                              {timeLeft.days}
                            </Text>
                            <Text style={{ color: '#94a3b8', fontSize: 9 }}>DAYS</Text>
                          </View>
                          <Text style={{ color: '#6366f1', fontSize: 20, fontWeight: 'bold' }}>:</Text>
                          {/* Hours */}
                          <View
                            style={{
                              backgroundColor: '#1e3a5f',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 10,
                              alignItems: 'center',
                              minWidth: 50,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                              {String(timeLeft.hours).padStart(2, '0')}
                            </Text>
                            <Text style={{ color: '#94a3b8', fontSize: 9 }}>HRS</Text>
                          </View>
                          <Text style={{ color: '#6366f1', fontSize: 20, fontWeight: 'bold' }}>:</Text>
                          {/* Minutes */}
                          <View
                            style={{
                              backgroundColor: '#1e3a5f',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 10,
                              alignItems: 'center',
                              minWidth: 50,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                              {String(timeLeft.mins).padStart(2, '0')}
                            </Text>
                            <Text style={{ color: '#94a3b8', fontSize: 9 }}>MINS</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Description */}
                    {sale.description && (
                      <Text
                        style={{
                          color: '#94a3b8',
                          fontSize: 13,
                          textAlign: 'center',
                          marginBottom: 12,
                        }}
                        numberOfLines={2}
                      >
                        {sale.description}
                      </Text>
                    )}

                    {/* Shop Now Button */}
                    <View
                      style={{
                        backgroundColor: '#6366f1',
                        paddingVertical: 14,
                        borderRadius: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginRight: 8,
                        }}
                      >
                        Shop Now
                      </Text>
                      <Text style={{ color: 'white', fontSize: 18 }}>→</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })()
      )}
    </ScrollView>

  )
}


export default Home

const styles = StyleSheet.create({
  productCard: {

  },
  productName: {
    maxWidth: 150,
    marginTop: 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white'
  },
  productImage: {
    width: 180,
    height: 220,
    contentFit: 'cover',
  },
});