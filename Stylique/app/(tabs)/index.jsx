import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Image } from 'expo-image';
import BannerCarousel from '../../components/BannerCarousel';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IpAddress from '../../Config.json';
import data from '../../data.json';

const Home = () => {

  // const [fetchedCategories, setFetchedCategories] = useState([]);
  const icons = ["symbol-female", "symbol-male", "eyeglass", "game-controller" ]
  const Navigation = useNavigation();
  const [Categories, setCategories] = useState("men");


  const fetchedCategories = ["clothing","footwear","accessories","Sports"]


  useEffect(() => {
    // fetchCategories();
  }, [])

  const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:3000`,
});

  // const fetchCategories = async () => {
  //   try {
  //     const response = await API.get('/categories/');
  //     setFetchedCategories(response.data.map(category => (category.name)));
  //   } catch (error) {
  //     if (error.response) {
  //       console.log('Error response:', error.response.data);
  //     }
  //     console.log('Error message:', error.message);
  //   }
  // }


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
              data={data.feature_products}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="overflow-visible"
              renderItem={({ item }) => (
                <View style={styles.productCard} className="m-4">
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <Text>{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
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