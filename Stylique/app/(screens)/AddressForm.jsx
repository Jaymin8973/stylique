import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useFormik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import IpAddress from '../../Config.json';


const AddressForm = () => {
    const [open, setOpen] = React.useState(false);
    const API = axios.create({
        baseURL: `http://${IpAddress.IpAddress}:3000`,
    });

    const AddressSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        mobileNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Must be 10 digits')
            .required('Mobile Number is required'),
        pincode: Yup.string()
            .matches(/^[0-9]{6}$/, 'Must be 6 digits')
            .required('Pincode is required'),
        houseNo: Yup.string().required('House No is required'),
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        addressType: Yup.string().required('Address type is required'),
    });



    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            mobileNumber: '',
            pincode: '',
            houseNo: '',
            street: '',
            city: '',
            state: '',
            addressType: '',
        },
        validationSchema: AddressSchema,
        onSubmit: async (values) => {
            try {
                const email = await SecureStore.getItemAsync('userEmail');
                await API.post('/address/add', {
                    email,
                    ...values,
                })

                Toast.show({
                    type: 'success',
                    text1: 'Address Added',
                    text2: 'Your address has been successfully added!'
                });
                formik.resetForm();
                router.replace('/Address');
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

    });


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
                <View>
                    <Text className="text-gray-500 text-lg mb-1">First Name*</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="First Name"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('firstName')}
                        onBlur={formik.handleBlur('firstName')}
                        value={formik.values.firstName}
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                        <Text className="text-red-500 mb-2">{formik.errors.firstName}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Last Name</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="Last Name"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('lastName')}
                        onBlur={formik.handleBlur('lastName')}
                        value={formik.values.lastName}
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                        <Text className="text-red-500 mb-2">{formik.errors.lastName}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Mobile Number</Text>
                    <TextInput
                        keyboardType="phone-pad"
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="Mobile Number"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('mobileNumber')}
                        onBlur={formik.handleBlur('mobileNumber')}
                        value={formik.values.mobileNumber}
                        maxLength={10}
                    />
                    {formik.errors.mobileNumber && formik.touched.mobileNumber && (
                        <Text className="text-red-500 mb-2">{formik.errors.mobileNumber}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Pincode</Text>
                    <TextInput
                        keyboardType="number-pad"
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="Pincode"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('pincode')}
                        onBlur={formik.handleBlur('pincode')}
                        value={formik.values.pincode}
                        maxLength={6}
                    />
                    {formik.errors.pincode && formik.touched.pincode && (
                        <Text className="text-red-500 mb-2">{formik.errors.pincode}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Flat, House no., Building, Company, Apartment</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="House no., Building, Apartment"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('houseNo')}
                        onBlur={formik.handleBlur('houseNo')}
                        value={formik.values.houseNo}
                    />
                    {formik.errors.houseNo && formik.touched.houseNo && (
                        <Text className="text-red-500 mb-2">{formik.errors.houseNo}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Area, Street, Sector, Village</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="Area, Street, Sector, Village"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('street')}
                        onBlur={formik.handleBlur('street')}
                        value={formik.values.street}
                    />
                    {formik.errors.street && formik.touched.street && (
                        <Text className="text-red-500 mb-2">{formik.errors.street}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">Town/City</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="Town/City"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('city')}
                        onBlur={formik.handleBlur('city')}
                        value={formik.values.city}
                    />
                    {formik.errors.city && formik.touched.city && (
                        <Text className="text-red-500 mb-2">{formik.errors.city}</Text>
                    )}

                    <Text className="text-gray-500 text-lg mb-1">State</Text>
                    <TextInput
                        className="border-b border-gray-300 text-lg rounded-md py-3 mb-2"
                        placeholder="State"
                        placeholderTextColor={'gray'}
                        onChangeText={formik.handleChange('state')}
                        onBlur={formik.handleBlur('state')}
                        value={formik.values.state}
                    />
                    {formik.errors.state && formik.touched.state && (
                        <Text className="text-red-500 mb-2">{formik.errors.state}</Text>
                    )}
                    <View className="mb-6 z-50">
                        <Text className="text-gray-500 text-lg mb-1">Address Type</Text>
                        <DropDownPicker
                            open={open}
                            value={formik.values.addressType}
                            items={[
                                { label: 'Home', value: 'home' },
                                { label: 'Work', value: 'work' },
                                { label: 'Other', value: 'other' },
                            ]}
                            setOpen={setOpen}
                            setValue={(callback) => formik.setFieldValue('addressType', callback())}
                            placeholder="Select address type"
                            placeholderTextColor={'lightgray'}
                            containerStyle={{
                            }}
                            style={{
                                borderColor: '#d1d5db',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingHorizontal: 10,
                                height: 44,
                            }}
                            dropDownContainerStyle={{
                                borderColor: '#d1d5db',
                            }}
                        />
                        {formik.errors.addressType && formik.touched.addressType && (
                            <Text className="text-red-500">{formik.errors.addressType}</Text>
                        )}
                    </View>

                    <Pressable
                        className="bg-[#343434] py-4 rounded-md"
                        onPress={formik.handleSubmit}
                    >
                        <Text className="text-white font-bold text-center text-lg">Save Address</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddressForm;
