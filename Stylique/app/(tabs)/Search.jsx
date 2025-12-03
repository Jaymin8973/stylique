import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const slide1 = useRef(new Animated.Value(1000)).current;
  const slide2 = useRef(new Animated.Value(1000)).current;
  const slide3 = useRef(new Animated.Value(1000)).current;

  useFocusEffect(
    React.useCallback(() => {
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
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
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


          <View className="flex-1 pt-28 px-5 bg-white">
            <Animated.View style={{ transform: [{ translateX: slide1 }] }}>
              <Pressable
                className="mb-4"
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/SaleDetail',
                  })
                }
              >
                <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                  <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                    <Image
                      source={require('../../assets/images/clothing-01.png')}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                </View>
                
                  <Pressable className="flex-row justify-between mx-3  border-b border-gray-400 py-5">
                    <View>
                    <Text>Jacket</Text>
                    </View>
                     <View>
                    <Text>128 Items</Text>
                    </View>
                  </Pressable>
                  
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ translateX: slide2 }] }}>
              <Pressable
                className="mb-4"
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/SaleDetail',
                  })
                }
              >
                <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                  <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                    <Image
                      source={require('../../assets/images/Discover-Footwear.png')}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                </View>
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ translateX: slide3 }] }}>
              <Pressable
                className="mb-4"
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/SaleDetail',
                  })
                }
              >
                <View className="bg-white rounded-3xl overflow-hidden" style={{ elevation: 2 }}>
                  <View style={{ borderRadius: 24, overflow: 'hidden', height: 170 }}>
                    <Image
                      source={require('../../assets/images/Discover-Accessories.png')}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </>


  )
}

export default Search