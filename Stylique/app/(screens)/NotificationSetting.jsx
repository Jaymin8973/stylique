import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const NotificationSetting = () => {
        const [isEnabled, setIsEnabled] = useState(false);
      const toggleSwitch = () => setIsEnabled(previousState => !previousState);
 return (
    <ScrollView>
      <SafeAreaView>
        <View className="mx-5 gap-10">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl mb-1">
                Show Notification
              </Text>
              <Text className="text-l text-gray-400">
                Receive push notifications for new message
              </Text>
            </View>
            <View>
               <Switch
          trackColor={{false: '#CBCDD8', true: '#508A7B'}}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
            </View>
          </View>

            <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl mb-1">
                Notification sounds
              </Text>
              <Text className="text-l text-gray-400">
                Play sound for new message
              </Text>
            </View>
            <View>
               <Switch
          trackColor={{false: '#CBCDD8', true: '#508A7B'}}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={""}
        />
            </View>
          </View>

            <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl mb-1">
                Lock screen Notification
              </Text>
              <Text className="text-l text-gray-400">
                Allow notification on the lock screen
              </Text>
            </View>
            <View>
               <Switch
          trackColor={{false: '#CBCDD8', true: '#508A7B'}}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={""}
        />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default NotificationSetting