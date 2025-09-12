import axios from 'axios';
import { Image, ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IpAddress from '../../Config.json';

const cardLogos = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    MasterCard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    'American Express': 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
    Rupay: 'https://www.pngkey.com/png/full/129-1290304_file-rupay-logo-rupay-card.png',
};

const Payment = () => {
    const [cardData, setCardData] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const flipAnimations = useRef([]);
    const [flippedIndexes, setFlippedIndexes] = useState({});
     const [refreshing, setRefreshing] = useState(false);

       const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCards();
    setRefreshing(false);
  }, []);



    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const Email = await SecureStore.getItemAsync('userEmail');
            const response = await axios.post(`http://${IpAddress.IpAddress}:3000/payment-cards/getCard`, { email: Email });
            setCardData(response.data);
            flipAnimations.current = response.data.map(() => new Animated.Value(0));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const flipCard = (index) => {
        const isFlipped = flippedIndexes[index];
        const toValue = isFlipped ? 0 : 180;
        Animated.timing(flipAnimations.current[index], {
            toValue,
               duration: 600,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
        }).start();
        setFlippedIndexes((prev) => ({ ...prev, [index]: !isFlipped }));
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <ScrollView className="flex-1"  refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
            <SafeAreaView className="flex-grow mx-5">
                <View>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-2xl font-bold">Card Management</Text>
                        <Pressable onPress={() => router.push('/Addnewcard')}>
                            <Text className="text-xl font-semibold text-red-600">Add New +</Text>
                        </Pressable>
                    </View>
                    {cardData &&
                        cardData.map((card, index) => {
                            const frontInterpolate = flipAnimations.current[index]?.interpolate({
                                inputRange: [0, 180],
                                outputRange: ['0deg', '180deg'],
                            }) || '0deg';

                            const backInterpolate = flipAnimations.current[index]?.interpolate({
                                inputRange: [0, 180],
                                outputRange: ['180deg', '360deg'],
                            }) || '180deg';

                            const isFlipped = flippedIndexes[index];

                            return (
                                <View key={index} className="my-5 ">
                                    <Pressable onLongPress={() => flipCard(index)}>
                                        {isFlipped ? (
                                            <Animated.View
                                                style={{
                                                    transform: [{ rotateY: backInterpolate }],
                                                    backfaceVisibility: 'hidden',
                                                
                                                }}
                                            >
                                                <View className="rounded-2xl bg-[#09A3C5] h-60 justify-center -z-10">
                                                    <View className="flex-grow items-start justify-center">
                                                        <View className="w-full h-14 bg-black rounded-lg"></View>
                                                    </View>
                                                    <View className="p-5 flex-1 justify-end">
                                                        <View className="flex-row justify-between items-center">
                                                            <View>
                                                                <Text className="text-white text-md font-bold">VALID THRU</Text>
                                                                <Text className="text-white text-lg">{card.expirationDate ? card.expirationDate : 'MM/YY'}</Text>
                                                            </View>
                                                            <View>
                                                                <Text className="text-white text-md font-bold">CVV</Text>
                                                                <Text className="text-white text-lg">{card.cvv ? card.cvv : 'CVV'}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Animated.View>
                                        ) : (
                                            <Animated.View
                                                style={{
                                                    transform: [{ rotateY: frontInterpolate }],
                                                    backfaceVisibility: 'hidden',
                                                }}
                                            >
                                                <ImageBackground
                                                    source={require('../../assets/images/CardBackground.png')}
                                                    className="rounded-2xl h-60"
                                                >
                                                    <Image
                                                        source={{ uri: cardLogos['Visa'] }}
                                                        style={{ width: 80, height: 50, resizeMode: 'contain', position: 'absolute', top: 10, right: 10 }}
                                                    />
                                                    <View className="h-60 justify-center rounded-2xl bg-[#09A3C5] -z-10 ">
                                                        <View className="flex-grow  items-center justify-end h-1/4">
                                                            <Text className="text-white text-2xl" style={{ letterSpacing: 5 }}>
                                                                {card.cardNumber ? card.cardNumber : '**** **** **** ****'}
                                                            </Text>
                                                        </View>
                                                        <View className="p-5 flex-1 justify-end">
                                                            <View className="flex-row justify-between items-center">
                                                                <View>
                                                                    <Text className="text-white text-md font-bold">CARD HOLDER NAME</Text>
                                                                    <Text className="text-white text-lg">{card.cardHolderName ? card.cardHolderName : 'Name'}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </ImageBackground>
                                            </Animated.View>
                                        )}
                                    </Pressable>
                                </View>
                            );
                        })}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Payment;
