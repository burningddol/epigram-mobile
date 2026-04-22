import { router } from "expo-router";
import type { ReactElement } from "react";
import { ScrollView, View } from "react-native";

import {
  AuthBrandHeader,
  AuthToggleLink,
  GuestLoginButton,
  LoginForm,
} from "~/features/auth";
import { ScreenLayout } from "~/shared/ui";

export function LoginScreen(): ReactElement {
  return (
    <ScreenLayout>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-screen-x py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthBrandHeader subtitle="인생 명언을 모아보세요" />
        <LoginForm />
        <View className="mt-3">
          <GuestLoginButton />
        </View>
        <AuthToggleLink
          prompt="아직 회원이 아니신가요?"
          linkLabel="회원가입"
          onPress={() => router.push("/signup")}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
