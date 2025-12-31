import AsyncStorage from "@react-native-async-storage/async-storage"; // make sure installed
import { BlurView } from "expo-blur";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const Onboarding = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardStatus = async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      if (onboarded === "true") {
        router.replace("/(tabs)");
      } else {
        setLoading(false);
      }
    };

    checkOnboardStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/Onboarding.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View className="flex-1 justify-end items-center bg-black/60 gap-5">
        <View className="justify-center items-center gap-10 mb-36">
          <View className="justify-center items-center gap-3">
            <Text className="text-white text-4xl font-bold">
              Welcome to Stylique!
            </Text>
            <Text className="text-white text-xl">
              The home for a fashionista
            </Text>
          </View>
          <View className="border border-white rounded-full overflow-hidden bg-gray-500/30">
            <BlurView intensity={15} tint="light">
              <Pressable
                onPress={() => router.push("Screen1")}
                className="px-16 py-4 rounded-full"
              >
                <Text className="text-white text-lg font-bold">
                  Get Started
                </Text>
              </Pressable>
            </BlurView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
