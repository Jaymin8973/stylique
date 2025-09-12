import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { List, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Stars from 'react-native-stars';
import API from '../../Api';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const [rating, setRating] = useState(0);
  const [expand, setExpand] = useState(false);

  const bottomSheetRef = useRef(null);

  // snap points (height values)
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleOpen = () => bottomSheetRef.current?.expand();
  const handleClose = () => bottomSheetRef.current?.close();

  useEffect(() => {
    if (id) {
      API.get(`/products/${id}`)
        .then(response => setProduct(response.data))
        .catch(console.error);

      API.get(`/rating/${id}`)
        .then(response => setRating(response.data))
        .catch(console.error);
    }
  }, [id]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
  };

  if (!product) return <Text>Loading...</Text>;

  const colorArray = JSON.parse(product.color);
  const sizeArray = JSON.parse(product.size);

  const bottomSheetHeight = 90;
  console.log(rating);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: bottomSheetHeight }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 gap-5 ">
            <Image source={{ uri: product.imageUrl }} style={{ height: 400, width: '100%' }} />
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold m-4">{product.name}</Text>
              <Text className="text-xl font-bold m-4">{product.price}$</Text>
            </View>
            <View className="flex-row items-center px-4 gap-2">
              <Stars
                default={rating.avgRating}
                count={5}
                disabled={true}
                half={true}
                starSize={30}
                fullStar={<MaterialCommunityIcons name="star" size={30} color="#508A7B" />}
                emptyStar={<MaterialCommunityIcons name="star-outline" size={30} color="#508A7B" />}
                halfStar={<MaterialCommunityIcons name="star-half" size={30} color="#508A7B" />}
              />
              <Text className="text-gray-600 text-lg">({rating.totalCount})</Text>
            </View>
            <View className="px-4">
              <View>
                <View className="gap-2 flex-row justify-between">
                  <View className=" gap-2">
                    <Text className="text-xl text-gray-600">Color</Text>
                    <View className="flex-row gap-2">
                      {colorArray.map((color, index) => (
                        <View key={index} className={`w-8 h-8 rounded-full `} style={{ backgroundColor: color }} />
                      ))}
                    </View>
                  </View>
                  <View className="gap-2">
                    <Text className="text-xl text-gray-600">Size</Text>
                    <View className="flex-row gap-2">
                      {sizeArray.map((size, index) => (
                        <Text key={index} className=" text-gray-600 border p-2">{size}</Text>
                      ))}
                    </View>
                  </View>

                </View>
              </View>
            </View>
            <View className="mt-4">
              <List.Accordion
                title="Description"
                expanded={expand}
                titleStyle={{ fontSize: 20, fontWeight: 'semibold' }}
                style={{ backgroundColor: 'white' , borderWidth:1, borderColor:'#e0e0e0', height:60}}
                right={props => <MaterialCommunityIcons {...props} name={expand ? "chevron-up" : "chevron-down"} size={24} color="black" />}
                rippleColor={'white'}
              >
                <List.Item title={product.description} titleNumberOfLines={10} />
              </List.Accordion>
            </View>

            <View className="mt-4">
              <List.Accordion
                title="Reviews"
                titleStyle={{ fontSize: 20, fontWeight: 'semibold' }}
                style={{ backgroundColor: 'white' }}
                rippleColor={'white'}
              >
                <List.Item title={
                  <View>
                    <View className="w-full flex-row justify-between items-center">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-5xl font-bold">{rating.avgRating}</Text>
                        <Text className="text-sm text-gray-500">OUT OF 5</Text>
                      </View>

                      <View className="items-end gap-2">
                        <Stars
                          default={rating.avgRating}
                          disabled={true}
                          count={5}
                          half={true}
                          starSize={30}
                          fullStar={<MaterialCommunityIcons name="star" size={30} color="#508A7B" />}
                          emptyStar={<MaterialCommunityIcons name="star-outline" size={30} color="#508A7B" />}
                          halfStar={<MaterialCommunityIcons name="star-half" size={30} color="#508A7B" />}
                        />
                        <Text className="text-md text-gray-500">{rating.totalCount} ratings</Text>
                      </View>
                    </View>
                      {rating ? (
                        [5, 4, 3, 2, 1].map(star => {
                          const progressValue = (rating.ratingPercentages?.[star.toString()] ?? "100") / 100;
                          console.log(progressValue);
                          const displayPercentage = rating.ratingPercentages?.[star.toString()] ?? "0";

                          return (
                            <View key={star} className="flex-row w-full items-center ">
                              <Text className="text-lg text-gray-500">
                                {star} <MaterialCommunityIcons name="star" size={20} color="#508A7B" />
                              </Text>
                              <ProgressBar
                                progress={progressValue}
                                color="#508A7B"
                                style={{ height: 10, borderRadius: 20 }}
                                className="w-72 mx-4 my-3"
                              />
                              <Text style={{ width: 40, textAlign: 'right' }}>
                                {displayPercentage}%
                              </Text>
                            </View>
                          );
                        })
                      ) : (
                        <Text>Loading ratings...</Text> 
                      )}
                    </View>

                } titleNumberOfLines={10} />
              </List.Accordion>
            </View>
          </View>

        </SafeAreaView>
      </ScrollView>

      {/* Bottom Fixed Sheet */}
      <View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
        <Text style={{ textAlign: 'center' }} className="text-white font-bold text-2xl">
          <Ionicons name="bag-check-sharp" size={24} color="white" />  Add To Cart
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  dot: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: "#4F4F4F",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4F4F4F",
    height: 10,
    width: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#343434',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

