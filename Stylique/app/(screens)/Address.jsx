import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IpAddress from '../../Config.json';

const Address = () => {
    const [selected, setSelected] = useState(null);
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const API = axios.create({
        baseURL: `http://${IpAddress.IpAddress}:3000`,
    })

    const fetchData = async () => {
        try {
            const email = await SecureStore.getItemAsync('userEmail')
            const res = await API.post(`/address/get`, { email })
            setAddresses(res.data);
            const selectedAddress = res.data.find(addr => addr.selected === true);

            if (selectedAddress) {
                setSelected(selectedAddress.addressType);
            } else if (res.data.length > 0) {
                setSelected(res.data[0].addressType);
            } else {
                setSelected(null);
            }
        }
        catch (error) {
            if (error.response) {
                alert(error.response.data.message || "Server error");
            } else if (error.request) {
                alert("Network error, please try again");
            } else {
                console.log(error.message);
                alert(error.message);
            }
        }

    }
    const SelectHandle = async (address_id, addressType) => {
        const email = await SecureStore.getItemAsync('userEmail')
        setSelected(addressType);
        try {
            const Res = await API.put('/address/updateSelected', { address_id , email })
            setLoading(true);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message || "Server error");
            } else if (error.request) {
                alert("Network error, please try again");
            } else {
                console.log(error.message);
                alert(error.message);
            }
            setLoading(false);
        }

    }

    if (loading) {
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-grow  mx-5 my-10 " contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                <View className="">
                    {addresses && addresses.map((address, index) => (
                        <View className="mb-10" key={index}>
                            <View className="border border-gray-300 rounded-2xl p-5 gap-4">
                                <Pressable
                                    key={address.value}
                                    className="mb-4"
                                    onPress={() => SelectHandle(address.address_id, address.addressType)}
                                >
                                    <View className="flex-row gap-5 " >
                                        <View className="justify-center">

                                            <View
                                                className={`w-6 h-6 rounded-full border-2 ${selected === address.addressType ? 'border-black' : 'border-black'
                                                    } justify-center items-center`}
                                            >
                                                {selected === address.addressType && (
                                                    <View className="w-3 h-3 rounded-full bg-black" />
                                                )}
                                            </View>


                                        </View>
                                        <View className=" justify-center">
                                            {address.addressType === "work" ? (
                                                <FontAwesome5 name="building" size={30} color="black" />
                                            ) : address.addressType === "home" ? (
                                                <FontAwesome5 name="home" size={30} color="black" />
                                            ) : (
                                                <FontAwesome5 name="building" size={30} color="black" />
                                            )}
                                        </View>
                                        <View>
                                            <Text className="text-lg">SEND TO</Text>
                                            <Text className="text-lg">My {address.addressType}</Text>
                                        </View>
                                        <View className="ms-auto">
                                            <Pressable onPress={() => router.push('AddressForm')}>
                                                <Text className="text-red-500 border-b border-red-500 text-lg">Edit</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-center text-gray-500 text-lg">{address.street}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
                <View className="items-center mb-10">
                    <TouchableOpacity onPress={() => router.push('AddressForm')} className="bg-[#343434] py-5 px-10 rounded-full">
                        <Text className="text-white font-semibold">Add New Address</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default Address