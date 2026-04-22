import { router } from "expo-router";
import type { ReactElement } from "react";
import { ScrollView } from "react-native";

import { AuthBrandHeader, AuthToggleLink, SignUpForm } from "~/features/auth";
import { ScreenLayout } from "~/shared/ui";

export function SignUpScreen(): ReactElement {
  return (
    <ScreenLayout>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-screen-x py-10"
        keyboardShouldPersistTaps="handled"
      >
        <AuthBrandHeader subtitle="회원가입" />
        <SignUpForm />
        <AuthToggleLink
          prompt="이미 회원이신가요?"
          linkLabel="로그인"
          onPress={() => router.replace("/login")}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
