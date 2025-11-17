import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/Theme';
import { ThemedContainer, ThemedSection, ThemedButton } from '../../components/ThemedComponents';
import API from '../../Api';

const Address = () => {
    const [selectedId, setSelectedId] = useState(null);
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/api/address');
            const data = res.data || [];
            setAddresses(data);
            const defaultAddress = data.find(addr => addr.isDefault === true);
            if (defaultAddress) {
                setSelectedId(defaultAddress.id);
            } else if (data.length > 0) {
                setSelectedId(data[0].id);
            } else {
                setSelectedId(null);
            }
        }
        catch (error) {
            if (error.response) {
                alert(error.response.data.message || error.response.data.error || "Server error");
            } else if (error.request) {
                alert("Network error, please try again");
            } else {
                console.log(error.message);
                alert(error.message);
            }
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const SelectHandle = async (addressId) => {
        setSelectedId(addressId);
        try {
            setLoading(true);
            await API.patch(`/api/address/${addressId}/default`);
            await fetchData();
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message || error.response.data.error || "Server error");
            } else if (error.request) {
                alert("Network error, please try again");
            } else {
                console.log(error.message);
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }

    };

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
                               
                            </View>
                        ) : (
                            <View className="gap-4">
                                {addresses.map((address) => (
                                    <Pressable
                                        key={address.id}
                                        onPress={() => SelectHandle(address.id)}
                                        className={`bg-white rounded-2xl border-2 p-4 ${
                                            selectedId === address.id
                                                ? 'border-black'
                                                : 'border-gray-100'
                                        }`}
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1">
                                                <View className="flex-row items-center mb-2">
                                                    <FontAwesome5 
                                                        name="map-marker-alt" 
                                                        size={16} 
                                                        color={THEME.colors.primary} 
                                                    />
                                                    <Text className="ml-2 font-semibold text-gray-900">
                                                        Delivery Address
                                                    </Text>
                                                    {selectedId === address.id && (
                                                        <View className="ml-2 bg-black px-2 py-1 rounded-full">
                                                            <Text className="text-white text-xs font-medium">Selected</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className="text-gray-600 mb-1">{address.houseNo}, {address.street}</Text>
                                                <Text className="text-gray-600 mb-1">{address.city}, {address.state}</Text>
                                                <Text className="text-gray-600">{address.pincode}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => router.push({
                                                    pathname: 'AddressForm',
                                                    params: { addressId: address.id }
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