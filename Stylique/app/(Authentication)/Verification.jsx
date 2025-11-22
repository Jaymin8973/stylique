import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Verification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params?.email || '';

  const handleContinue = () => {
    router.push({
      pathname: 'Password',
      params: { email },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 1}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          <View className="gap-10">
            <View className="gap-5 ">
              <Text className="text-3xl font-bold">Verification</Text>
              <Text className="text-gray-500">
                We have sent a verification link or code to {email}
              </Text>
            </View>

            <View className="items-center mt-10">
              <TouchableOpacity
                className="bg-[#2D201C] px-12 py-4 rounded-full"
                onPress={handleContinue}
              >
                <Text className="text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verification;

