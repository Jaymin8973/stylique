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
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const fetchedCategories = ["clothing","footwear","accessories","Sports"]


  useEffect(() => {
    fetchFeaturedProducts();
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
                    <View className={Categories === category ? "bg-[#3A2C27] rounded-full justify-center items-center" : ' rounded-full justify-center items-center bg-gray-200'} style={{ height: 60, width: 60 }}>
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
          <BannerCarousel onPressCta={() => router.push('/AlllProducts')} />

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
  },
  productImage: {
    width: 150,
    height: 220,
    borderRadius: 10,
  },
});