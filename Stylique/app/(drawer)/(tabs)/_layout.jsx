import { Feather, FontAwesome, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useNotifications } from '../../NotificationProvider';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function TabsLayout() {
  const router = useRouter();
  const navigation = useNavigation();
  const { notifications } = useNotifications();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'lightgray',
        tabBarShowLabel: false,
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarIconStyle: { margin: 10 },
        tabBarStyle: { paddingTop: 6, paddingBottom: 10, height: 80 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
              <MaterialIcons name="notes" size={26} color="black" />
            </Pressable>
          ),
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
          ),
          headerTitle: () => (
            <View className=" items-center">
              <Image source={require('../../../assets/images/Stylique_Text_Logo.png')} style={{ width: 100, height: 100, contentFit: 'contain' }} />
            </View>
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <Pressable onPress={() => router.push("/(screens)/Notification")} className="mr-8">
              <View>
                <FontAwesome name='bell-o' size={25} color={'black'} />
                {hasUnread && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'red',
                    }}
                  />
                )}
              </View>
            </Pressable>
          ),
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
              <MaterialIcons name="notes" size={26} color="black" />
            </Pressable>
          ),
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
          ),
          headerTitle: () => (
            <View className=" items-center">
              <Text className="text-2xl font-bold">Search</Text>
            </View>
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <Pressable onPress={() => router.push("/(screens)/Notification")} className="mr-8">
              <View>
                <FontAwesome name='bell-o' size={25} color={'black'} />
                {hasUnread && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'red',
                    }}
                  />
                )}
              </View>
            </Pressable>
          ),
          title: "",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
              <MaterialIcons name="notes" size={26} color="black" />
            </Pressable>
          ),
          headerTitle: () => (
            <Text className="text-2xl font-bold">Your Cart</Text>
          ),
          headerBackground: () => (
            <View style={{
              backgroundColor: 'white',
              flex: 1,
            }} />
          ),
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="handbag" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={24} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tabs>
  );
}
