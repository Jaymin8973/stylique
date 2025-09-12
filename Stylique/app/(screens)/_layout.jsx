import { AntDesign } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

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


      <Stack.Screen name='Payment' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold">Payment</Text>
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
          <View style={{ backgroundColor: 'white' }} />
        ),
      })} />


   <Stack.Screen name='ProductDetail'  options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold"></Text>
        ),
        headerTransparent: true,
      })} />

       <Stack.Screen name='Test' options={({ navigation }) => ({
        headerLeft: () => (
          <Pressable className=" rounded-full p-2 " onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="black" />
          </Pressable>
        ),
        headerTitle: () => (
          <Text className="text-2xl font-bold"></Text>
        ),
        headerBackground: () => (
          <View style={{ backgroundColor: 'white' }} />
        ),
      })} />


    </Stack>
  )
}

export default _layout