import { AntDesign, Entypo, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IpAddress from '../../Config.json';
const Profile = () => {
  const router = useRouter();
   const [image , setImage] = useState(null);
  const [name , setName] = useState(null);
  const [email , setEmail] = useState(null);
  const [Loading , setLoading] = useState(false);
  const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:3000`,
});
  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = async () => {
    try {
      setLoading(true);
      const email = await SecureStore.getItemAsync('userEmail');
      const res = await API.post(`/users/user`, { email });
      const Name = res.data.user.firstname + " " + res.data.user.lastname;
      setImage(res.data.user.image);
      setName(Name);
      setEmail(res.data.user.email);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      
      
    await SecureStore.deleteItemAsync('userEmail');
    await AsyncStorage.removeItem('userToken');
    router.replace('Login');
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
    
    <SafeAreaView className= "flex-1">
        <ScrollView  contentContainerStyle={{ flexGrow: 1 , justifyContent: 'center' }}>
        <View className="mx-7 gap-5 ">
          <View style={styles.topContent} className=" flex-row justify-around">
            <Image
              source={{ uri: image }}
              style={styles.logo}
            />
            <View className="">
              <Text style={styles.username}>{name}</Text>
              <Text className="text-xl">{email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => (router.push("EditProfile"))}
            >
              <AntDesign name="setting" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="rounded-2xl border border-gray-300  px-4">
            <TouchableOpacity onPress={() => (router.push("Address"))}>
              <View className="flex-row mt-10 items-center justify-between border-b border-gray-300 pb-3 ">
                <View className="flex-row gap-3 items-center">
                  <Entypo name="location-pin" size={24} color="black" />
                  <Text className="text-2xl">Address</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push("Payment"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Ionicons name="wallet" size={24} color="black" />

                  <Text className="text-2xl">Payment method</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push("Voucher"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <AntDesign name="gift" size={24} color="black" />

                  <Text className="text-2xl">Voucher</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.push("Test"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Octicons name="heart-fill" size={24} color="black" />

                  <Text className="text-2xl">My Wishlist</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.push("Feedback"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <Octicons name="star-fill" size={24} color="black" />
                  <Text className="text-2xl">Rate this app</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                  <MaterialIcons name="logout" size={24} color="black" />
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
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Profile