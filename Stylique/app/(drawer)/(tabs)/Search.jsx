import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import API from '../../../Api';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const slide1 = useRef(new Animated.Value(1000)).current;
  const slide2 = useRef(new Animated.Value(1000)).current;
  const slide3 = useRef(new Animated.Value(1000)).current;
  const [Clothingcategories, setClothingcategories] = useState([]);
  const [ShoesCategories, setShoesCategories] = useState([]);
  const [AccessoriesCatgories, setAccessoriesCatgories] = useState([]);
  const firstTime = useRef(true);
  const router = useRouter();
  useEffect(() => {
    fetchCatItems()
  }, []);



  const fetchCatItems = async () => {
    const response = await API.get('api/products/categoryCounts')
    const clothing = await response.data.clothing
    const footwear = await response.data.footwear
    const accessories = await response.data.accessories
    setClothingcategories(clothing)
    setAccessoriesCatgories(accessories)
    setShoesCategories(footwear)
  }



  const [showClothing, setShowClothing] = useState(false);
  const clothingAnim = useRef(new Animated.Value(0)).current;

  const toggleClothing = () => {
    const newState = !showClothing;

    if (newState) {
      setShowShoes(false);
      setShowAccessories(false);
    }

    setShowClothing(newState);


    Animated.timing(clothingAnim, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(shoesAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(AccessoriesAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };


  const clothingHeight = clothingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Clothingcategories.length * 60],
  });

  const clothingOpacity = clothingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });


  // SHOES
  const [showShoes, setShowShoes] = useState(false);
  const shoesAnim = useRef(new Animated.Value(0)).current;

  const toggleShoes = () => {
    const newState = !showShoes;
    if (newState) {

      setShowClothing(false)
      setShowAccessories(false)
    }
    setShowShoes(newState);

    Animated.timing(shoesAnim, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(clothingAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(AccessoriesAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const shoesHeight = shoesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ShoesCategories.length * 60],
  });

  const shoesOpacity = shoesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });



  const [showAccessories, setShowAccessories] = useState(false);
  const AccessoriesAnim = useRef(new Animated.Value(0)).current;

  const toggleAccessories = () => {
    const newState = !showAccessories;
    if (newState) {

      setShowClothing(false)
      setShowShoes(false)
    }
    setShowAccessories(newState);

    Animated.timing(AccessoriesAnim, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(clothingAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(shoesAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const AccessoriesHeight = AccessoriesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, AccessoriesCatgories.length * 60],
  });

  const AccessoriesOpacity = AccessoriesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!firstTime.current) {
        return;
      }

      // First time → Run animation
      firstTime.current = false;

      slide1.setValue(1000);
      slide2.setValue(1000);
      slide3.setValue(1000);

      Animated.stagger(150, [
        Animated.timing(slide1, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(slide2, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(slide3, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
      ]).start();
    }, [])
  );




  return (
    <>
      <StatusBar style="dark" />
      <View className="bg-white">
        {/* Fixed Header Section - Absolutely Positioned */}
        <View className="absolute top-0 left-0 right-0 bg-white z-10 ">
          <View className="px-5 pt-4 pb-3">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <Ionicons name="search" size={20} color="#343434" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                placeholder="Search products..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View>
        </View>
      </View>
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 pt-28 px-5 bg-white">
          <Animated.View style={{ transform: [{ translateX: slide1 }] }}>
            <Pressable
              className="mb-4"
              onPress={toggleClothing}
            >
              <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                  <Image
                    source={require('../../../assets/images/clothing-01.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>


            </Pressable>

            <Animated.View style={{ height: clothingHeight, opacity: clothingOpacity, overflow: 'hidden' }}>
              {Clothingcategories.map(item => (
                <Pressable
                  key={item.subCategory}
                  className="flex-row justify-between mx-3 border-b border-gray-200 py-5"
                  onPress={() => router.push({
                    pathname: '/AlllProducts',
                    params: { subcategory: item?.subCategory || index }
                  })}
                >
                  <View>
                    <Text >{item.subCategory}</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <Text className="text-gray-400 font-se">{item.count}</Text>
                    <Ionicons name='chevron-forward' size={20} />
                  </View>
                </Pressable>
              ))}
            </Animated.View>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateX: slide2 }] }}>
            <Pressable
              className="mb-4 "
              onPress={toggleShoes}
            >
              <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                  <Image
                    source={require('../../../assets/images/Discover-Footwear.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>
            </Pressable>
            <Animated.View style={{ height: shoesHeight, opacity: shoesOpacity, overflow: 'hidden' }}>
              {ShoesCategories.map(item => (
                <Pressable
                  key={item.subCategory}
                  className="flex-row justify-between mx-3 border-b border-gray-200 py-5"
                  onPress={() => router.push({
                    pathname: '/AlllProducts',
                    params: { subcategory: item?.subCategory || index }
                  })}
                >
                  <View>
                    <Text >{item.subCategory}</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <Text className="text-gray-400 font-se">{item.count}</Text>
                    <Ionicons name='chevron-forward' size={20} />
                  </View>
                </Pressable>
              ))}
            </Animated.View>
          </Animated.View>


          <Animated.View style={{ transform: [{ translateX: slide3 }] }}>
            <Pressable
              className="mb-4"
              onPress={toggleAccessories}
            >
              <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                  <Image
                    source={require('../../../assets/images/Discover-Accessories.png')}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>
            </Pressable>

            <Animated.View style={{ height: AccessoriesHeight, opacity: AccessoriesOpacity, overflow: 'hidden' }}>
              {AccessoriesCatgories.map(item => (
                <Pressable
                  key={item.subCategory}
                  className="flex-row justify-between mx-3 border-b border-gray-200 py-5"
                  onPress={() => router.push({
                    pathname: '/AlllProducts',
                    params: { subcategory: item?.subCategory || index }
                  })}
                >
                  <View>
                    <Text >{item.subCategory}</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <Text className="text-gray-400 font-se">{item.count}</Text>
                    <Ionicons name='chevron-forward' size={20} />
                  </View>
                </Pressable>
              ))}
            </Animated.View>
          </Animated.View>
        </View>

      </ScrollView>
    </>


  )
}

export default Search