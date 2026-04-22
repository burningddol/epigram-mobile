import { router } from "expo-router";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { SignUpForm } from "~/features/auth";
import { ScreenLayout } from "~/shared/ui";

export function SignUpScreen(): ReactElement {
  function handleGoToLogin(): void {
    router.replace("/login");
  }

  return (
    <ScreenLayout>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-screen-x py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10 items-center gap-2">
          <Text className="font-serif-bold text-4xl text-blue-800">
            epigram
          </Text>
          <Text className="font-sans text-sm text-black-300">회원가입</Text>
        </View>
        <SignUpForm />
        <View className="mt-6 flex-row justify-center gap-1">
          <Text className="font-sans text-sm text-black-300">
            이미 회원이신가요?
          </Text>
          <Pressable onPress={handleGoToLogin} accessibilityRole="link">
            <Text className="font-sans text-sm font-semibold text-blue-600">
              로그인
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
