import { type ReactElement } from "react";
import { ActivityIndicator, View } from "react-native";

export function LoadingState(): ReactElement {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color="#6a82a9" />
    </View>
  );
}
