import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Tabs, useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotifications } from '../NotificationProvider';
import AboutUs from '../(slidebar)/AboutUs';
import Setting from '../(slidebar)/Setting';
import Support from '../(slidebar)/Support';
import MyOrders from '../(screens)/MyOrders';
import API from '../../Api';

const _layout = () => {
  const [name , setName] = useState(null);
  const [email , setEmail] = useState(null);
  const FetchData = async () => {
    try {
    const UserID = await SecureStore.getItemAsync('userId');
    if (UserID) {
     const res = await API.get(`/api/user/${UserID}`);
     console.log(res.data)
      const Name = res.data.Username;
      setName(Name);
      setEmail(res.data.Email);
    }
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  useFocusEffect(
  useCallback(() => {
    FetchData();
  }, [])
);

  

  const Drawer = createDrawerNavigator();

  function CustomDrawerContent(props) {

    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.topContent} className=" flex-row ">
          <View style={styles.logo}>
            <Text style={styles.logoLetter}>
              {(() => {
                const raw = (name && name.trim()) || (email && email.split('@')[0]) || 'U';
                const words = raw.split(/\s+/).filter(Boolean);
                if (words.length >= 2) {
                  return (words[0][0] + words[1][0]).toUpperCase();
                }
                const compact = raw.replace(/[^A-Za-z0-9]/g, '');
                const base = compact || 'U';
                return base.slice(0, 2).toUpperCase();
              })()}
            </Text>
          </View>
          <View className="ms-5">
            <Text style={styles.username}>{name ? name : "User"}</Text>
            <Text className="text-xl">{email ? email : "user@example.com"}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  function TabNavigator() {
    const router = useRouter();
    const { notifications } = useNotifications();
    const hasUnread = notifications.some((n) => !n.read);
    return (
      <Tabs screenOptions={{
        tabBarActiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'lightgray',
        tabBarShowLabel: false,
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarIconStyle: { margin: 10 },
        tabBarStyle: { paddingTop: 6, paddingBottom: 10, height: 80 },
      }}>
        <Tabs.Screen
          name="index"
          options={({ navigation }) => ({
            headerLeft: () => (
              <Pressable onPress={() => navigation.getParent()?.openDrawer()} className="ml-8">
               <MaterialIcons name="notes" size={30} color="black" className="" style={{ transform: [{ scaleY: -1 }] }} />
              </Pressable>
            ),
            drawerLabel: ({ focused, color }) => (
              <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
                Homepage
              </Text>
            ),
            drawerIcon: ({ color, size, focused }) => (
              <Octicons name="home" size={24} color={focused ? "black" : "gray"} />
            ),
               headerBackground: () => (
            <View style={{flex:1, backgroundColor: 'white' }} />
          ),
            headerTitle: () => (
              <Text className="text-2xl font-bold">Stylique</Text>
            ),
            headerTitleAlign: 'center',
            headerRight: () => (
              <Pressable onPress={() => router.push("/(screens)/Notification")} className="mr-8" >
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
          })}
        />
        <Tabs.Screen
          name="Search"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={24} color={color} />
            ),
            headerShown:false
          }}
        />
        <Tabs.Screen
          name="Cart"
          options={({ navigation }) => ({
            headerLeft: () => (
              <Pressable className="rounded-full p-2 bg-white ms-5" onPress={() => navigation.getParent()?.openDrawer()}>
                <MaterialIcons name="notes" size={20} color="black" />
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
          })} 
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={24} color={color} />
            ),
            headerShown:false
            
          }}
        />
      </Tabs>
    );
  }

  return (

    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
        },
        drawerActiveBackgroundColor: 'transparent',
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen name="Homepage" component={TabNavigator}
        options={{
          headerShown: false,
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
              Homepage
            </Text>
          ),
          drawerIcon: ({ color, size, focused }) => (
            <Octicons name="home" size={24} color={focused ? "black" : "gray"} />
          ),
        }} 
      />

      <Drawer.Screen name="MyOrders" component={MyOrders}
        options={({ navigation }) => ({
            headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">My Orders</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
              My Orders
            </Text>
          ),
          drawerIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={focused ? "black" : "gray"} />
          ),
        })} 
      />

      <Drawer.Screen name="Setting" component={Setting}
        options={({ navigation }) => ({
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
              Setting
            </Text>
          ),
          drawerIcon: ({ color, size, focused }) => (
            <AntDesign name="setting" size={24} color={focused ? "black" : "gray"} />
          ),
           headerLeft: () => (
              <Pressable onPress={() => navigation.openDrawer()} className="ml-8">
               <MaterialIcons name="notes" size={24} color="black" />
              </Pressable>
            ),

             headerBackground: () => (
            <View style={{ backgroundColor: 'transparent' }} />
          ),
            headerTitle: () => (
              <Text className="text-2xl font-bold">Setting</Text>
            ),
            headerTitleAlign: 'center',
        })} />
      <Drawer.Screen name="Support" component={Support}
        options={{
          headerShown: false,
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
              Support
            </Text>
          ),
          drawerIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="email-outline" size={24} color={focused ? "black" : "gray"} />
          ),
        }} />
      <Drawer.Screen name="AboutUs" component={AboutUs}
        options={{
          headerShown: false,
          drawerLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
              About us
            </Text>
          ),
          drawerIcon: ({ color, size, focused }) => (
            <Feather name="alert-circle" size={24} color={focused ? "black" : "gray"} />
          ),
        }} />

     
    </Drawer.Navigator>

  );
};

const styles = StyleSheet.create({
  topContent: {
    padding: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
    backgroundColor: '#343434',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoLetter: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default _layout;
