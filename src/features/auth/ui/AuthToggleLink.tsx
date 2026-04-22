import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

interface AuthToggleLinkProps {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthToggleLink({
  prompt,
  linkLabel,
  onPress,
}: AuthToggleLinkProps): ReactElement {
  return (
    <View className="mt-6 flex-row justify-center gap-1">
      <Text className="font-sans text-sm text-black-300">{prompt}</Text>
      <Pressable onPress={onPress} accessibilityRole="link">
        <Text className="font-sans text-sm font-semibold text-blue-600">
          {linkLabel}
        </Text>
      </Pressable>
    </View>
  );
}
