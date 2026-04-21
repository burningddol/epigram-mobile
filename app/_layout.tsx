import "../global.css";

import {
  NanumMyeongjo_400Regular,
  NanumMyeongjo_700Bold,
} from "@expo-google-fonts/nanum-myeongjo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle } from "lucide-react-native";
import { useEffect, type ReactElement } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import "react-native-reanimated";

import { useSessionExpiryRedirect } from "~/features/auth";
import { QueryProvider } from "~/shared/api/QueryProvider";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

interface RouteErrorBoundaryProps {
  error: Error;
  retry: () => Promise<void>;
}

export function ErrorBoundary({
  error,
  retry,
}: RouteErrorBoundaryProps): ReactElement {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <AlertTriangle size={32} color="#f87171" strokeWidth={1.5} />
        <Text className="font-serif text-xl text-black-700">
          화면을 표시하지 못했습니다
        </Text>
        <Text className="text-center font-sans text-sm text-black-500">
          {error.message}
        </Text>
        <Pressable
          onPress={() => {
            void retry();
          }}
          accessibilityRole="button"
          accessibilityLabel="다시 시도"
          className="mt-2 rounded-full border border-blue-500 px-6 py-2"
        >
          <Text className="font-sans text-sm text-blue-500">다시 시도</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AppShell(): ReactElement {
  useSessionExpiryRedirect();

  return (
    <>
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
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Pretendard: require("pretendard/dist/public/variable/PretendardVariable.ttf"),
    NanumMyeongjo: NanumMyeongjo_400Regular,
    "NanumMyeongjo-Bold": NanumMyeongjo_700Bold,
  });

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
      <AppShell />
    </QueryProvider>
  );
}
