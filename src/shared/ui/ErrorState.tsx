import { type ReactElement } from "react";
import { Text, View } from "react-native";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps): ReactElement {
  return (
    <View className="flex-1 items-center justify-center px-screen-x">
      <Text className="font-sans text-base text-error">{message}</Text>
    </View>
  );
}
