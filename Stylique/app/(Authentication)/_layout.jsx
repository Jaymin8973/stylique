import { AntDesign } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Pressable, View } from 'react-native';

const _layout = () => {
 
  return (
    <Stack>
        <Stack.Screen name='Login' options={{headerShown:false}} />
        <Stack.Screen name='Signup' options={{headerShown:false}} />
        <Stack.Screen name='ForgotPassword'  options={({navigation})=>({
              headerLeft:()=>(
                   <Pressable className=" rounded-full p-2 " onPress={()=>navigation.goBack()}>
                        <AntDesign name="left" size={20} color="black" />
                     </Pressable>
              ),
              headerTitle:"",
               headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
            })} />
        <Stack.Screen name='Verification' options={({navigation})=>({
              headerLeft:()=>(
                   <Pressable className=" rounded-full p-2 " onPress={()=>navigation.goBack()}>
                        <AntDesign name="left" size={20} color="black" />
                     </Pressable>
              ),
              headerTitle:"",
               headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
            })} />
        <Stack.Screen name='Password'options={({navigation})=>({
              headerLeft:()=>(
                   <Pressable className=" rounded-full p-2 " onPress={()=>navigation.goBack()}>
                        <AntDesign name="left" size={20} color="black" />
                     </Pressable>
              ),
              headerTitle:"",
               headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
            })}/>
    </Stack>
  )
}

export default _layout