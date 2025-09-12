import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Notification = () => {
    const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <ScrollView>
      <SafeAreaView>
        <View className="mx-5 gap-10 px-5">
            <View className="border px-5 py-3 gap-2 rounded-lg border-gray-300">
              <Text className="text-lg font-semibold">Good morning! Get20% Voucher</Text>
              <Text className="text-gray-500 text-lg">Summer sale up to 20% off. Limited voucher. Get now!! 😜</Text>
              </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Notification