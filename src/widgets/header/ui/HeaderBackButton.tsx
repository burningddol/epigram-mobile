import { router, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable } from "react-native";

interface HeaderBackButtonProps {
  fallbackHref?: Href;
}

export function HeaderBackButton({
  fallbackHref = "/feeds",
}: HeaderBackButtonProps): ReactElement {
  function handleBack(): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackHref);
  }

  return (
    <Pressable
      onPress={handleBack}
      accessibilityRole="button"
      accessibilityLabel="뒤로 가기"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-blue-200"
    >
      <ArrowLeft size={22} color="#454545" />
    </Pressable>
  );
}
