import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const Voucher = () => {
return (
    <ScrollView>
          <SafeAreaView>
    <View className="flex-row bg-white rounded-xl shadow-lg mx-4 my-4">
      <View className="bg-[#23262F] rounded-l-xl w-20  justify-center items-center">
        <Text className="text-3xl text-white font-extrabold">20%</Text>
      </View>
      <View className="flex-1 py-4 px-4 justify-center">
        <Text className="text-lg font-semibold text-gray-800">First order</Text>
        <Text className="text-base text-gray-500 mt-1">Sale off 50%</Text>
        <Text className="mt-3 text-base font-extrabold text-gray-700 ">Code: <Text className="font-bold">welcome</Text></Text>
      </View>
      <View className="items-end justify-center pr-4  ps-5  border-l border-gray-300">
        <Text className="text-gray-400 text-xs">Exp.</Text>
        <Text className="text-lg text-black font-bold mt-1">28</Text>
        <Text className="text-gray-600 text-base font-medium -mt-1">Dec</Text>
      </View>
    </View>
    </SafeAreaView>
       </ScrollView>
  );
}

export default Voucher