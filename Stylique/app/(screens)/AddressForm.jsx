import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { ThemedContainer, ThemedSection, ThemedButton } from '../../components/ThemedComponents';
import { THEME } from '../../constants/Theme';
import API from '../../Api';

const AddressForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressId = params.addressId ? Number(params.addressId) : null;
  const isEditing = !!addressId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    pincode: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    isDefault: false,
  });

  const loadAddress = useCallback(async () => {
    if (!isEditing) return;
    try {
      setLoading(true);
      const res = await API.get(`/api/address/${addressId}`);
      const a = res.data;
      setForm({
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        mobileNumber: a.mobileNumber || '',
        pincode: a.pincode || '',
        houseNo: a.houseNo || '',
        street: a.street || '',
        city: a.city || '',
        state: a.state || '',
        isDefault: !!a.isDefault,
      });
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: 'error',
          text1:
            error.response.data.message ||
            error.response.data.error ||
            'Failed to load address',
        });
      } else {
        Toast.show({ type: 'error', text1: 'Network error, please try again' });
      }
    } finally {
      setLoading(false);
    }
  }, [addressId, isEditing]);

  useEffect(() => {
    loadAddress();
  }, [loadAddress]);



  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) {
      Toast.show({ type: 'error', text1: 'First name is required' });
      return false;
    }
    if (!form.mobileNumber.trim() || form.mobileNumber.trim().length < 10) {
      Toast.show({ type: 'error', text1: 'Valid mobile number is required' });
      return false;
    }
    if (!form.pincode.trim()) {
      Toast.show({ type: 'error', text1: 'Pincode is required' });
      return false;
    }
    if (!form.houseNo.trim()) {
      Toast.show({ type: 'error', text1: 'House / Flat no. is required' });
      return false;
    }
    if (!form.street.trim()) {
      Toast.show({ type: 'error', text1: 'Street is required' });
      return false;
    }
    if (!form.city.trim()) {
      Toast.show({ type: 'error', text1: 'City is required' });
      return false;
    }
    if (!form.state.trim()) {
      Toast.show({ type: 'error', text1: 'State is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      mobileNumber: form.mobileNumber.trim(),
      pincode: form.pincode.trim(),
      houseNo: form.houseNo.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
    };

    if (form.isDefault) {
      payload.isDefault = true;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await API.patch(`/api/address/${addressId}`, payload);
        Toast.show({ type: 'success', text1: 'Address updated' });
      } else {
        await API.post('/api/address', payload);
        Toast.show({ type: 'success', text1: 'Address added' });
      }
      router.push('Address');
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: 'error',
          text1:
            error.response.data.message ||
            error.response.data.error ||
            'Failed to save address',
        });
      } else {
        Toast.show({ type: 'error', text1: 'Network error, please try again' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text className="mt-4 text-gray-600">
            {isEditing ? 'Loading address...' : 'Preparing form...'}
          </Text>
        </View>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView className="flex-1">
          <ThemedSection className="pt-4 pb-8">
            <View className="gap-6">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">First Name</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.firstName}
                    onChangeText={(t) => updateField('firstName', t)}
                    placeholder="John"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">Last Name</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.lastName}
                    onChangeText={(t) => updateField('lastName', t)}
                    placeholder="Doe"
                  />
                </View>
              </View>

              <View>
                <Text className="text-gray-600 mb-1">Mobile Number</Text>
                <TextInput
                  className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                  value={form.mobileNumber}
                  onChangeText={(t) => updateField('mobileNumber', t)}
                  keyboardType="phone-pad"
                  maxLength={15}
                  placeholder="10-digit mobile number"
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">Pincode</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.pincode}
                    onChangeText={(t) => updateField('pincode', t)}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="Pincode"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">House / Flat No.</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.houseNo}
                    onChangeText={(t) => updateField('houseNo', t)}
                    placeholder="House no., building"
                  />
                </View>
              </View>

              <View>
                <Text className="text-gray-600 mb-1">Street / Area</Text>
                <TextInput
                  className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                  value={form.street}
                  onChangeText={(t) => updateField('street', t)}
                  placeholder="Street, area, landmark"
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">City</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.city}
                    onChangeText={(t) => updateField('city', t)}
                    placeholder="City"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">State</Text>
                  <TextInput
                    className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-base"
                    value={form.state}
                    onChangeText={(t) => updateField('state', t)}
                    placeholder="State"
                  />
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-900 font-semibold">Set as default</Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    This address will be used by default for deliveries.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => updateField('isDefault', !form.isDefault)}
                  className={`w-12 h-7 rounded-full flex-row items-center px-1 ${
                    form.isDefault ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full bg-white ${
                      form.isDefault ? 'ml-5' : 'ml-0'
                    }`}
                  />
                </TouchableOpacity>
              </View>

              <ThemedButton
                title={saving ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}
                onPress={handleSubmit}
                disabled={saving}
                className="mt-4 "
              />
            </View>
          </ThemedSection>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedContainer>
  );
};

export default AddressForm;
