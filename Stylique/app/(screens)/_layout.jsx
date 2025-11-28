import { AntDesign } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import Payment from './PaymentMethod'

const _layout = () => {
  return (
    <Stack >
      <Stack.Screen name="Notification" options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl  font-bold">Notification</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='EditProfile' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Profile Setting</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='NotificationSetting' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Notification</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='Voucher' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Voucher</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      })} />


      <Stack.Screen name='Checkout' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Checkout</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      })} />



      <Stack.Screen name='Addnewcard' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Add new card</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='Feedback' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Share your feedback</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
      })} />


      <Stack.Screen name='AddressForm' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Address</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
      })} />


      <Stack.Screen name='PaymentMethod' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Address</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='Address' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Delivery Address</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'transparent' }} />
        ),
      })} />

      <Stack.Screen name='AlllProducts' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">All Products</Text>
        ),
        headerBackground: () => (
          <View style={{
            backgroundColor: 'white',
            flex: 1,
          }} />
        ),
      })} />


      <Stack.Screen name='ProductDetail' options={({ navigation }) => ({
        headerShown: false,
      })} />

      <Stack.Screen name='Wishlist' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">My Wishlist</Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'white', flex: 1 }} />
        ),
      })} />

      <Stack.Screen name='CollectionDetail' options={({ navigation , route }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">
            {route.params?.title ?? "Collection"}
          </Text>
        ),

        headerBackground: () => (
          <View style={{ backgroundColor: 'white', flex: 1 }} />
        ),
      })} />


      <Stack.Screen name='SaleDetail'options={({ navigation , route }) => ({
        headerShown: false
      })} />




    </Stack>





  )
}

export default _layout