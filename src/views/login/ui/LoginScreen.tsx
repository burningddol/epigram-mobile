import { Redirect, router } from "expo-router";
import type { ReactElement } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";
import { GuestLoginButton, LoginForm } from "~/features/auth";

export function LoginScreen(): ReactElement | null {
  const { user, isLoading } = useMe();

  if (isLoading) return null;
  if (user) return <Redirect href="/feeds" />;

  function handleGoToSignUp(): void {
    router.push("/signup");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-screen-x py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center gap-2">
            <Text className="font-serif-bold text-4xl text-blue-800">epigram</Text>
            <Text className="font-sans text-sm text-black-300">인생 명언을 모아보세요</Text>
          </View>
          <LoginForm />
          <View className="mt-3">
            <GuestLoginButton />
          </View>
          <View className="mt-6 flex-row justify-center gap-1">
            <Text className="font-sans text-sm text-black-300">아직 회원이 아니신가요?</Text>
            <Pressable onPress={handleGoToSignUp} accessibilityRole="link">
              <Text className="font-sans text-sm font-semibold text-blue-600">회원가입</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
