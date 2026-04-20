import type { ReactElement } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginForm } from "~/features/auth";

export function LoginScreen(): ReactElement {
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
