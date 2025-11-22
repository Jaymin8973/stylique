import { SimpleLineIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import BannerCarousel from '../../components/BannerCarousel';

import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import API from '../../Api';
import data from '../../data.json';

const Home = () => {

  // const [fetchedCategories, setFetchedCategories] = useState([]);
  const icons = ["symbol-female", "symbol-male", "eyeglass", "game-controller" ]
  const [Categories, setCategories] = useState("men");
  const [featuredProducts, setFeaturedProducts] = useState(data.feature_products || []);
  const [collections, setCollections] = useState([]);
  const [sales, setSales] = useState([]);

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const fetchedCategories = ["clothing","footwear","accessories","Sports"]


  useEffect(() => {
    fetchFeaturedProducts();
    fetchCollections();
    fetchSales();
  }, [])

  const fetchFeaturedProducts = async () => {

    try {
      const response = await API.get('api/products/all');
      const allProducts = response.data || [];
      const featured = allProducts.filter(item => item.isFeatured).slice(0, 10);

      if (featured.length > 0) {
        setFeaturedProducts(featured);
      } else if (allProducts.length > 0) {
        setFeaturedProducts(allProducts.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCollections = async () => {

    try {
      const response = await API.get('/api/collections/public');
      setCollections(response.data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await API.get('/api/sales/public');
      setSales(response.data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };


  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredProducts.length;
        if (flatListRef.current) {
          try {
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
          } catch (e) {
            // ignore scroll errors
          }
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredProducts]);

  const collectionBanners = (collections || [])
    .filter((c) => c.imageUrl)
    .map((c) => ({ id: String(c.id), image: c.imageUrl }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}  >
          <View className="flex-row mb-10  w-screen justify-around">
            {fetchedCategories.map((category, index) => (
              <Pressable key={index} onPress={() => setCategories(category)}>
                <View className="flex justify-center  items-center">
                  <View className={Categories === category ? `flex justify-center  items-center rounded-full h-20 w-20 border border-[#3A2C27]` : 'flex justify-center  items-center rounded-full h-20 w-20'}>
                    <View className={Categories === category ? "bg-[#3A2C27] rounded-full justify-center items-center" : ' rounded-full justify-center items-center bg-[#F3F3F3]'} style={{ height: 60, width: 60 }}>
                      <SimpleLineIcons
                        name={icons[index] ? icons[index].trim() : "question"}
                        size={24}
                        color={Categories === category ? "white" : "gray"}
                      />

                    </View>
                  </View>
                  <Text className="text-center mt-2">{category}</Text>
                </View>
              </Pressable>
            ))}
          </View>
            </ScrollView>
          {collectionBanners.length > 0 ? (
            <BannerCarousel
              banners={collectionBanners}
              onPressCta={(item) =>
                router.push({
                  pathname: '/(screens)/CollectionDetail',
                  params: { id: item.id },
                })
              }
            />
          ) : (
            <BannerCarousel onPressCta={() => router.push('/AlllProducts')} />
          )}

          <View className="flex-row  items-center px-5 mt-3 justify-between">
            <Text className="text-3xl font-bold">Feature Products</Text>
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
                  <View style={styles.productCard} className="m-4">
                    <Image
                      source={{
                        uri:
                          item.imageUrl ||
                          item.image ||
                          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
                      }}
                      style={styles.productImage}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productName}
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
                </Pressable>
              )}
            />
          </View>

          {sales.length > 0 && (
            (() => {
              const sale = sales[0];
              return (
                <>
                  <View className="flex-row items-center px-5 mt-6 justify-between">
                    <Text className="text-3xl font-bold">Sale</Text>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/(screens)/SaleDetail',
                          params: { id: String(sale.id) },
                        })
                      }
                    >
                      <Text className="text-xl text-gray-500">View</Text>
                    </Pressable>
                  </View>

                  <View className="mt-4 px-5">
                    <Pressable
                      className="mb-4"
                      onPress={() =>
                        router.push({
                          pathname: '/(screens)/SaleDetail',
                          params: { id: String(sale.id) },
                        })
                      }
                    >
                      <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                        <View style={{ borderRadius: 24, overflow: 'hidden', height: 160 }}>
                          <Image
                            source={{
                              uri:
                                sale.bannerUrl ||
                                'https://images.unsplash.com/photo-1520975682031-569d9b3c5a73?w=600',
                            }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </>
              );
            })()
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  productCard: {

  },
  productName: {
    maxWidth: 150,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor:'white'
  },
  productImage: {
    width: 150,
    height: 220,
    borderRadius: 10,
  },
});