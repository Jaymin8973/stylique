import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IpAddress from '../../Config.json';

const EditProfile = () => {
    const [image, setImage] = useState(null);
    const [Email, setEmail] = useState(null);
    const [initialValues, setIntialvalues] = useState(null)
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:3000`,
});
    const options = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const handleSelect = (value) => {
        setSelectedValue(value);
        setOpen(false);
        formik.setFieldValue('gender', value);
    };

    const formik = useFormik({
        initialValues: initialValues || { firstname: '', lastname: '', email: '', phone: '', gender: '', image: '' },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const email = await SecureStore.getItemAsync('userEmail');
                const response = await API.put(`/users/updateUser`, {
                    email,
                    ...values,
                });
                alert("Profile updated successfully");
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message || "Server error");
                } else if (error.request) {
                    alert("Network error, please try again");
                } else {
                    console.log(error.message);
                    alert(error.message);
                }
            } ''
        },
    });

    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = async () => {
        try {
            const email = await SecureStore.getItemAsync('userEmail');
            const res = await API.post(`http://${IpAddress.IpAddress}:3000/users/user`, { email });
            setImage(res.data.user.image);
            setSelectedValue(res.data.user.gender || '');
            setIntialvalues({
                firstname: res.data.user.firstname || '',
                lastname: res.data.user.lastname || '',
                email: res.data.user.email || '',
                phone: res.data.user.phone || '',
                gender: res.data.user.gender || '',
                image: res.data.user.image || ''
            });
        } catch (err) {
            alert(err?.response?.data?.message || err.message);
        }
    };

    const getEmail = async () => {
        const email = await SecureStore.getItemAsync('userEmail');
        setEmail(email);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
            formik.setFieldValue('image', uri);
        }
    };


    if (!initialValues) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }
    else {
        return (

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View>
                            <View className=" justify-center items-center ">
                                <Image
                                    source={{ uri: image }}
                                    style={{ height: 150, width: 150, borderRadius: 100 }}
                                />
                                <TouchableOpacity className="absolute top-32 right-36 bg-[#353945] p-5 rounded-full" onPress={pickImage}>
                                    <Feather name="camera" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="gap-10 mx-5 mt-20">
                                <View className="flex-row gap-5">
                                    <View className="w-1/2">
                                        <Text className="text-xl mb-2 text-gray-500">
                                            FirstName
                                        </Text>
                                        <TextInput
                                            className="border-b border-gray-300 text-xl pb-2"
                                            value={formik.values.firstname}
                                            onChangeText={formik.handleChange('firstname')}
                                            onBlur={formik.handleBlur('firstname')}
                                        />
                                    </View>

                                    <View className="w-44">
                                        <Text className="text-xl mb-2 text-gray-500">
                                            Last Name
                                        </Text>
                                        <TextInput
                                            className="border-b border-gray-300 text-xl pb-2"
                                            value={formik.values.lastname}
                                            onChangeText={formik.handleChange('lastname')}
                                            onBlur={formik.handleBlur('lastname')}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-xl mb-2 text-gray-500">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="border-b border-gray-300 text-xl  pb-2"
                                        value={formik.values.email}
                                        onChangeText={formik.handleChange('email')}
                                        onBlur={formik.handleBlur('email')}
                                        editable={false}
                                    />
                                </View>

                                <View className="flex-row gap-5">

                                    <View className="w-44 justify-center">
                                        <Text className="text-xl mb-2 text-gray-500">Gender</Text>
                                        <View className="">
                                            <TouchableOpacity
                                                className="w-44 border-b border-gray-300 rounded-lg "
                                                onPress={() => setOpen(true)}
                                            >
                                                <Text className="text-gray-900 text-xl">
                                                    {selectedValue
                                                        ? options.find((opt) => opt.value === selectedValue)?.label
                                                        : 'Select Gender'}
                                                </Text>
                                            </TouchableOpacity>

                                            <Modal
                                                transparent
                                                animationType="fade"
                                                visible={open}
                                                onRequestClose={() => setOpen(false)}
                                                
                                            >
                                                <Pressable
                                                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                                                    onPress={() => setOpen(false)}
                                                    className="justify-center "
                                                >
                                                    <View className="bg-white  rounded-lg p-4 mx-8 mt-24 max-h-72">
                                                        <FlatList
                                                            data={options}
                                                            keyExtractor={(item) => item.value}
                                                            renderItem={({ item }) => (
                                                                <TouchableOpacity
                                                                    className="p-3 border-b border-gray-200"
                                                                    onPress={() => handleSelect(item.value)}
                                                                >
                                                                    <Text className="text-base text-gray-800">{item.label}</Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        />
                                                    </View>
                                                </Pressable>
                                            </Modal>
                                        </View>
                                    </View>

                                    <View className="w-1/2">
                                        <Text className="text-xl mb-2 text-gray-500">
                                            Phone
                                        </Text>
                                        <TextInput
                                            className="border-gray-300 border-b text-xl pb-2"
                                            value={formik.values.phone}
                                            onChangeText={formik.handleChange('phone')}
                                            onBlur={formik.handleBlur('phone')}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className="mt-20 items-center">
                                <TouchableOpacity
                                    onPress={formik.handleSubmit}
                                    disabled={formik.isSubmitting}
                                    className="bg-[#343434] px-20 py-5 rounded-full"
                                >
                                    <Text className="text-white text-xl">
                                        {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
export default EditProfile