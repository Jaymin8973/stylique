import { SimpleLineIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import BannerCarousel from '../../components/BannerCarousel';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../../Api';



const Home = () => {

  const icons = ["tag", "emotsmile", "eyeglass", "wallet"]
  const [Categories, setCategories] = useState("clothing");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [sales, setSales] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const fetchedCategories = ["All", "clothing", "footwear", "accessories"]


  useEffect(() => {
    fetchCollections();
    fetchSales();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [Categories]);

  const onRefresh = async () => {
    setRefreshing(true);
    filterAndSortProducts();
    fetchCollections();
    fetchSales();
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filterAndSortProducts = async () => {

    const response = await API.get('api/products/all');
    let filtered = response.data || [];

    if (Categories !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === Categories.toLowerCase()
      );
      filtered = filtered.slice(0, 10);
    }
    else if (filtered.length > 0) {
      filtered = filtered.slice(0, 10);
    }

    setFeaturedProducts(filtered);

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
    }  style={{ backgroundColor: "white" }} >
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
          return (
            <>
              <View className="flex-row items-center px-5 mt-6 justify-between">
                <Text className="text-xl font-bold">Sale</Text>
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
                    <View style={{ borderRadius: 24, overflow: 'hidden', height: 200 }}>
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
    resizeMode: 'cover',
  },
});