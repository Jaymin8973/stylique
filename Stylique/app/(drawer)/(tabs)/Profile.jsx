import { AntDesign, Entypo, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@hooks/useUser';
import { Image } from 'expo-image';

const Profile = () => {
  const router = useRouter();
  /* Removed local user state and fetch logic */
  const { user, isLoading: Loading } = useUser();
  const name = user?.Username;
  const email = user?.Email;

  // Token check is still valid for showing/hiding login UI but data fetching is now handled by hook
  const [token, setToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };
    init();
  }, []);

  /* Removed FetchData function */

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userId');
      AsyncStorage.clear()
      router.replace('/(Authentication)/Login');

    } catch (error) {
      alert(error?.response?.data?.message || error.message);
    }
  }

  if (Loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center ">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mx-7 gap-5 ">

          {token ? (
            <View style={styles.topContent} className=" flex-row justify-between ">
              <View style={styles.logo}>
                <Text style={styles.logoLetter}>
                  {(() => {
                    const raw = (name && name.trim()) || (email && email.split('@')[0]) || 'U';
                    const words = raw.split(/\s+/).filter(Boolean);
                    if (words.length >= 2) {
                      return (words[0][0] + words[1][0]).toUpperCase();
                    }
                    const compact = raw.replace(/[^A-Za-z0-9]/g, '');
                    const base = compact || 'U';
                    return base.slice(0, 2).toUpperCase();
                  })()}
                </Text>
              </View>
              <View className="">
                <Text style={styles.username} >{name}</Text>
                <Text className="text-xl" ellipsizeMode='tail'>{email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => (router.push("EditProfile"))}
              >
                <AntDesign name="setting" size={24} color="#343434" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className=" flex-row items-center justify-between mt-6 ">
              <Image source={require('../../../assets/images/Stylique_Logo.png')} style={{ width: 100, height: 100, borderRadius: 50 }} />
              <TouchableOpacity onPress={() => router.push('/(Authentication)/Login')}>
                <View className="border border-gray-300 px-6 py-3 rounded-md">
                  <Text className="text-[#343434] text-lg font-semibold">Login / Signup</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <View className="rounded-2xl border border-gray-300  px-4 mt-16">
            <TouchableOpacity onPress={() => (router.push("Address"))}>
              <View className="flex-row mt-10 items-center justify-between border-b border-gray-300 pb-3 ">
                <View className="flex-row gap-3 items-center">
                  <Entypo name="location-pin" size={24} color="#343434" />
                  <Text className="text-2xl">Address</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="#343434" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push("PaymentMethod"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Ionicons name="wallet" size={24} color="#343434" />

                  <Text className="text-2xl">Payment method</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="#343434" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push("Voucher"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <AntDesign name="gift" size={24} color="#343434" />

                  <Text className="text-2xl">Voucher</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="#343434" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.push("Wishlist"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Octicons name="heart-fill" size={24} color="#343434" />

                  <Text className="text-2xl">My Wishlist</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="#343434" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.push("Feedback"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Octicons name="star-fill" size={24} color="#343434" />
                  <Text className="text-2xl">Rate this app</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="#343434" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <View className="flex-row  mt-10 items-center justify-between  pb-3">
                <View className="flex-row gap-3 items-center">
                  <MaterialIcons name="logout" size={24} color="#343434" />
                  <Text className="text-2xl">Log out</Text>
                </View>

              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  topContent: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
    backgroundColor: '#343434',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoLetter: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile