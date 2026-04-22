import type { ReactElement } from "react";
import { Text, View } from "react-native";

interface AuthBrandHeaderProps {
  subtitle: string;
}

export function AuthBrandHeader({ subtitle }: AuthBrandHeaderProps): ReactElement {
  return (
    <View className="mb-10 items-center gap-2">
      <Text className="font-serif-bold text-4xl text-blue-800">epigram</Text>
      <Text className="font-sans text-sm text-black-300">{subtitle}</Text>
    </View>
  );
}
