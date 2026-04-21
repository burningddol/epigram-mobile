import "../global.css";

import {
  NanumMyeongjo_400Regular,
  NanumMyeongjo_700Bold,
} from "@expo-google-fonts/nanum-myeongjo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useSessionExpiryRedirect } from "~/features/auth";
import { QueryProvider } from "~/shared/api/QueryProvider";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Pretendard: require("pretendard/dist/public/variable/PretendardVariable.ttf"),
    NanumMyeongjo: NanumMyeongjo_400Regular,
    "NanumMyeongjo-Bold": NanumMyeongjo_700Bold,
  });

  useSessionExpiryRedirect();

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen
          name="epigrams/[id]/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="epigrams/[id]/edit"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </QueryProvider>
  );
}
