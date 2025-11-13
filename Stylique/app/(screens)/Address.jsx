import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IpAddress from '../../Config.json';
import { THEME } from '../../constants/Theme';
import { ThemedContainer, ThemedSection, ThemedButton } from '../../components/ThemedComponents';

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

    return (
        <ThemedContainer>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1">
                    <ThemedSection className="pt-4 pb-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">Delivery Address</Text>
                            <ThemedButton 
                                title="Add New" 
                                onPress={() => router.push('AddressForm')}
                                variant="secondary"
                                icon="add"
                            />
                        </View>

                        {loading ? (
                            <View className="flex-1 justify-center items-center py-12">
                                <ActivityIndicator size="large" color={THEME.colors.primary} />
                                <Text className="mt-4 text-gray-600">Loading addresses...</Text>
                            </View>
                        ) : addresses.length === 0 ? (
                            <View className="flex-1 justify-center items-center py-12">
                                <FontAwesome5 name="map-marked-alt" size={48} color={THEME.colors.text.tertiary} />
                                <Text className="mt-4 text-gray-500 text-center">
                                    No addresses found. Add your first address to get started.
                                </Text>
                                <ThemedButton 
                                    title="Add Address" 
                                    onPress={() => router.push('AddressForm')}
                                    className="mt-6"
                                />
                            </View>
                        ) : (
                            <View className="gap-4">
                                {addresses.map((address) => (
                                    <Pressable
                                        key={address.address_id}
                                        onPress={() => SelectHandle(address.address_id, address.addressType)}
                                        className={`bg-white rounded-2xl border-2 p-4 ${
                                            selected === address.addressType
                                                ? 'border-black'
                                                : 'border-gray-100'
                                        }`}
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1">
                                                <View className="flex-row items-center mb-2">
                                                    <FontAwesome5 
                                                        name={address.addressType === 'Home' ? 'home' : 'briefcase'} 
                                                        size={16} 
                                                        color={THEME.colors.primary} 
                                                    />
                                                    <Text className="ml-2 font-semibold text-gray-900">
                                                        {address.addressType}
                                                    </Text>
                                                    {selected === address.addressType && (
                                                        <View className="ml-2 bg-black px-2 py-1 rounded-full">
                                                            <Text className="text-white text-xs font-medium">Selected</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className="text-gray-600 mb-1">{address.address}</Text>
                                                <Text className="text-gray-600 mb-1">{address.city}, {address.state}</Text>
                                                <Text className="text-gray-600">{address.pincode}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => router.push({
                                                    pathname: 'AddressForm',
                                                    params: { addressId: address.address_id }
                                                })}
                                                className="p-2"
                                            >
                                                <FontAwesome5 name="edit" size={16} color={THEME.colors.text.secondary} />
                                            </TouchableOpacity>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </ThemedSection>
                </ScrollView>
            </SafeAreaView>
        </ThemedContainer>
    );
}

export default Address