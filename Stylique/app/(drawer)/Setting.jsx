import { AntDesign, Feather, FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Setting = () => {

const router = useRouter();

  return (
    <SafeAreaView className= "flex-1">
        <ScrollView  contentContainerStyle={{ flexGrow: 1  }}>
        <View className="mx-7 gap-5 ">
          <View className="rounded-2xl ">
            <TouchableOpacity onPress={() => (router.replace("/(Authentication)"))}>
              <View className="flex-row  items-center justify-between border-b border-gray-300 pb-3 ">
                <View className="flex-row gap-3 items-center">
                 <Fontisto name="world-o" size={24} color="gray" />
                  <Text className="text-2xl">Language</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push("NotificationSetting"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                 <FontAwesome name="bell-o" size={24} color="gray" />

                  <Text className="text-2xl">Notification</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.replace("/(Authentication)"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                 <MaterialCommunityIcons name="clipboard-text-play-outline" size={24} color="gray" />

                  <Text className="text-2xl">Terms of Use</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.replace("/(Authentication)"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                 <Feather name="alert-circle" size={24} color="gray" />

                  <Text className="text-2xl">Privacy Policy</Text>

                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (router.replace("/(Authentication)"))}>
              <View className="flex-row  mt-10 items-center justify-between border-b border-gray-300 pb-3">
                <View className="flex-row gap-3 items-center">
                 <FontAwesome5 name="location-arrow" size={24} color="gray" />
                  <Text className="text-2xl">Chat support</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </View>
            </TouchableOpacity>
           
          </View>
        </View>
    </ScrollView>
      </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  topContent: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});


export default Setting