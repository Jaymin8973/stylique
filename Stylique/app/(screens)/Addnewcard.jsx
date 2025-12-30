
import { Image, ImageBackground } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { usePayment } from '../../hooks/usePayment';

const Addnewcard = () => {
    const [cardType, setCardType] = useState('Visa');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const animatedValue = useRef(new Animated.Value(0)).current;
    const inputref = useRef(null);
    /* Removed local API creation */
    const { addPaymentCard, isAddingCard: loading } = usePayment();

    const validationSchema = yup.object().shape({
        cardNumber: yup.string().required('Card number is required'),
        cardHolderName: yup.string().required('Card holder name is required'),
        expirationDate: yup.string().required('Expiration date is required'),
        cvv: yup.string().required('CVV is required'),
    });




    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            cardHolderName: '',
            expirationDate: '',
            cvv: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const Email = await SecureStore.getItemAsync('userEmail');
                const payload = { ...values, email: Email };
                // loading state handled by hook (bound to loading variable)
                await addPaymentCard(payload);
                // Success Toast handled in hook, but if we need specific navigation or clean up:
                // Hook handles toast.
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message || "Server error");
                } else if (error.request) {
                    alert("Network error, please try again");
                } else {
                    console.log(error.message);
                    alert(error.message);
                }
            }
        },
    });

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipCard = (toBack) => {
        if (toBack) {
            Animated.timing(animatedValue, {
                toValue: 180,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start();
        }
    };


    const cardLogos = {
        Visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
        MasterCard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
        'American Express': 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
        Rupay: 'https://www.pngkey.com/png/full/129-1290304_file-rupay-logo-rupay-card.png',
    };

    const formatExpiry = (value) => {
        let cleaned = value.replace(/[^0-9]/g, '');

        if (cleaned.length > 2) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }

        return cleaned.slice(0, 5);
    };

    if (Platform.OS == 'ios') {
        return (
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}

                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20, justifyContent: 'flex-start' }} >

                        <View className="gap-10">
                            <Animated.View
                                style={{
                                    borderRadius: 20,
                                    backfaceVisibility: 'hidden',
                                    transform: [{ rotateY: frontInterpolate }],
                                }}
                            >
                                <View className="">
                                    <ImageBackground
                                        source={require('../../assets/images/CardBackground.png')}
                                        className="rounded-2xl "
                                    >
                                        <Image
                                            source={{ uri: cardLogos['Visa'] }}
                                            style={{ width: 80, height: 50, contentFit: 'contain', position: 'absolute', top: 10, right: 10 }}
                                        />
                                        <View className="h-60 justify-center rounded-2xl bg-[#09A3C5] -z-10 ">
                                            <View className="flex-grow  items-center justify-end h-1/4">
                                                <Text className="text-white text-2xl" style={{ letterSpacing: 5 }}>
                                                    {cardNumber ? cardNumber : '**** **** **** ****'}
                                                </Text>
                                            </View>

                                            <View className="p-5 flex-1 justify-end">
                                                <View className="flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-white text-md font-bold">CARD HOLDER NAME</Text>
                                                        <Text className="text-white text-lg">{cardHolderName ? cardHolderName : 'Name'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Animated.View>
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: [{ rotateY: backInterpolate }],
                                }}
                            >
                                <View className="">
                                    <View className="h-60 justify-center rounded-2xl bg-[#09A3C5] -z-10 ">
                                        <View className="flex-grow items-start justify-center">
                                            <View className=" w-full h-14 bg-black"></View>
                                        </View>

                                        <View className="p-5 flex-1 justify-end">
                                            <View className="flex-row justify-between items-center">
                                                <View>
                                                    <Text className="text-white text-md font-bold">VALID THRU</Text>
                                                    <Text className="text-white text-lg ">{expiryDate ? expiryDate : 'MM/YY'}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-white text-md font-bold">CVV</Text>
                                                    <Text className="text-white text-lg">{cvv ? cvv : 'CVV'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </Animated.View>
                            <View className="gap-10">
                                <View className="gap-2">
                                    <Text className="text-lg font-bold">Cardholder Name</Text>
                                    <TextInput
                                        className="border-b border-gray-400 text-lg pb-2"
                                        placeholder="Enter Name"
                                        placeholderTextColor="gray"
                                        onFocus={() => {
                                            flipCard(false);
                                        }}
                                        onBlur={() => {
                                            formik.setFieldTouched('cardHolderName');
                                        }}
                                        onChangeText={(text) => {
                                            setCardHolderName(text);
                                            formik.setFieldValue('cardHolderName', text);
                                        }}
                                        value={formik.values.cardHolderName}
                                    />
                                </View>

                                <View className="gap-2">
                                    <Text className="text-lg font-bold">Card Number</Text>
                                    <TextInput
                                        className="border-b border-gray-400 text-lg pb-2" placeholder="Enter Card Number" placeholderTextColor="gray" keyboardType="numeric" maxLength={19} onFocus={() => {
                                            flipCard(false);
                                        }}
                                        onBlur={(text) => {

                                            formik.setFieldTouched('cardNumber');
                                        }}
                                        onChangeText={(text) => {
                                            const formatted = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                            setCardNumber(formatted);
                                            formik.handleChange('cardNumber')(formatted);
                                        }}
                                        value={formik.values.cardNumber} />
                                </View>

                                <View className="flex-row justify-between gap-4">
                                    <View className="gap-2 w-1/2">
                                        <Text className="text-lg font-bold">Expiry Date</Text>
                                        <TextInput
                                            className="border-b border-gray-400 text-lg pb-2"
                                            placeholder="MM/YY"
                                            placeholderTextColor="gray"
                                            keyboardType="numeric"
                                            maxLength={5}
                                            ref={inputref}
                                            onChangeText={(text) => {
                                                const formatted = formatExpiry(text);
                                                setExpiryDate(formatted);
                                                formik.handleChange('expirationDate')(formatted);
                                            }}
                                            value={formik.values.expirationDate}
                                            onBlur={() => {
                                                formik.setFieldTouched('expirationDate');
                                            }}
                                            onFocus={() => {
                                                flipCard(true);
                                            }} />
                                    </View>

                                    <View className="gap-2 w-1/3">
                                        <Text className="text-lg font-bold">CVV</Text>
                                        <TextInput className="border-b border-gray-400 text-lg pb-2" placeholder="CVV" placeholderTextColor="gray" keyboardType="numeric" maxLength={3}
                                            onChangeText={(text) => {
                                                setCvv(text);
                                                formik.handleChange('cvv')(text);
                                            }} value={formik.values.cvv} onFocus={() => {
                                                flipCard(true);
                                            }} />
                                    </View>
                                </View>
                                <View className="mt-10 justify-center items-center">
                                    <TouchableOpacity className="bg-[#343434] rounded-full px-20 py-5" onPress={formik.handleSubmit} disabled={loading}>
                                        <Text className="text-lg font-bold text-white">Add Card</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
    else {
        return (
            <SafeAreaView className="flex-1">
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    extraScrollHeight={20}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps="handled"
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20, justifyContent: 'flex-start' }}>

                        <View className="gap-10">
                            <Animated.View
                                style={{
                                    borderRadius: 20,
                                    backfaceVisibility: 'hidden',
                                    transform: [{ rotateY: frontInterpolate }],
                                }}
                            >
                                <View className="">
                                    <ImageBackground
                                        source={require('../../assets/images/CardBackground.png')}
                                        className="rounded-2xl "
                                    >
                                        <Image
                                            source={{ uri: cardLogos['Visa'] }}
                                            style={{ width: 80, height: 50, contentFit: 'contain', position: 'absolute', top: 10, right: 10 }}
                                        />
                                        <View className="h-60 justify-center rounded-2xl bg-[#09A3C5] -z-10 ">
                                            <View className="flex-grow  items-center justify-end h-1/4">
                                                <Text className="text-white text-2xl" style={{ letterSpacing: 5 }}>
                                                    {cardNumber ? cardNumber : '**** **** **** ****'}
                                                </Text>
                                            </View>

                                            <View className="p-5 flex-1 justify-end">
                                                <View className="flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-white text-md font-bold">CARD HOLDER NAME</Text>
                                                        <Text className="text-white text-lg">{cardHolderName ? cardHolderName : 'Name'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Animated.View>
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: [{ rotateY: backInterpolate }],
                                }}
                            >
                                <View className="">
                                    <View className="h-60 justify-center rounded-2xl bg-[#09A3C5] -z-10 ">
                                        <View className="flex-grow items-start justify-center">
                                            <View className=" w-full h-14 bg-black"></View>
                                        </View>

                                        <View className="p-5 flex-1 justify-end">
                                            <View className="flex-row justify-between items-center">
                                                <View>
                                                    <Text className="text-white text-md font-bold">VALID THRU</Text>
                                                    <Text className="text-white text-lg ">{expiryDate ? expiryDate : 'MM/YY'}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-white text-md font-bold">CVV</Text>
                                                    <Text className="text-white text-lg">{cvv ? cvv : 'CVV'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </Animated.View>
                            <View className="gap-10">
                                <View className="gap-2">
                                    <Text className="text-lg font-bold">Cardholder Name</Text>
                                    <TextInput
                                        className="border-b border-gray-400 text-lg pb-2"
                                        placeholder="Enter Name"
                                        placeholderTextColor="gray"
                                        onFocus={() => {
                                            flipCard(false);
                                        }}
                                        onBlur={() => {
                                            formik.setFieldTouched('cardHolderName');
                                        }}
                                        onChangeText={(text) => {
                                            setCardHolderName(text);
                                            formik.setFieldValue('cardHolderName', text);
                                        }}
                                        value={formik.values.cardHolderName}
                                    />
                                </View>

                                <View className="gap-2">
                                    <Text className="text-lg font-bold">Card Number</Text>
                                    <TextInput
                                        className="border-b border-gray-400 text-lg pb-2" placeholder="Enter Card Number" placeholderTextColor="gray" keyboardType="numeric" maxLength={19} onFocus={() => {
                                            flipCard(false);
                                        }}
                                        onBlur={(text) => {

                                            formik.setFieldTouched('cardNumber');
                                        }}
                                        onChangeText={(text) => {
                                            const formatted = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                            setCardNumber(formatted);
                                            formik.handleChange('cardNumber')(formatted);
                                        }}
                                        value={formik.values.cardNumber} />
                                </View>

                                <View className="flex-row justify-between gap-4">
                                    <View className="gap-2 w-1/2">
                                        <Text className="text-lg font-bold">Expiry Date</Text>
                                        <TextInput
                                            className="border-b border-gray-400 text-lg pb-2"
                                            placeholder="MM/YY"
                                            placeholderTextColor="gray"
                                            keyboardType="numeric"
                                            maxLength={5}
                                            ref={inputref}
                                            onChangeText={(text) => {
                                                const formatted = formatExpiry(text);
                                                setExpiryDate(formatted);
                                                formik.handleChange('expirationDate')(formatted);
                                            }}
                                            value={formik.values.expirationDate}
                                            onBlur={() => {
                                                formik.setFieldTouched('expirationDate');
                                            }}
                                            onFocus={() => {
                                                flipCard(true);
                                            }} />
                                    </View>

                                    <View className="gap-2 w-1/3">
                                        <Text className="text-lg font-bold">CVV</Text>
                                        <TextInput className="border-b border-gray-400 text-lg pb-2" placeholder="CVV" placeholderTextColor="gray" keyboardType="numeric" maxLength={3}
                                            onChangeText={(text) => {
                                                setCvv(text);
                                                formik.handleChange('cvv')(text);
                                            }} value={formik.values.cvv} onFocus={() => {
                                                flipCard(true);
                                            }} />
                                    </View>
                                </View>
                                <View className="mt-10 justify-center items-center">
                                    <TouchableOpacity className="bg-[#343434] rounded-full px-20 py-5" onPress={formik.handleSubmit} disabled={loading}>
                                        <Text className="text-lg font-bold text-white">Add Card</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

export default Addnewcard