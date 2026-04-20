import { Redirect, router } from "expo-router";
import type { ReactElement } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";
import { SignUpForm } from "~/features/auth";

export function SignUpScreen(): ReactElement | null {
  const { user, isLoading } = useMe();

  if (isLoading) return null;
  if (user) return <Redirect href="/feeds" />;

  function handleGoToLogin(): void {
    router.replace("/login");
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
            <Text className="font-sans text-sm text-black-300">회원가입</Text>
          </View>
          <SignUpForm />
          <View className="mt-6 flex-row justify-center gap-1">
            <Text className="font-sans text-sm text-black-300">이미 회원이신가요?</Text>
            <Pressable onPress={handleGoToLogin} accessibilityRole="link">
              <Text className="font-sans text-sm font-semibold text-blue-600">로그인</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
