import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Image } from 'expo-image';
import { Tabs, useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import AboutUs from '../(slidebar)/AboutUs';
import Setting from '../(slidebar)/Setting';
import Support from '../(slidebar)/Support';
import IpAddress from '../../Config.json';

const _layout = () => {
  const [image , setImage] = useState(null);
  const [name , setName] = useState(null);
  const [email , setEmail] = useState(null);
  const Navigation = useNavigation();
const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:3000`,
});


  const FetchData = async () => {
    try {
      const email = await SecureStore.getItemAsync('userEmail');
      const res = await API.post(`/users/user`, { email });
      const Name = res.data.user.firstname + " " + res.data.user.lastname;
      setImage(res.data.user.image);
      setName(Name);
      setEmail(res.data.user.email);
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
          <Image
            source={image ? { uri: image } : require("../../assets/images/User.jpg")}
            style={styles.logo}
          />
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
              <Pressable onPress={() => navigation.openDrawer()} className="ml-8">
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
            <View style={{ backgroundColor: 'transparent' }} />
          ),
            headerTitle: () => (
              <Text className="text-2xl font-bold">Stylique</Text>
            ),
            headerTitleAlign: 'center',
            headerRight: () => (
              <Pressable onPress={()=>router.push("Notification")} className="mr-8" >
                <FontAwesome name='bell-o' size={25} color={'black'} />
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
          options={{
            title: "",
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
        drawerActiveBackgroundColor: 'trasperent',
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
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default _layout;
