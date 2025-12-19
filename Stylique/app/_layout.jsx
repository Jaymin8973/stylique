import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from 'react-native-toast-message';
import { NotificationProvider } from "./NotificationProvider";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        const token = await AsyncStorage.getItem("userToken");

        setHasOnboarded(onboarded === "true");
        setUserToken(token);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NotificationProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(Onboarding)" />
          <Stack.Screen name="(Authentication)" />
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="(screens)" />
        </Stack>
        <Toast position="top" autoHide={true} visibilityTime={2500} topOffset={50} />
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </NotificationProvider>
  );
}
