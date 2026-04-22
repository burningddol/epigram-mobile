import type { ReactElement, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeaderBackButton } from "~/widgets/header";

interface ScreenLayoutProps {
  children: ReactNode;
  headerRight?: ReactElement;
  withKeyboardAvoiding?: boolean;
}

export function ScreenLayout({
  children,
  headerRight,
  withKeyboardAvoiding = true,
}: ScreenLayoutProps): ReactElement {
  const body = withKeyboardAvoiding ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-screen-x py-2">
        <HeaderBackButton />
        {headerRight}
      </View>
      {body}
    </SafeAreaView>
  );
}
