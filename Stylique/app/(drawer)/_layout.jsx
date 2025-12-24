import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from './CustomDrawerContent';
import { Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function DrawerLayout() {
    const navigation = useNavigation();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerStyle: {
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        overflow: 'hidden',
                    },
                    drawerActiveBackgroundColor: 'transparent',
                    drawerActiveTintColor: 'black',
                    drawerInactiveTintColor: 'gray',
                    headerShown: false,
                }}

            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Homepage',
                        title: 'Homepage',
                        drawerIcon: ({ color, focused }) => (
                            <Octicons name="home" size={24} color={focused ? "black" : "gray"} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="MyOrders"
                    options={{
                        drawerLabel: 'My Orders',
                        title: 'My Orders',
                        headerShown: true,
                        headerLeft: () => {
                            const navigation = useNavigation();
                            return (
                                <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
                                    <MaterialIcons name="notes" size={26} color="black" style={{ transform: [{ scaleY: -1 }] }} />
                                </Pressable>
                            );
                        },
                        drawerIcon: ({ color, focused }) => (
                            <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={focused ? "black" : "gray"} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Setting"
                    options={{
                        drawerLabel: 'Settings',
                        title: 'Settings',
                        headerShown: true,
                        headerLeft: () => {
                            const navigation = useNavigation();
                            return (
                                <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
                                    <MaterialIcons name="notes" size={26} color="black" style={{ transform: [{ scaleY: -1 }] }} />
                                </Pressable>
                            );
                        },
                        drawerIcon: ({ color, focused }) => (
                            <AntDesign name="setting" size={24} color={focused ? "black" : "gray"} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Support"
                    options={{
                        drawerLabel: 'Support',
                        title: 'Support',
                        headerShown: true,
                        headerLeft: () => {
                            const navigation = useNavigation();
                            return (
                                <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
                                    <MaterialIcons name="notes" size={26} color="black" style={{ transform: [{ scaleY: -1 }] }} />
                                </Pressable>
                            );
                        },
                        drawerIcon: ({ color, focused }) => (
                            <MaterialCommunityIcons name="email-outline" size={24} color={focused ? "black" : "gray"} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="AboutUs"
                    options={{
                        drawerLabel: 'About Us',
                        title: 'About Us',
                        headerShown: true,
                        headerLeft: () => {
                            const navigation = useNavigation();
                            return (
                                <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-8">
                                    <MaterialIcons name="notes" size={26} color="black" style={{ transform: [{ scaleY: -1 }] }} />
                                </Pressable>
                            );
                        },
                        drawerIcon: ({ color, focused }) => (
                            <Feather name="alert-circle" size={24} color={focused ? "black" : "gray"} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
