import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Discover something new",
    subtitle: "Special new arrivals just for you",
    image: require("../../assets/images/Screen1.png"),
  },
  {
    id: "2",
    title: "Update trendy outfit",
    subtitle: "Favorite brands and hottest trends",
    image: require("../../assets/images/Screen2.png"),
  },
  {
    id: "3",
    title: "Explore your true style",
    subtitle: "Relax and let us bring the style to you",
    image: require("../../assets/images/Screen3.png"),
  },
];

export default function Onboarding({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
  };

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      router.replace("Login");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.topPart}>
        <View className="top-16 gap-5">
          <Text className="text-center text-2xl font-bold">{item.title}</Text>
          <Text className="text-center">{item.subtitle}</Text>
        </View>
        <View
          style={{
            height: 350,
            width: 270,
            borderRadius: 25,
            backgroundColor: '#E7E8E9',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            top: 100
          }}
        >
          <Image
            source={item.image}
            style={{
              width: 400,
              height: 600,
              resizeMode: 'cover',
              top: 140
            }}
          />
        </View>
      </View>


      <View style={styles.bottomPart}>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} className="bg-[#FFFFFF40]">
          <Text style={styles.buttonText}>
           Shopping Now
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View >
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          scrollEnabled={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          ref={flatListRef}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  topPart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPart: {
    flex: 1,
    backgroundColor: "#464447",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: -10,
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "transparent",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

});
