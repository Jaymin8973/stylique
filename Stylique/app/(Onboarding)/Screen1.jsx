import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function Onboarding() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // AUTO SCROLL FULL SLIDE (TEXT + IMAGE)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === slides.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(tabs)");
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.topPart}>
        <View style={{ top: 64, gap: 20 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.imageBox}>
          <Image source={item.image} style={styles.image} />
        </View>
      </View>

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
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* AUTO-SCROLLING SLIDES */}
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        ref={flatListRef}
      />

      {/* FIXED BUTTON */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Shopping Now</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
  topPart: {
    flex: 1,
    alignItems: "center",
  },
  imageBox: {
    height: 350,
    width: 270,
    borderRadius: 25,
    backgroundColor: "#E7E8E9",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    top: 100,
  },
  image: {
    width: 400,
    height: 600,
    resizeMode: "cover",
    top: 140,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
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
    backgroundColor: "white",
    width: 8,
  },

  // FIXED BUTTON
  fixedButtonContainer: {
    position: "absolute",
    bottom: 150,
    width: "100%",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "#343434",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
  },
});
